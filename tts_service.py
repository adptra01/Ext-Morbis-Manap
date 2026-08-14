#!/usr/bin/env python3
"""TTS local service — engine-agnostic, stdlib only.

Browser extension  ->  http://127.0.0.1:8765/tts?text=...  ->  MP3 bytes
                     http://127.0.0.1:8765/health          ->  {"ok": true}

Kenapa service lokal, bukan speechSynthesis / fetch Google langsung:
  - speechSynthesis di environment display: voices=[] + synthesis-failed (mati total)
  - fetch Google dari browser: CORS blocked; audio element langsung: Format error
  - jalur audio browser (blob/data-URL MP3 -> Audio -> play) TERBUKTI jalan di display
Jadi: browser hanya memainkan MP3. Sintesis audio terjadi di service ini.

Engine:
  1. (prioritas) Piper/espeak-ng lokal bila tersedia — ganti isi `synth()` nanti,
     interface /tts TIDAK berubah (cache key = hash teks).
  2. (saat ini) Google translate_tts server-side — dipanggil dari Python, bukan
     browser, sehingga tidak kena CORS. HTTP 200 + audio/mpeg terverifikasi.

Cache: MP3 per hash teks di ./tts_cache (persisten). Kalimat berulang
("Nomor antrian satu, atas nama...") tidak pernah menyentuh network lagi.

Jalankan:  python3 tts_service.py   (port 8765, bind 127.0.0.1 saja)
"""
import hashlib
import json
import os
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

PORT = int(os.environ.get("TTS_PORT", "8765"))
HOST = os.environ.get("TTS_HOST", "127.0.0.1")
CACHE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "tts_cache")
GOOGLE_TTS = "https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=id&q="
UA = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
)


def synth(text: str) -> str:
    """Sintesis teks -> path MP3 (cache-aware). Engine swap di sini."""
    digest = hashlib.sha1(text.encode("utf-8")).hexdigest()
    path = os.path.join(CACHE_DIR, digest + ".mp3")
    if os.path.exists(path) and os.path.getsize(path) > 0:
        return path
    # Engine 1 (upgrade path): piper/espeak-ng lokal. Contoh:
    #   subprocess.run(["espeak-ng", "-v", "id", "-w", wav, text]) + encode wav->mp3
    #   subprocess.run(["piper", "--model", "id-ID...onnx", "-f", out, text])
    # Engine 2: Google server-side (tanpa CORS karena dari Python, bukan browser).
    url = GOOGLE_TTS + urllib.parse.quote(text)
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Referer": "https://translate.google.com/"})
    with urllib.request.urlopen(req, timeout=20) as resp, open(path, "wb") as f:
        data = resp.read()
        if resp.status != 200 or len(data) < 100:
            raise RuntimeError(f"google tts http {resp.status} len={len(data)}")
        f.write(data)
    return path


class Handler(BaseHTTPRequestHandler):
    def _cors(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        # Private Network Access (PNA): display di IP publik (103.x) fetch ke
        # 127.0.0.1 — Chrome wajibkan preflight tambahan; tanpa header ini fetch
        # dibatalkan sebelum request sampai (ttsMode None, 0 hits di server).
        self.send_header("Access-Control-Allow-Private-Network", "true")

    def do_OPTIONS(self) -> None:  # preflight CORS (extension fetch mode cors)
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_GET(self) -> None:
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/health":
            n = len(os.listdir(CACHE_DIR)) if os.path.isdir(CACHE_DIR) else 0
            body = json.dumps({"ok": True, "cache_files": n}).encode()
            self.send_response(200)
            self._cors()
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        if parsed.path == "/tts":
            q = urllib.parse.parse_qs(parsed.query).get("text", [""])[0]
            if not q:
                self.send_response(400)
                self._cors()
                self.end_headers()
                return
            try:
                path = synth(q)
                with open(path, "rb") as f:
                    data = f.read()
            except Exception as e:  # engine error -> 502, extension lanjut ke layer lain
                body = json.dumps({"error": str(e)}).encode()
                self.send_response(502)
                self._cors()
                self.send_header("Content-Type", "application/json")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)
                return
            self.send_response(200)
            self._cors()
            self.send_header("Content-Type", "audio/mpeg")
            self.send_header("Content-Length", str(len(data)))
            self.send_header("Cache-Control", "max-age=86400")
            self.end_headers()
            self.wfile.write(data)
            return
        self.send_response(404)
        self._cors()
        self.end_headers()

    def log_message(self, format: str, *args) -> None:  # tulis ke /tmp utk debug
        try:
            with open('/tmp/opencode/tts_requests.log', 'a') as f:
                f.write(self.command + ' ' + self.path + '\n')
        except Exception:
            pass


if __name__ == "__main__":
    os.makedirs(CACHE_DIR, exist_ok=True)
    print(f"[tts-service] http://{HOST}:{PORT} cache={CACHE_DIR} (engine: google server-side)")
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()