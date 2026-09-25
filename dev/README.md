# dev/ — Alat Bantu Pengembangan (BUKAN bagian extension)

Folder ini berisi perkakas yang **tidak ikut build/distribusi extension**.
Tidak ada referensi dari `manifest.json`, `scripts/build.mjs`, atau CI —
aman dipindah/diubah tanpa impacting extension yang berjalan.

| Path                           | Isi                                           | Cara pakai                                                                                                                                                           |
| ------------------------------ | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mcp-servers/morbis-devtools/` | MCP server devtools (Python)                  | `pip install -r dev/mcp-servers/morbis-devtools/requirements.txt` lalu `python -m mcp run dev/mcp-servers/morbis-devtools/server.py` (lihat `README.md` di dalamnya) |
| `tool/`                        | Website helper M-KLAIM (HTML statis)          | Buka `dev/tool/index.html` di browser                                                                                                                                |
| `tts_service.py`               | Layanan TTS lokal (port 8765, bind 127.0.0.1) | `cd dev && python3 tts_service.py` — butuh `pip install flask` (atau pakai venv, lihat bawah)                                                                        |

## Python virtualenv (opsional, tidak di-commit)

```bash
python3 -m venv venv            # di root repo; di-ignore (.gitignore)
venv/bin/pip install flask gTTS
cd dev && ../venv/bin/python tts_service.py
```

> `venv/`, `__pycache__/`, `*.pyc` sudah masuk `.gitignore` — jangan di-commit.
