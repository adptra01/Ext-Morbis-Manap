@echo off
title Installer Ekstensi SIMRS Morbis
color 0A

NET SESSION >nul 2>&1
if %errorLevel% == 0 (
    goto :INSTALL
) else (
    echo Meminta izin Administrator...
    powershell -Command "Start-Process '%0' -Verb RunAs"
    exit /B
)

:INSTALL
cls
echo ===================================================
echo     AUTO-INSTALLER EKSTENSI SIMRS MORBIS
echo     RSUD H. ABDUL MANAP
echo ===================================================
echo.
echo Sedang mengonfigurasi browser Anda...

set EXT_ID=cbkjilfkdgclmpilonabdnicngjjgegd
set UPDATE_URL=https://adptra01.github.io/Ext-Morbis-Manap/update.xml

echo [1/3] Menyiapkan Microsoft Edge...
reg add "HKLM\SOFTWARE\Policies\Microsoft\Edge\ExtensionInstallForcelist" /v "1" /t REG_SZ /d "%EXT_ID%;%UPDATE_URL%" /f >nul 2>&1
reg add "HKLM\SOFTWARE\Policies\Microsoft\Edge\ExtensionInstallAllowlist" /v "1" /t REG_SZ /d "%EXT_ID%" /f >nul 2>&1

echo [2/3] Menyiapkan Google Chrome...
reg add "HKLM\SOFTWARE\Policies\Google\Chrome\ExtensionInstallForcelist" /v "1" /t REG_SZ /d "%EXT_ID%;%UPDATE_URL%" /f >nul 2>&1
reg add "HKLM\SOFTWARE\Policies\Google\Chrome\ExtensionInstallAllowlist" /v "1" /t REG_SZ /d "%EXT_ID%" /f >nul 2>&1

echo [3/3] Menyiapkan Brave Browser...
reg add "HKLM\SOFTWARE\Policies\BraveSoftware\Brave\ExtensionInstallForcelist" /v "1" /t REG_SZ /d "%EXT_ID%;%UPDATE_URL%" /f >nul 2>&1
reg add "HKLM\SOFTWARE\Policies\BraveSoftware\Brave\ExtensionInstallAllowlist" /v "1" /t REG_SZ /d "%EXT_ID%" /f >nul 2>&1

echo.
echo ===================================================
echo  INSTALASI SELESAI DAN SUKSES!
echo ===================================================
echo Silakan TUTUP semua jendela browser yang sedang terbuka.
echo Saat Anda membuka browser kembali, ekstensi Morbis 
echo akan terinstal dan siap digunakan secara otomatis.
echo.
pause