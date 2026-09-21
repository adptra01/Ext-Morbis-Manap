@echo off
setlocal

REM =====================================================================
REM  MORBIS Ext — UPDATE MAIN SATU KLIK (Windows)
REM  Untuk PC pemakai (branch main = dist siap pakai, tanpa build/Node):
REM   - Install Git kalau PC belum punya (via winget, otomatis)
REM   - Clone branch main ke %USERPROFILE%\morbis-ext kalau belum ada
REM   - Checkout main + pull terbaru
REM   - Buka chrome://extensions → tinggal klik tombol refresh
REM =====================================================================

set "REPO_DIR=%USERPROFILE%\morbis-ext"
set "REPO_URL=https://github.com/adptra01/Ext-Morbis-Manap.git"

REM ---------- 1/3 Tool: Git ----------
git --version >nul 2>&1
if errorlevel 1 (
    echo [1/3] Git belum ada — install via winget...
    winget install -e --id Git.Git --accept-package-agreements --accept-source-agreements
    if errorlevel 1 goto :fail
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

REM ---------- 3/3 Checkout + pull main ----------
echo [3/3] Update branch main...
git checkout main
if errorlevel 1 goto :fail
git pull origin main
if errorlevel 1 goto :fail

echo.
echo ===== SELESAI =====
echo Buka chrome://extensions lalu klik tombol refresh di kartu extension,
echo dan refresh halaman MORBIS.
echo.
start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" "chrome://extensions" 2>nul
start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" "chrome://extensions" 2>nul
goto :eof

:fail
echo.
echo [GAGAL] Screenshot jendela ini dan kirim ke admin.
pause
exit /b 1
