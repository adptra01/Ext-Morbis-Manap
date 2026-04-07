@echo off
REM ================================================================
REM MORBIS Ext Unofficial - Pack Firefox XPI Script
REM ================================================================

setlocal

set VERSION=1.2.0
set EXT_NAME=morbis
set XPI_FILE=%EXT_NAME%-v%VERSION%.xpi
set TEMP_ZIP=ext-zip-v%VERSION%.zip

echo.
echo ================================================================
echo  Pack MORBIS Ext Unofficial v%VERSION% untuk Firefox
echo ================================================================
echo.

REM Check if folder exists
if not exist "..\manifest.json" (
    echo [ERROR] manifest.json tidak ditemukan di folder induk!
    echo Jalankan script ini dari folder deploy/
    pause
    exit /b 1
)

echo [INFO] Membuat XPI untuk Firefox...
echo.
echo [INFO] Firefox menggunakan format ZIP rename ke XPI
echo [INFO] Tidak perlu file .pem seperti Chromium browsers
echo.

REM Create temporary list of files to include
set FILES=manifest.json background.js content.js core.js init.js popup.html popup.js
set FOLDERS=features icons

echo [INFO] File yang akan dimasukkan:
echo   - manifest.json
echo   - background.js
echo   - content.js
echo   - core.js
echo   - init.js
echo   - popup.html
echo   - popup.js
echo   - features/ (folder)
echo   - icons/ (folder)
echo.

echo [INFO] Cara membuat XPI:
echo.
echo 1. Buka folder project induk (folder MORBIS_EXT)
echo 2. Blok semua file yang diperlukan:
echo    - manifest.json
echo    - background.js
echo    - content.js
echo    - core.js
echo    - init.js
echo    - popup.html
echo    - popup.js
echo    - features/ (semua isi folder)
echo    - icons/ (semua isi folder)
echo.
echo 3. Klik kanan → Send to → Compressed (zipped) folder
echo    ATAU: Klik kanan → 7-Zip → Add to archive...
echo 4. File ZIP akan dibuat
echo 5. Rename file .zip menjadi %XPI_FILE%
echo.
echo [INFO] Tekan sembarang tombol untuk melihat folder ekstensi...
pause >nul
explorer "%CD%\.."

echo.
echo ================================================================
echo  Setelah ZIP dibuat dan di-rename ke XPI:
echo ================================================================
echo.
echo 1. Copy file %XPI_FILE% ke folder ini (deploy/)
echo 2. Pastikan nama file sesuai: %XPI_FILE%
echo 3. File .pem TIDAK diperlukan untuk Firefox
echo.
echo [INFO] Tekan sembarang tombol untuk membuka folder ini (deploy/)...
pause >nul
explorer "%CD%"

echo.
echo ================================================================
echo  File yang sudah ada di deploy/:
echo ================================================================
dir /B *.xml *.json *.xpi *.crx *.reg *.md *.bat 2>nul
echo.
echo [INFO] Jika %XPI_FILE% sudah ada, jalankan deploy-to-github.bat
echo.
pause
