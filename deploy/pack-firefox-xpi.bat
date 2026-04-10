@echo off
REM ================================================================
REM MORBIS Ext Unofficial - Pack Firefox Extension Script
REM ================================================================

setlocal

set VERSION=1.2.0
set EXT_NAME=morbis
set XPI_FILE=%EXT_NAME%-v%VERSION%.xpi

echo.
echo ================================================================
echo  Pack MORBIS Ext Unofficial v%VERSION% untuk Mozilla Firefox
echo ================================================================
echo.
echo ================================================================
echo  INFORMASI PENTING - PERHATIKAN!
echo ================================================================
echo.
echo 1. "Pack Extension" HANYA dilakukan oleh Developer/IT
echo    End user (staf RS) TIDAK perlu melakukan ini
echo.
echo 2. Firefox menggunakan ZIP yang di-rename menjadi .xpi
echo    TIDAK memerlukan file .pem seperti Chromium
echo.
echo 3. Lokasi folder tiap orang BERBEDA (contoh hanya ilustrasi)
echo    Cari folder ekstensi di komputer Anda
echo.
echo ================================================================
echo.

REM Check if in deploy folder
if not exist "..\manifest.json" (
    echo [ERROR] manifest.json tidak ditemukan di folder induk!
    echo.
    echo  Pastikan Anda menjalankan script ini dari folder deploy/
    echo.
    pause
    exit /b 1
)

echo [INFO] Instruksi Packing Firefox (ZIP → XPI):
echo.
echo  1. Buka folder EKSTENSI (tempat manifest.json berada)
echo     - Lokasi folder tiap orang berbeda
echo     - Cari di komputer Anda dengan Windows Explorer
echo.
echo  2. BLOK semua file berikut (dengan mouse/drag):
echo.
echo     File-file utama:
echo       - manifest.json
echo       - background.js
echo       - content.js
echo       - core.js
echo       - init.js
echo       - popup.html
echo       - popup.js
echo.
echo     Folder-folder:
echo       - features/ (seluruh isi folder)
echo       - icons/ (seluruh isi folder)
echo.
echo  3. Klik KANAN pada file yang terblok
echo.
echo  4. Pilih opsi kompresi:
echo.
echo     [Windows]:
echo       - Send to → Compressed (zipped) folder
echo       - ATAU: 7-Zip → Add to archive...
echo.
echo     [WinRAR]:
echo       - Add to archive...
echo.
echo  5. File ZIP akan dibuat
echo     - Nama: biasanya "manifest.zip" atau folder name + ".zip"
echo.
echo  6. RENAME file .zip menjadi .xpi:
echo     - Klik kanan file .zip → Rename
echo     - Ubah akhiran dari .zip menjadi .xpi
echo     - Nama akhir: %XPI_FILE%
echo.
echo  7. Copy file .xpi ke folder deploy/
echo.
echo ================================================================
echo  PENTING: File yang PERLU di-block & kompres
echo ================================================================
echo.
echo  ✓ manifest.json (WAJIB)
echo  ✓ background.js
echo  ✓ content.js
echo  ✓ core.js
echo  ✓ init.js
echo  ✓ popup.html
echo  ✓ popup.js
echo  ✓ features/ (FOLDER - SEMUA isi)
echo  ✓ icons/ (FOLDER - SEMUA isi)
echo.
echo  JANGAN kompress folder deploy/ atau test-results/
echo  Hanya file dan folder ekstensi yang diperlukan
echo.
echo ================================================================
echo  CARA MUDAH BUKA FOLDER EKSTENSI
echo ================================================================
echo.
echo  Tekan sembarang tombol untuk membuka folder ekstensi...
pause >nul
explorer "%CD%\.."

echo.
echo ================================================================
echo  SETELAH ZIP DIBUAT DAN DI-RENAME KE XPI
echo ================================================================
echo.
echo  1. Pastikan file .xpi ada di folder deploy/
echo  2. Pastikan nama file: %XPI_FILE%
echo.
echo  Tekan sembarang tombol untuk membuka folder deploy/...
pause >nul
explorer "%CD%"

echo.
echo ================================================================
echo  FILE YANG SUDAH ADA DI deploy/
echo ================================================================
dir /B *.xml *.json *.xpi *.crx *.reg *.md *.bat 2>nul
echo.
echo ================================================================
echo  SELANJUTNYA
echo ================================================================
echo.
echo  Jika file .xpi sudah ada:
echo.
echo  1. Jika belum punya .crx:
echo      - Lakukan pack Chromium (pack-extension.bat)
echo.
echo  2. Lalu jalankan deploy-to-github.bat
echo.
echo  3. File akan di-push ke GitHub Pages
echo.
pause
