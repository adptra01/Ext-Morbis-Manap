#!/usr/bin/env python3
"""
Morbis HIS Scraper — CLI tool untuk scrape data dari sistem Morbis.

Usage:
    python morbis_scraper.py login USERNAME PASSWORD
    python morbis_scraper.py scrape URL [--cookies FILE] [--selector SELECTOR] [--output FILE]
    python morbis_scraper.py surat-pengantar ID_VISIT [--page PAGE] [--status STATUS] [--output FILE]

Requires: scrapling (activate venv first: source /tmp/scrapling-venv/bin/activate)
"""

import argparse
import json
import os
import sys
from pathlib import Path

BASE_URL = "http://103.147.236.140"
COOKIE_FILE = Path(__file__).parent / ".morbis_cookies.json"


def get_session():
    """Import FetcherSession from scrapling."""
    try:
        from scrapling.fetchers import FetcherSession
        return FetcherSession
    except ImportError:
        print("Error: scrapling tidak terinstall.")
        print("Aktifkan venv: source /tmp/scrapling-venv/bin/activate")
        print("Atau install: pip install 'scrapling[all]>=0.4.2'")
        sys.exit(1)


def save_cookies(session_id):
    """Save session cookie to file."""
    cookies = {"PHPSESSID": session_id}
    with open(COOKIE_FILE, "w") as f:
        json.dump(cookies, f)
    print(f"Cookies disimpan ke {COOKIE_FILE}")


def load_cookies():
    """Load session cookie from file."""
    if COOKIE_FILE.exists():
        with open(COOKIE_FILE) as f:
            return json.load(f)
    return None


def cmd_login(args):
    """Login ke Morbis dan simpan session."""
    FetcherSession = get_session()

    with FetcherSession(impersonate="chrome") as session:
        response = session.post(
            f"{BASE_URL}/login",
            data={"username": args.username, "password": args.password},
        )

        if "login" in response.url.lower() and response.status_code == 200:
            print("Login gagal — cek username/password.")
            sys.exit(1)

        cookies = session.get_cookies()
        for cookie in cookies:
            if "PHPSESSID" in cookie.get("name", ""):
                save_cookies(cookie["value"])
                print(f"Login berhasil! URL: {response.url}")
                return

        print("Login berhasil tapi tidak menemukan PHPSESSID cookie.")
        print(f"Response URL: {response.url}")


def cmd_scrape(args):
    """Scrape halaman Morbis."""
    FetcherSession = get_session()
    cookies = load_cookies()

    if not cookies and not args.cookies:
        print("Error: Belum login. Jalankan 'login' dulu atau berikan --cookies.")
        sys.exit(1)

    cookie_str = args.cookies or f"PHPSESSID={cookies.get('PHPSESSID', '')}"

    with FetcherSession(impersonate="chrome") as session:
        response = session.get(args.url, cookies=cookie_str)

        if args.selector:
            elements = response.css(args.selector)
            data = [el.get_text(strip=True) for el in elements]
            output = "\n".join(data)
        else:
            output = response.get_text()

        if args.output:
            with open(args.output, "w") as f:
                f.write(output)
            print(f"Data disimpan ke {args.output}")
        else:
            print(output)


def cmd_surat_pengantar(args):
    """Scrape halaman surat pengantar rawat inap."""
    FetcherSession = get_session()
    cookies = load_cookies()

    if not cookies:
        print("Error: Belum login. Jalankan 'login' dulu.")
        sys.exit(1)

    cookie_str = f"PHPSESSID={cookies.get('PHPSESSID', '')}"
    url = f"{BASE_URL}/admisi/detail-rawat-inap/surat-pengantar-ri"
    params = {
        "id_visit": args.id_visit,
        "page": args.page,
        "status_periksa": args.status,
    }

    with FetcherSession(impersonate="chrome") as session:
        full_url = url + "?" + "&".join(f"{k}={v}" for k, v in params.items())
        response = session.get(full_url, cookies=cookie_str)

        if "login" in response.url.lower():
            print("Session expired. Login ulang.")
            sys.exit(1)

        rows = response.css("table tr")
        if rows:
            data = []
            for row in rows:
                cells = row.css("td, th")
                data.append([cell.get_text(strip=True) for cell in cells])

            output = json.dumps(data, ensure_ascii=False, indent=2)
        else:
            output = response.get_text()

        output_file = args.output or f"surat_pengantar_{args.id_visit}_p{args.page}.json"
        with open(output_file, "w") as f:
            f.write(output)
        print(f"Data disimpan ke {output_file} ({len(rows)} baris)")


def main():
    parser = argparse.ArgumentParser(description="Morbis HIS Scraper")
    subparsers = parser.add_subparsers(dest="command")

    # Login
    login_parser = subparsers.add_parser("login", help="Login ke Morbis")
    login_parser.add_argument("username")
    login_parser.add_argument("password")

    # Scrape
    scrape_parser = subparsers.add_parser("scrape", help="Scrape halaman")
    scrape_parser.add_argument("url", help="URL lengkap halaman")
    scrape_parser.add_argument("--cookies", help="Cookie string manual")
    scrape_parser.add_argument("--selector", "-s", help="CSS selector")
    scrape_parser.add_argument("--output", "-o", help="File output")

    # Surat Pengantar
    surat_parser = subparsers.add_parser(
        "surat-pengantar", help="Scrape surat pengantar rawat inap"
    )
    surat_parser.add_argument("id_visit", help="ID Visit pasien")
    surat_parser.add_argument("--page", type=int, default=1)
    surat_parser.add_argument("--status", default="belum")
    surat_parser.add_argument("--output", "-o")

    args = parser.parse_args()

    if args.command == "login":
        cmd_login(args)
    elif args.command == "scrape":
        cmd_scrape(args)
    elif args.command == "surat-pengantar":
        cmd_surat_pengantar(args)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
