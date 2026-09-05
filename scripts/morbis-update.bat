@echo off
setlocal

REM =====================================================================
REM  MORBIS Ext — UPDATE SATU KLIK (Windows)
REM  Bisa ditaruh di mana saja (Desktop/Downloads). File ini mandiri:
REM   - Install Git + Node kalau PC belum punya (via winget, otomatis)
REM   - Clone repo ke %USERPROFILE%\morbis-ext kalau belum ada
REM   - git pull + npm ci + build dist
REM   - Buka chrome://extensions → tinggal klik tombol refresh
REM =====================================================================

set "REPO_DIR=%USERPROFILE%\morbis-ext"
set "REPO_URL=https://github.com/adptra01/Ext-Morbis-Manap.git"

REM ---------- 1/4 Tool: Git ----------
git --version >nul 2>&1
if errorlevel 1 (
    echo [1/4] Git belum ada — install via winget...
    winget install -e --id Git.Git --accept-package-agreements --accept-source-agreements
    if errorlevel 1 goto :fail
) else (
    echo [1/4] Git sudah ada
)

REM ---------- 2/4 Tool: Node.js LTS ----------
node --version >nul 2>&1
if errorlevel 1 (
    echo [2/4] Node belum ada — install via winget...
    winget install -e --id OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
    if errorlevel 1 goto :fail
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

REM ---------- 4/4 Pull + build ----------
echo [4/4] Pull + build...
git pull origin dev
if errorlevel 1 goto :fail
call npm ci
if errorlevel 1 goto :fail
call npm run build
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