@echo off
setlocal

REM =====================================================================
REM  MORBIS Ext -- UPDATE SATU KLIK (Windows)
REM  Bisa ditaruh di mana saja (Desktop/Downloads). File ini mandiri:
REM   - Install Git + Node kalau PC belum punya (via winget, otomatis)
REM   - Clone repo ke %USERPROFILE%\morbis-ext kalau belum ada
REM   - Pilih branch: main (dist siap pakai, tanpa build) atau dev (source + dist)
REM   - Buka chrome://extensions -> tinggal klik tombol refresh
REM
REM  CARA PAKAI:
REM    morbis-update.bat        -> branch main (produksi, tanpa build)
REM    morbis-update.bat dev    -> branch dev  (source + build)
REM
REM  PENTING - folder Load unpacked:
REM    branch main -> %REPO_DIR%          (file extension di akar repo)
REM    branch dev  -> %REPO_DIR%\dist     (hasil build npm)
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
    if errorlevel 1 (
        echo   install machine-scope gagal (butuh admin?) - coba scope user...
        winget install -e --id Git.Git --scope user --accept-package-agreements --accept-source-agreements
        if errorlevel 1 goto :fail
    )
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
    if errorlevel 1 (
        echo   install machine-scope gagal (butuh admin?) - coba scope user...
        winget install -e --id OpenJS.NodeJS.LTS --scope user --accept-package-agreements --accept-source-agreements
        if errorlevel 1 goto :fail
    )
    REM PATH node juga basi di sesi cmd yang sama - refresh agar npm ci tidak gagal.
    set "PATH=%ProgramFiles%\nodejs;%LOCALAPPDATA%\Programs\nodejs;%PATH%"
    where node >nul 2>&1 || goto :fail
) else (
    echo [2/4] Node sudah ada
)

REM ---------- 3/4 Repo: clone kalau belum ada ----------
REM Folder ada tapi BUKAN repo git kita (dibuat manual / clone gagal separuh):
REM geser dulu ke .bak-<timestamp>, lalu clone segar. Git menolak clone ke
REM folder non-kosong, dan update ke repo salah lebih baik daripada diam.
set "TS=%DATE:~-4%%DATE:~3,2%%DATE:~0,2%_%TIME:~0,2%%TIME:~3,2%"
if exist "%REPO_DIR%" (
    if not exist "%REPO_DIR%\.git" (
        echo [3/4] %REPO_DIR% ada tapi bukan repo git - digeser ke morbis-ext.bak-%TS%...
        ren "%REPO_DIR%" "morbis-ext.bak-%TS%"
        if errorlevel 1 goto :fail
    ) else (
        for /f "usebackq delims=" %%u in (`git -C "%REPO_DIR%" remote get-url origin 2^>nul`) do set "ORIGIN_URL=%%u"
        echo "%ORIGIN_URL%" | findstr /i "Ext-Morbis-Manap" >nul || (
            echo [3/4] Origin repo tidak dikenali - digeser ke morbis-ext.bak-%TS%...
            ren "%REPO_DIR%" "morbis-ext.bak-%TS%"
            if errorlevel 1 goto :fail
        )
    )
)
if not exist "%REPO_DIR%\.git" (
    echo [3/4] Clone branch %BRANCH% ke %REPO_DIR%...
    git clone -b "%BRANCH%" "%REPO_URL%" "%REPO_DIR%"
    if errorlevel 1 goto :fail
) else (
    echo [3/4] Repo sudah ada
)
cd /d "%REPO_DIR%"

REM ---------- 4/4 Fetch + RESET PAKSA (tanpa merge) ----------
echo [4/4] Reset paksa ke %BRANCH% terbaru (tanpa merge)...
git merge --abort 2>nul
git fetch origin %BRANCH%
if errorlevel 1 goto :fail
REM Branch lokal %BRANCH% belum tentu ada (clone bisa ke branch lain), dan
REM perubahan lokal yang belum di-commit bisa memblokir checkout. Urutan:
REM aborted merge dibersihkan dulu, lalu ikuti origin/%BRANCH% (buat ulang
REM lokal), fallback ke detached HEAD. Reset --hard menjamin isi = origin.
git checkout -B %BRANCH% origin/%BRANCH% 2>nul || git checkout --detach origin/%BRANCH%
if errorlevel 1 goto :fail
git reset --hard origin/%BRANCH%
if errorlevel 1 goto :fail

REM Deteksi branch: main = dist siap pakai (tanpa build), dev = butuh build
echo [5/5] Cek branch...
set "EXT_DIR=%REPO_DIR%"
if /i "%BRANCH%"=="dev" (
    set "EXT_DIR=%REPO_DIR%\dist"
    echo Build extension (branch dev)...
    call npm ci
    if errorlevel 1 goto :fail
    call npm run build
    if errorlevel 1 goto :fail
)

echo.
echo ===== VERSI TERPASANG =====
git log --oneline -1
echo Lokasi: %EXT_DIR%
echo.
echo ===== SELESAI =====
echo WAJIB lakukan 2 langkah ini agar file baru dipakai Chrome:
echo   1. Di chrome://extensions, klik tombol REFRESH (panah melingkar)
echo      pada kartu MORBIS Ext.
echo   2. Di halaman MORBIS tekan Ctrl+Shift+R (hard reload).
echo.
echo PASTIKAN extension yang aktif di Chrome dimuat (Load unpacked) dari:
echo   %EXT_DIR%
echo Kalau dimuat dari folder lain, update di atas tidak berpengaruh.
echo.
start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" "chrome://extensions" 2>nul
start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" "chrome://extensions" 2>nul
start "" "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" "chrome://extensions" 2>nul
goto :eof

:fail
echo.
echo [GAGAL] Screenshot jendela ini dan kirim ke admin.
timeout /t 15 >nul
exit /b 1