@echo off
REM ================================================================
REM MORBIS Ext Unofficial - Pack Extension Script
REM ================================================================

setlocal

set VERSION=1.2.0
set EXT_NAME=morbis
set PEM_FILE=morbis-v%VERSION%.pem
set CRX_FILE=%EXT_NAME%-v%VERSION%.crx

echo.
echo ================================================================
echo  Pack MORBIS Ext Unofficial v%VERSION%
echo ================================================================
echo.

REM Check if folder exists
if not exist "..\manifest.json" (
    echo [ERROR] manifest.json tidak ditemukan di folder induk!
    echo Jalankan script ini dari folder deploy/
    pause
    exit /b 1
)

echo [INFO] Instruksi Packing:
echo.
echo 1. Buka Chrome atau Edge
echo 2. Masuk ke chrome://extensions/ atau edge://extensions/
echo 3. Aktifkan "Developer mode"
echo 4. Klik "Pack extension"
echo 5. Folder root: %CD%\..
echo 6. Extension key: %CD%\%PEM_FILE% (jika ada)
echo 7. Klik "Pack extension"
echo.
echo [INFO] Setelah packing selesai:
echo    - Copy file .crx dan .pem ke folder ini (deploy/)
echo    - File yang dihasilkan biasanya di:
echo      Windows: %%USERPROFILE%%\Downloads\
echo.
echo [INFO] Tekan sembarang tombol untuk melihat folder ekstensi...
pause >nul
explorer "%CD%\.."

echo.
echo ================================================================
echo  Copy file hasil pack ke folder deploy/
echo ================================================================
echo.
echo 1. Copy file .crx dan .pem dari Downloads ke folder ini
echo 2. Pastikan nama file sesuai:
echo    - %CRX_FILE%
echo    - %PEM_FILE%
echo.
echo [INFO] Tekan sembarang tombol untuk membuka folder Downloads...
pause >nul
explorer "%USERPROFILE%\Downloads"

echo.
echo ================================================================
echo  Jika file sudah di-copy, jalankan deploy-to-github.bat
echo ================================================================
echo.
pause
