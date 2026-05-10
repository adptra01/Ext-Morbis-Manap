@echo off
REM ================================================================
REM MORBIS Ext Unofficial - Pack Chromium Extension Script
REM ================================================================

setlocal

set VERSION=1.2.0
set EXT_NAME=morbis
set PEM_FILE=morbis-v%VERSION%.pem
set CRX_FILE=%EXT_NAME%-v%VERSION%.crx

echo.
echo ================================================================
echo  Pack MORBIS Ext Unofficial v%VERSION% untuk Browser Chromium
echo ================================================================
echo.
echo Browser Chromium: Google Chrome, Microsoft Edge, Brave
echo.
echo ================================================================
echo  INFORMASI PENTING - PERHATIKAN!
echo ================================================================
echo.
echo 1. "Pack Extension" HANYA dilakukan oleh Developer/IT
echo    End user (staf RS) TIDAK perlu melakukan ini
echo.
echo 2. Lokasi folder tiap orang BERBEDA (contoh hanya ilustrasi)
echo    Gunakan tombol BROWSE untuk cari folder Anda
echo.
echo 3. File .pem adalah Private Key - JAGA DENGAN BAIK!
echo    Simpan file .pem di tempat aman, offline
echo    Jika hilang, tidak bisa update ekstensi dengan ID yang sama
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

echo [INFO] Instruksi Packing via Browser:
echo.
echo  1. Buka browser (Chrome/Edge/Brave)
echo     - Chrome: chrome://extensions/
echo     - Edge:  edge://extensions/
echo     - Brave: brave://extensions/
echo.
echo  2. Aktifkan "Developer mode" (toggle di pojok kanan atas)
echo.
echo  3. Klik tombol "Pack extension"
echo.
echo  4. KLIK TOMBOL BROWSE untuk "Extension root directory":
echo     - Cari dan pilih folder tempat manifest.json berada
echo     - Lokasi folder tiap orang berbeda, cari di komputer Anda
echo.
echo  5. KLIK TOMBOL BROWSE untuk "Private key file" (.pem):
echo.
echo     [JANGKAU BARU PERTAMA KALI]:
echo       - KOSONGKAN saja kolom ini (jangan diisi)
echo       - Browser akan membuat file .pem baru otomatis
echo       - SIMPAN file .pem yang baru jadi ini dengan aman!
echo.
echo     [JANGKAU UPDATE VERSI BARU]:
echo       - Cari dan pilih file .pem yang pernah dibuat sebelumnya
echo       - File .pem sama dari pack sebelumnya (JANGAN buat yang baru!)
echo.
echo  6. Klik tombol "Pack extension"
echo.
echo  7. File .crx akan dihasilkan (biasanya di Downloads)
echo     Nama file akan seperti: extension.crx atau morbis-v1.2.0.crx
echo.
echo  8. Copy file .crx dan .pem ke folder deploy/
echo.
echo ================================================================
echo  CARA DOWNLOAD FOLDER EKSTENSI
echo ================================================================
echo.
echo  File ekstensi yang sedang Anda edit:
echo  - Lokasi: folder induk deploy/ (MORBIS_EXT)
echo  - File utama: manifest.json
echo.
echo  Tekan sembarang tombol untuk membuka folder induk...
pause >nul
explorer "%CD%\.."

echo.
echo ================================================================
echo  CARA COPY FILE HASIL PACK
echo ================================================================
echo.
echo  Setelah pack selesai di browser:
echo.
echo  1. Buka folder Downloads browser Anda
echo     - Biasanya: C:\Users\NamaAnda\Downloads\
echo.
echo  2. Cari file .crx yang baru dibuat
echo     - Nama: extension.crx atau morbis-v1.2.0.crx
echo.
echo  3. Copy file berikut ke folder deploy/:
echo     - File .crx yang baru dibuat
echo     - File .pem (simpan juga, jangan sampai hilang!)
echo.
echo  Tekan sembarang tombol untuk membuka folder Downloads...
pause >nul
explorer "%USERPROFILE%\Downloads"

echo.
echo ================================================================
echo  SELANJUTNYA
echo ================================================================
echo.
echo  Jika file sudah di-copy ke folder deploy/:
echo.
echo  1. Buka folder deploy/
echo  2. Pastikan file berikut ada:
echo     - %CRX_FILE%
echo     - %PEM_FILE%
echo  3. Jalankan: deploy-to-github.bat
echo.
echo  ATAU untuk Firefox juga:
echo  1. Lakukan pack Firefox (pack-firefox-xpi.bat)
echo  2. Lalu jalankan deploy-to-github.bat
echo.
pause
