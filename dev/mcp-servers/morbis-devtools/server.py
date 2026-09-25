"""
Morbis DevTools MCP Server

MCP server untuk development dan debugging Morbis Ext Unofficial.
Update: mendukung TypeScript source di src/features/, MCP config, dan tools baru.
"""

import os
import re
import json
import hashlib
import time
from pathlib import Path
from typing import Optional

import httpx
from mcp.server.fastmcp import FastMCP
from dotenv import load_dotenv

load_dotenv()

BASE_URL = os.getenv("MORBIS_BASE_URL", "http://103.147.236.140")
MORBIS_USERNAME = os.getenv("MORBIS_USERNAME", "")
MORBIS_PASSWORD = os.getenv("MORBIS_PASSWORD", "")

CACHE_DIR = Path(__file__).parent / ".cache"
CACHE_DIR.mkdir(exist_ok=True)

# Project root: mcp-servers/morbis-devtools/server.py -> ../../ (project root)
PROJECT_ROOT = Path(__file__).parent.parent.parent
SRC_FEATURES = PROJECT_ROOT / "src" / "features"
BUILD_SCRIPT = PROJECT_ROOT / "scripts" / "build.mjs"
MANIFEST = PROJECT_ROOT / "manifest.json"

mcp = FastMCP("Morbis DevTools")


class MorbisSession:
    """Manages Morbis HIS session with auto-relogin."""

    def __init__(self):
        self._client: Optional[httpx.Client] = None
        self._logged_in = False
        self._last_activity = 0
        self._session_timeout = 1800

    def _get_client(self) -> httpx.Client:
        if self._client is None:
            self._client = httpx.Client(
                base_url=BASE_URL,
                follow_redirects=False,
                timeout=30,
                headers={
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                },
            )
        return self._client

    def _is_session_valid(self) -> bool:
        if not self._logged_in:
            return False
        if time.time() - self._last_activity > self._session_timeout:
            return False
        return True

    def login(self) -> bool:
        if not MORBIS_USERNAME or not MORBIS_PASSWORD:
            return False
        try:
            client = self._get_client()
            response = client.post(
                "/login",
                data={"username": MORBIS_USERNAME, "password": MORBIS_PASSWORD},
                follow_redirects=False,
            )
            if response.status_code in (301, 302, 303):
                location = response.headers.get("location", "")
                if "login" not in location.lower():
                    self._logged_in = True
                    self._last_activity = time.time()
                    return True
            if "login" not in response.url.path.lower():
                self._logged_in = True
                self._last_activity = time.time()
                return True
            return False
        except Exception:
            return False

    def ensure_session(self) -> bool:
        if self._is_session_valid():
            self._last_activity = time.time()
            return True
        return self.login()

    def get(self, url: str, params: Optional[dict] = None) -> httpx.Response:
        if not self.ensure_session():
            raise Exception("Failed to establish Morbis session")
        client = self._get_client()
        full_url = url if url.startswith("http") else BASE_URL + url
        response = client.get(full_url, params=params)
        if response.status_code in (301, 302, 303):
            location = response.headers.get("location", "")
            if "login" in location.lower():
                if self.login():
                    response = client.get(full_url, params=params)
        self._last_activity = time.time()
        return response

    def close(self):
        if self._client:
            self._client.close()
            self._client = None


_session = MorbisSession()


@mcp.tool()
def scrape_morbis_page(
    url: str,
    css_selector: Optional[str] = None,
    extract_tables: bool = False,
) -> dict:
    """Scrape halaman Morbis HIS dengan session management otomatis.

    Args:
        url: URL halaman (relative atau absolute)
        css_selector: CSS selector untuk ekstrak elemen spesifik (opsional)
        extract_tables: Jika True, ekstrak semua tabel

    Returns:
        Dict dengan keys: success, html, text, tables, selected_html, error
    """
    try:
        response = _session.get(url)
        if response.status_code != 200:
            return {"success": False, "error": f"HTTP {response.status_code}"}

        html = response.text
        text = re.sub(r"<[^>]+>", " ", html)
        text = re.sub(r"\s+", " ", text).strip()

        result = {
            "success": True,
            "status_code": response.status_code,
            "url": str(response.url),
            "html_length": len(html),
            "text_preview": text[:500] if text else "",
            "tables": [],
            "selected_html": "",
        }

        if extract_tables:
            tables = re.findall(r"<table[^>]*>(.*?)</table>", html, re.DOTALL | re.IGNORECASE)
            result["tables"] = [{"index": i, "html_preview": t[:200]} for i, t in enumerate(tables)]
            result["table_count"] = len(tables)

        if css_selector:
            if css_selector.startswith("#"):
                id_name = css_selector[1:]
                match = re.search(rf'<[^>]*id=["\']{id_name}["\'][^>]*>(.*?)</[^>]*>', html, re.DOTALL | re.IGNORECASE)
                if match:
                    result["selected_html"] = match.group(0)[:1000]
            elif css_selector.startswith("."):
                class_name = css_selector[1:]
                match = re.search(rf'<[^>]*class=["\'][^"\']*{class_name}[^"\']*["\'][^>]*>(.*?)</[^>]*>', html, re.DOTALL | re.IGNORECASE)
                if match:
                    result["selected_html"] = match.group(0)[:1000]

        return result
    except Exception as e:
        return {"success": False, "error": str(e)}


@mcp.tool()
def read_config() -> dict:
    """Read the current extension configuration and feature list.

    Returns:
        Dict dengan keys: manifest, build_config, features, types
    """
    features = []
    if SRC_FEATURES.exists():
        for ts_file in sorted(SRC_FEATURES.rglob("*.ts")):
            rel = ts_file.relative_to(PROJECT_ROOT)
            content = ts_file.read_text()
            features.append({
                "path": str(rel),
                "size": len(content),
                "imports": re.findall(r"import .+ from ['\"](.+)['\"]", content),
                "uses_mutation_observer": "MutationObserver" in content,
                "uses_chrome_storage": "chrome.storage" in content,
                "registers_module": "featureModules" in content,
            })

    manifest_data = {}
    if MANIFEST.exists():
        manifest_data = json.loads(MANIFEST.read_text())

    build_config = {}
    if BUILD_SCRIPT.exists():
        content = BUILD_SCRIPT.read_text()
        whitelist = re.findall(r"'([^']+\.ts)'", content)
        build_config = {
            "ready_ts_files": whitelist,
            "uses_production_flag": "--production" in content,
        }

    return {
        "manifest": {
            "name": manifest_data.get("name"),
            "version": manifest_data.get("version"),
            "content_script_count": len(manifest_data.get("content_scripts", [])),
        },
        "features": {
            "total": len(features),
            "list": features,
        },
        "build": build_config,
    }


@mcp.tool()
def get_feature_source(feature_path: str) -> dict:
    """Read source code of a specific feature file.

    Args:
        feature_path: Path relative to project root (e.g. 'src/features/openDetail.ts')

    Returns:
        Dict dengan keys: path, content, size, exports
    """
    full_path = PROJECT_ROOT / feature_path
    if not full_path.exists():
        return {"error": f"File not found: {feature_path}"}
    if not feature_path.endswith(".ts"):
        return {"error": "Only .ts files are supported"}

    content = full_path.read_text()
    lines = content.split("\n")
    exports = re.findall(r"export (?:default |)(?:function|const|class|interface|type) (\w+)", content)

    return {
        "path": feature_path,
        "size": len(content),
        "lines": len(lines),
        "exports": exports,
        "content": content,
        "preview": "\n".join(lines[:50]),
    }


@mcp.tool()
def validate_build() -> dict:
    """Validate that all TypeScript features compile and pass checks.

    Returns:
        Dict dengan keys: build_ok, lint_ok, typecheck_ok, format_ok, errors
    """
    import subprocess
    import sys

    results = {}
    errors = []

    checks = {
        "build": ["node", "scripts/build.mjs", "--production"],
        "lint": [sys.executable, "-m", "eslint"] if sys.platform != "win32" else ["npx", "eslint", "src/**/*.ts"],
        "typecheck": ["npx", "tsc", "--noEmit"],
    }

    for name, cmd in checks.items():
        try:
            r = subprocess.run(cmd, capture_output=True, text=True, cwd=PROJECT_ROOT, timeout=60)
            results[name] = r.returncode == 0
            if r.returncode != 0:
                errors.append(f"{name}: {r.stderr[:500]}")
        except subprocess.TimeoutExpired:
            results[name] = False
            errors.append(f"{name}: timed out")
        except Exception as e:
            results[name] = False
            errors.append(f"{name}: {str(e)[:200]}")

    return {
        "all_ok": all(results.values()),
        "results": results,
        "errors": errors,
    }


@mcp.tool()
def diff_dom(baseline_html: str, current_html: str, scope: Optional[str] = None) -> dict:
    """Compare dua versi HTML dan identifikasi perbedaan.

    Args:
        baseline_html: HTML baseline (sebelum perubahan)
        current_html: HTML saat ini (setelah perubahan)
        scope: CSS selector untuk scope diff (opsional)

    Returns:
        Dict dengan keys: identical, added_count, removed_count, modified_count, changes
    """
    try:
        def extract_elements(html):
            elements = {}
            for match in re.finditer(r'<(\w+)[^>]*id=["\']([^"\']+)["\'][^>]*>', html):
                tag, id_val = match.group(1), match.group(2)
                elements[f"{tag}#{id_val}"] = match.group(0)[:100]
            for match in re.finditer(r'<(\w+)[^>]*class=["\']([^"\']+)["\'][^>]*>', html):
                tag, class_val = match.group(1), match.group(2)
                key = f"{tag}.{class_val.split()[0]}"
                if key not in elements:
                    elements[key] = match.group(0)[:100]
            return elements

        baseline_elements = extract_elements(baseline_html)
        current_elements = extract_elements(current_html)

        baseline_keys = set(baseline_elements.keys())
        current_keys = set(current_elements.keys())

        added = current_keys - baseline_keys
        removed = baseline_keys - current_keys
        common = baseline_keys & current_keys

        modified = {key for key in common if baseline_elements[key] != current_elements[key]}

        changes = []
        for key in sorted(added):
            changes.append({"type": "added", "selector": key, "detail": current_elements[key][:200]})
        for key in sorted(removed):
            changes.append({"type": "removed", "selector": key, "detail": baseline_elements[key][:200]})
        for key in sorted(modified):
            changes.append({
                "type": "modified",
                "selector": key,
                "detail": f"Changed from '{baseline_elements[key][:50]}...' to '{current_elements[key][:50]}...'",
            })

        return {
            "identical": len(added) == 0 and len(removed) == 0 and len(modified) == 0,
            "added_count": len(added),
            "removed_count": len(removed),
            "modified_count": len(modified),
            "total_elements_baseline": len(baseline_elements),
            "total_elements_current": len(current_elements),
            "changes": changes[:50],
        }
    except Exception as e:
        return {"identical": False, "error": str(e), "changes": []}


@mcp.tool()
def analyze_feature(
    feature_description: str,
    target_module: Optional[str] = None,
) -> dict:
    """Analyze deskripsi feature dan suggest implementasi berdasarkan existing code patterns.

    Args:
        feature_description: Deskripsi feature yang ingin diimplementasikan
        target_module: Modul target (rajal, ranap, billing, dll) - opsional

    Returns:
        Dict dengan keys: matched_patterns, suggested_approach, risks, existing_features
    """
    existing_features = []
    if SRC_FEATURES.exists():
        for ts_file in sorted(SRC_FEATURES.rglob("*.ts")):
            content = ts_file.read_text()
            rel = ts_file.relative_to(PROJECT_ROOT)
            existing_features.append({
                "file": str(rel),
                "size": len(content),
                "uses_mutation_observer": "MutationObserver" in content,
                "uses_css_injection": "createElement('style')" in content or 'createElement("style")' in content,
                "uses_chrome_storage": "chrome.storage" in content,
            })

    desc_lower = feature_description.lower()
    matched_patterns = []

    pattern_keywords = {
        "filter": ["filter", "persistence", "simpan", "restore", "cookie"],
        "button": ["button", "tombol", "shortcut", "click", "navigasi"],
        "print": ["print", "cetak", "layout", "page break"],
        "table": ["table", "tabel", "billing", "ringkas", "summary"],
        "upload": ["upload", "document", "file", "batch"],
        "modal": ["modal", "popup", "overlay", "dialog"],
        "validation": ["validasi", "validate", "format", "check"],
    }

    for pattern, keywords in pattern_keywords.items():
        if any(kw in desc_lower for kw in keywords):
            matched_patterns.append({
                "pattern": pattern,
                "matching_features": [f["file"] for f in existing_features if pattern in f["file"].lower()],
                "common_techniques": ["MutationObserver", "CSS Injection", "Chrome Storage"],
            })

    suggested_approach = "Berdasarkan pattern yang ditemukan:\n"
    for mp in matched_patterns[:3]:
        suggested_approach += f"- Pattern '{mp['pattern']}': lihat {', '.join(mp['matching_features'][:3])}\n"
    suggested_approach += "\nBest practices:\n"
    suggested_approach += "- Import getMorbisGlobals() dari shared/types.ts\n"
    suggested_approach += "- Gunakan getMorbisGlobals().currentConfig?.features?.{nama}?.\n"
    suggested_approach += "- Register module ke window.featureModules\n"
    suggested_approach += "- Gunakan strict TypeScript (noUnusedLocals, noUnusedParameters)\n"

    risks = []
    if "main world" in desc_lower or "global function" in desc_lower:
        risks.append("Memerlukan execution di MAIN world (world: 'MAIN' di manifest)")
    if "mutation" in desc_lower:
        risks.append("MutationObserver bisa menyebabkan performance issue jika tidak di-debounce")

    return {
        "matched_patterns": matched_patterns,
        "suggested_approach": suggested_approach,
        "risks": risks,
        "existing_features": existing_features,
    }


if __name__ == "__main__":
    mcp.run()
