@echo off
setlocal enabledelayedexpansion

REM =====================================================================
REM  MORBIS Ext — update & build sekali jalan (Windows)
REM  Jalankan dari mana saja: pull dari origin/dev, install deps, build dist.
REM  Setelah selesai: reload extension di chrome://extensions.
REM =====================================================================

cd /d "%~dp0.."

if not exist package.json (
    echo [ERROR] package.json tidak ditemukan. Script harus ada di scripts/ dalam repo.
    exit /b 1
)

echo [1/4] Pull dari origin/dev...
git pull origin dev
if errorlevel 1 (
    echo [ERROR] git pull gagal — pastikan repo ini punya remote origin dan PC online.
    exit /b 1
)

echo [2/4] Install dependencies (npm ci)...
call npm ci
if errorlevel 1 (
    echo [ERROR] npm ci gagal — cek koneksi internet / versi Node (minimal 18).
    exit /b 1
)

echo [3/4] Build dist/...
call npm run build
if errorlevel 1 (
    echo [ERROR] build gagal — screenshot pesan ini.
    exit /b 1
)

echo [4/4] Selesai.
echo.
echo Sekarang reload extension:
echo   1. Buka chrome://extensions
echo   2. Klik tombol refresh di kartu "MORBIS Extension"
echo   3. Refresh halaman MORBIS yang terbuka
echo.
echo Kalau dist/ tidak terpakai, centang "Developer mode" dulu di kanan atas.
exit /b 0