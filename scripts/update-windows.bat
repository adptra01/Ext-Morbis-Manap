@echo off
setlocal

REM =====================================================================
REM  MORBIS Ext — update & build sekali jalan (Windows)
REM  1. Cek Git + Node; kalau belum ada, install via winget
REM  2. git pull origin dev
REM  3. npm ci + build dist/
REM  Setelah selesai: reload extension di chrome://extensions.
REM =====================================================================

cd /d "%~dp0.."

if not exist package.json (
    echo [ERROR] package.json tidak ditemukan. Script harus ada di scripts/ dalam repo.
    goto :end
)

REM ---------- Cek & install Git ----------
git --version >nul 2>&1
if errorlevel 1 (
    echo [1/4] Git TIDAK ada — install via winget...
    winget --version >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] winget tidak ada. Install App Installer dari Microsoft Store:
        echo         https://www.microsoft.com/p/app-installer/9nblggh4nns1
        goto :end
    )
    winget install -e --id Git.Git --accept-package-agreements --accept-source-agreements
    if errorlevel 1 goto :end
) else (
    echo [1/4] Git sudah ada — skip install
)

REM ---------- Cek & install Node.js LTS ----------
node --version >nul 2>&1
if errorlevel 1 (
    echo [2/4] Node TIDAK ada — install via winget...
    winget install -e --id OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
    if errorlevel 1 goto :end
) else (
    echo [2/4] Node sudah ada — skip install
)

REM ---------- Pull ----------
echo [3/4] git pull origin dev...
git pull origin dev
if errorlevel 1 (
    echo [ERROR] git pull gagal — pastikan remote origin ada dan PC online.
    goto :end
)

REM ---------- Install deps & build ----------
echo [4/4] npm ci + build...
call npm ci
if errorlevel 1 goto :end
call npm run build
if errorlevel 1 (
    echo [ERROR] build gagal — screenshot pesan ini.
    goto :end
)

echo.
echo Selesai. Reload extension:
echo   1. Buka chrome://extensions
echo   2. Klik refresh di kartu "MORBIS Extension"
echo   3. Refresh halaman MORBIS yang terbuka
echo.
echo Kalau versi dist/ tidak terpakai, centang "Developer mode" kanan atas.
:end
pause