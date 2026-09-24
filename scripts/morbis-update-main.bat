@echo off
setlocal

REM =====================================================================
REM  MORBIS Ext -- UPDATE MAIN SATU KLIK (Windows)
REM  Untuk PC pemakai (branch main = dist siap pakai, tanpa build/Node):
REM   - Install Git kalau PC belum punya (via winget, otomatis)
REM   - Clone branch main ke %USERPROFILE%\morbis-ext kalau belum ada
REM   - RESET PAKSA ke main terbaru (tanpa merge -- server rewrite history
REM     tiap deploy, jadi "git pull" biasa macet/conflict & file setengah lama)
REM   - Tampilkan versi terpasang untuk verifikasi
REM   - Buka chrome://extensions -> WAJIB klik tombol refresh + hard-reload
REM =====================================================================

set "REPO_DIR=%USERPROFILE%\morbis-ext"
set "REPO_URL=https://github.com/adptra01/Ext-Morbis-Manap.git"

REM ---------- 1/3 Tool: Git ----------
git --version >nul 2>&1
if errorlevel 1 (
    echo [1/3] Git belum ada -- install via winget...
    winget install -e --id Git.Git --accept-package-agreements --accept-source-agreements
    if errorlevel 1 goto :fail
    REM winget tidak menyegarkan PATH sesi cmd ini - tambahkan manual lalu verifikasi.
    set "PATH=%ProgramFiles%\Git\cmd;%LOCALAPPDATA%\Programs\Git\cmd;%ProgramFiles(x86)%\Git\cmd;%PATH%"
    where git >nul 2>&1 || goto :fail
) else (
    echo [1/3] Git sudah ada
)

REM ---------- 2/3 Repo: clone main kalau belum ada ----------
if not exist "%REPO_DIR%\.git" (
    echo [2/3] Clone branch main ke %REPO_DIR%...
    git clone -b main "%REPO_URL%" "%REPO_DIR%"
    if errorlevel 1 goto :fail
) else (
    echo [2/3] Repo sudah ada
)
cd /d "%REPO_DIR%"

REM ---------- 3/3 Fetch + RESET PAKSA ke main terbaru ----------
echo [3/3] Update branch main (reset paksa, tanpa merge)...
git fetch origin main
if errorlevel 1 goto :fail
git checkout main 2>nul
git reset --hard origin/main
if errorlevel 1 goto :fail

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
