@echo off
setlocal

REM =====================================================================
REM  MORBIS Ext -- UPDATE SATU KLIK (Windows)
REM  Bisa ditaruh di mana saja (Desktop/Downloads). File ini mandiri:
REM   - Install Git + Node kalau PC belum punya (via winget, otomatis)
REM   - Clone repo ke %USERPROFILE%\morbis-ext kalau belum ada
REM   - Pilih branch: main (dist siap pakai, tanpa build) atau dev (source + dist)
REM   - Buka chrome://extensions -> tinggal klik tombol refresh
REM =====================================================================

set "REPO_DIR=%USERPROFILE%\morbis-ext"
set "REPO_URL=https://github.com/adptra01/Ext-Morbis-Manap.git"
set "BRANCH=%1"
if "%BRANCH%"=="" set "BRANCH=main"

REM ---------- 1/4 Tool: Git ----------
git --version >nul 2>&1
if errorlevel 1 (
    echo [1/4] Git belum ada -- install via winget...
    winget install -e --id Git.Git --accept-package-agreements --accept-source-agreements
    if errorlevel 1 goto :fail
    REM winget tidak menyegarkan PATH sesi cmd ini - tambahkan manual lalu verifikasi.
    set "PATH=%ProgramFiles%\Git\cmd;%LOCALAPPDATA%\Programs\Git\cmd;%ProgramFiles(x86)%\Git\cmd;%PATH%"
    where git >nul 2>&1 || goto :fail
) else (
    echo [1/4] Git sudah ada
)

REM ---------- 2/4 Tool: Node.js LTS ----------
node --version >nul 2>&1
if errorlevel 1 (
    echo [2/4] Node belum ada -- install via winget...
    winget install -e --id OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
    if errorlevel 1 goto :fail
    REM PATH node juga basi di sesi cmd yang sama - refresh agar npm ci tidak gagal.
    set "PATH=%ProgramFiles%\nodejs;%LOCALAPPDATA%\Programs\nodejs;%PATH%"
    where node >nul 2>&1 || goto :fail
) else (
    echo [2/4] Node sudah ada
)

REM ---------- 3/4 Repo: clone kalau belum ada ----------
if not exist "%REPO_DIR%\.git" (
    echo [3/4] Clone repo ke %REPO_DIR%...
    git clone -b dev "%REPO_URL%" "%REPO_DIR%"
    if errorlevel 1 goto :fail
) else (
    echo [3/4] Repo sudah ada
)
cd /d "%REPO_DIR%"

REM ---------- 4/4 Fetch + RESET PAKSA (tanpa merge) ----------
echo [4/4] Reset paksa ke %BRANCH% terbaru (tanpa merge)...
git fetch origin %BRANCH%
if errorlevel 1 goto :fail
REM Clone memakai -b dev jadi branch lokal %BRANCH% (mis. main) belum tentu ada:
REM ikuti origin/%BRANCH% (buat ulang lokal), fallback ke detached HEAD.
git checkout -B %BRANCH% origin/%BRANCH% 2>nul || git checkout --detach origin/%BRANCH%
git merge --abort 2>nul
git reset --hard origin/%BRANCH%
if errorlevel 1 goto :fail

REM Deteksi branch: main = dist siap pakai (tanpa build), dev = butuh build
echo [5/5] Cek branch...
if "%BRANCH%"=="dev" (
    echo Build extension...
    call npm ci
    if errorlevel 1 goto :fail
    call npm run build
    if errorlevel 1 goto :fail
)

echo.
echo ===== VERSI TERPASANG =====
git log --oneline -1
echo Lokasi: %REPO_DIR%
echo.
echo ===== SELESAI =====
echo WAJIB lakukan 2 langkah ini agar file baru dipakai Chrome:
echo   1. Di chrome://extensions, klik tombol REFRESH (panah melingkar)
echo      pada kartu MORBIS Ext.
echo   2. Di halaman MORBIS tekan Ctrl+Shift+R (hard reload).
echo.
echo PASTIKAN extension yang aktif di Chrome dimuat (Load unpacked) dari:
echo   %REPO_DIR%
echo Kalau dimuat dari folder lain, update di atas tidak berpengaruh.
echo.
start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" "chrome://extensions" 2>nul
start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" "chrome://extensions" 2>nul
goto :eof

:fail
echo.
echo [GAGAL] Screenshot jendela ini dan kirim ke admin.
timeout /t 15 >nul
exit /b 1
