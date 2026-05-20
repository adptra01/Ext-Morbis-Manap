"""
Morbis DevTools MCP Server

MCP server untuk development dan debugging Morbis Ext Unofficial.
Menyediakan tools untuk:
- Scrape halaman Morbis dengan session management
- Diff DOM structure sebelum/sesudah extension injection
- Analyze existing feature code dan suggest patterns
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

# Cookie cache directory
CACHE_DIR = Path(__file__).parent / ".cache"
CACHE_DIR.mkdir(exist_ok=True)

mcp = FastMCP("Morbis DevTools")


class MorbisSession:
    """Manages Morbis HIS session with auto-relogin."""

    def __init__(self):
        self._client: Optional[httpx.Client] = None
        self._logged_in = False
        self._last_activity = 0
        self._session_timeout = 1800  # 30 minutes

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
        """Login to Morbis HIS and store session cookie."""
        if not MORBIS_USERNAME or not MORBIS_PASSWORD:
            return False

        try:
            client = self._get_client()
            response = client.post(
                "/login",
                data={"username": MORBIS_USERNAME, "password": MORBIS_PASSWORD},
                follow_redirects=False,
            )

            # Check if login succeeded (redirect away from /login)
            if response.status_code in (301, 302, 303):
                location = response.headers.get("location", "")
                if "login" not in location.lower():
                    self._logged_in = True
                    self._last_activity = time.time()
                    return True

            # Check if we're already on a non-login page
            if "login" not in response.url.path.lower():
                self._logged_in = True
                self._last_activity = time.time()
                return True

            return False
        except Exception:
            return False

    def ensure_session(self) -> bool:
        """Ensure valid session, relogin if needed."""
        if self._is_session_valid():
            self._last_activity = time.time()
            return True

        return self.login()

    def get(self, url: str, params: Optional[dict] = None) -> httpx.Response:
        """Make GET request with session management."""
        if not self.ensure_session():
            raise Exception("Failed to establish Morbis session")

        client = self._get_client()
        full_url = url if url.startswith("http") else BASE_URL + url
        response = client.get(full_url, params=params)

        # Check if session expired (redirected to login)
        if response.status_code in (301, 302, 303):
            location = response.headers.get("location", "")
            if "login" in location.lower():
                # Session expired, relogin and retry
                if self.login():
                    response = client.get(full_url, params=params)

        self._last_activity = time.time()
        return response

    def close(self):
        """Close the HTTP client."""
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
        url: URL halaman yang akan di-scrape (bisa relative atau absolute)
        css_selector: CSS selector untuk ekstrak elemen spesifik (opsional)
        extract_tables: Jika True, ekstrak semua tabel di halaman

    Returns:
        Dict dengan keys: success, html, text, tables, selected_html, error
    """
    try:
        response = _session.get(url)

        if response.status_code != 200:
            return {
                "success": False,
                "error": f"HTTP {response.status_code}",
                "html": "",
                "text": "",
                "tables": [],
                "selected_html": "",
            }

        html = response.text

        # Extract text content
        import re
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

        # Extract tables if requested
        if extract_tables:
            table_pattern = r"<table[^>]*>(.*?)</table>"
            tables = re.findall(table_pattern, html, re.DOTALL | re.IGNORECASE)
            result["tables"] = [
                {"index": i, "html_preview": t[:200]} for i, t in enumerate(tables)
            ]
            result["table_count"] = len(tables)

        # Extract specific selector if provided
        if css_selector:
            # Simple CSS selector support (limited to basic selectors)
            if css_selector.startswith("#"):
                # ID selector
                id_name = css_selector[1:]
                id_pattern = rf'<[^>]*id=["\']{id_name}["\'][^>]*>(.*?)</[^>]*>'
                match = re.search(id_pattern, html, re.DOTALL | re.IGNORECASE)
                if match:
                    result["selected_html"] = match.group(0)[:1000]
            elif css_selector.startswith("."):
                # Class selector
                class_name = css_selector[1:]
                class_pattern = rf'<[^>]*class=["\'][^"\']*{class_name}[^"\']*["\'][^>]*>(.*?)</[^>]*>'
                match = re.search(class_pattern, html, re.DOTALL | re.IGNORECASE)
                if match:
                    result["selected_html"] = match.group(0)[:1000]

        return result

    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "html": "",
            "text": "",
            "tables": [],
            "selected_html": "",
        }


@mcp.tool()
def diff_dom(baseline_html: str, current_html: str, scope: Optional[str] = None) -> dict:
    """Compare dua versi HTML dan identifikasi perbedaan.

    Args:
        baseline_html: HTML baseline (sebelum perubahan)
        current_html: HTML saat ini (setelah perubahan)
        scope: CSS selector untuk scope diff (opsional, default: full HTML)

    Returns:
        Dict dengan keys: identical, added_count, removed_count, modified_count, changes
    """
    try:
        import re

        # Extract elements for comparison
        def extract_elements(html):
            elements = {}
            # Extract elements with id
            id_pattern = r'<(\w+)[^>]*id=["\']([^"\']+)["\'][^>]*>'
            for match in re.finditer(id_pattern, html):
                tag, id_val = match.group(1), match.group(2)
                elements[f"{tag}#{id_val}"] = match.group(0)[:100]

            # Extract elements with class
            class_pattern = r'<(\w+)[^>]*class=["\']([^"\']+)["\'][^>]*>'
            for match in re.finditer(class_pattern, html):
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

        # Check for modifications in common elements
        modified = set()
        for key in common:
            if baseline_elements[key] != current_elements[key]:
                modified.add(key)

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
            "changes": changes[:50],  # Limit to 50 changes
        }

    except Exception as e:
        return {
            "identical": False,
            "error": str(e),
            "changes": [],
        }


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
    # Scan existing features for patterns
    features_dir = Path(__file__).parent.parent.parent / "features"
    existing_features = []

    if features_dir.exists():
        for js_file in features_dir.glob("*.js"):
            content = js_file.read_text()
            # Extract feature name and description from comments
            name_match = re.search(r"FEATURE:\s*(.+?)(?:\n|$)", content)
            desc_match = re.search(r"Deskripsi:\s*(.+?)(?:\n|$)", content)

            existing_features.append({
                "file": js_file.name,
                "name": name_match.group(1).strip() if name_match else js_file.stem,
                "description": desc_match.group(1).strip() if desc_match else "",
                "size": len(content),
                "uses_mutation_observer": "MutationObserver" in content,
                "uses_css_injection": "createElement('style')" in content or "createElement(\"style\")" in content,
                "uses_cookie_storage": "CookieFilterStorage" in content,
                "uses_chrome_storage": "chrome.storage" in content,
            })

    # Match patterns based on description keywords
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
            # Find existing features that use this pattern
            for feature in existing_features:
                if pattern in feature["name"].lower() or pattern in feature["description"].lower():
                    matched_patterns.append({
                        "pattern": pattern,
                        "feature": feature["name"],
                        "file": feature["file"],
                        "techniques": [
                            "MutationObserver" if feature["uses_mutation_observer"] else None,
                            "CSS Injection" if feature["uses_css_injection"] else None,
                            "Cookie Storage" if feature["uses_cookie_storage"] else None,
                        ],
                    })

    # Remove None values from techniques
    for p in matched_patterns:
        p["techniques"] = [t for t in p["techniques"] if t]

    # Suggest approach
    suggested_approach = "Berdasarkan pattern yang ditemukan:\n"
    if matched_patterns:
        for mp in matched_patterns[:3]:
            suggested_approach += f"- Gunakan pattern dari {mp['feature']} ({mp['file']})\n"
            suggested_approach += f"  Teknik: {', '.join(mp['techniques'])}\n"
    else:
        suggested_approach += "- Tidak ada pattern yang cocok. Implementasi dari awal diperlukan.\n"
        suggested_approach += "- Gunakan MutationObserver untuk handle dynamic content\n"
        suggested_approach += "- Inject CSS untuk styling\n"
        suggested_approach += "- Register module ke window.featureModules\n"

    # Identify risks
    risks = []
    if "main world" in desc_lower or "global function" in desc_lower:
        risks.append("Memerlukan execution di MAIN world (world: 'MAIN' di manifest)")
    if "mutation" in desc_lower:
        risks.append("MutationObserver bisa menyebabkan performance issue jika tidak di-debounce")
    if "storage" in desc_lower:
        risks.append("Pastikan handle case ketika storage tidak tersedia")

    return {
        "matched_patterns": matched_patterns,
        "suggested_approach": suggested_approach,
        "risks": risks,
        "existing_features": existing_features,
    }


if __name__ == "__main__":
    mcp.run()
