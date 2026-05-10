@echo off
REM ================================================================
REM MORBIS Ext Unofficial - Deploy ke GitHub Script
REM ================================================================

setlocal

set VERSION=1.2.0
set EXT_NAME=morbis
set PEM_FILE=morbis-v%VERSION%.pem
set CRX_FILE=%EXT_NAME%-v%VERSION%.crx

echo.
echo ================================================================
echo  Deploy MORBIS Ext Unofficial v%VERSION% ke GitHub
echo ================================================================
echo.

REM Check required files
echo [INFO] Checking required files...
if not exist "..\manifest.json" (
    echo [ERROR] manifest.json tidak ditemukan!
    goto :error
)
if not exist "%CRX_FILE%" (
    echo [ERROR] %CRX_FILE% tidak ditemukan!
    echo Jalankan pack-extension.bat terlebih dahulu
    goto :error
)
if not exist "update.xml" (
    echo [ERROR] update.xml tidak ditemukan!
    goto :error
)
if not exist "Install_Morbis_Ext.reg" (
    echo [ERROR] Install_Morbis_Ext.reg tidak ditemukan!
    goto :error
)

echo [OK] Semua file yang diperlukan tersedia
echo.

REM Copy manifest.json to deploy
echo [INFO] Copy manifest.json ke folder deploy...
copy /Y "..\manifest.json" "manifest.json" >nul
if errorlevel 1 (
    echo [ERROR] Gagal copy manifest.json
    goto :error
)

echo.
echo ================================================================
echo  File yang akan di-deploy:
echo ================================================================
echo  - update.xml
echo  - %CRX_FILE%
echo  - manifest.json
echo  - Install_Morbis_Ext.reg
echo  - PANDUAN_DEPLOYMENT.md
echo.

REM Check if git initialized
if not exist "..\.git" (
    echo [INFO] Git belum di-initialized
    echo.
    echo 1. Jalankan: git init
    echo 2. Jalankan: git add .
    echo 3. Jalankan: git commit -m "Initial commit"
    echo 4. Jalankan: git branch gh-pages
    echo 5. Jalankan: git checkout gh-pages
    echo 6. Jalankan: git remote add origin https://github.com/adptra01/Ext-Morbis-Manap.git
    echo 7. Jalankan: git push -u origin gh-pages
    echo.
    goto :end
)

REM Show git status
echo [INFO] Git status:
git status --short
echo.

echo.
echo ================================================================
echo  Perintah Git untuk push ke GitHub:
echo ================================================================
echo.
echo  git add update.xml %CRX_FILE% manifest.json Install_Morbis_Ext.reg PANDUAN_DEPLOYMENT.md
echo  git commit -m "deploy: release v%VERSION%"
echo  git push origin gh-pages
echo.
echo ================================================================
echo  File Registry untuk install di user:
echo ================================================================
echo  File: Install_Morbis_Ext.reg
echo  Cara: Double-click file ini di komputer user
echo.
goto :end

:error
echo.
echo [ERROR] Deploy gagal!
pause
exit /b 1

:end
pause
