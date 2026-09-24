@echo off
title Uninstaller Ekstensi SIMRS Morbis
color 0C

NET SESSION >nul 2>&1
if %errorLevel% == 0 (
    goto :UNINSTALL
) else (
    echo Meminta izin Administrator...
    powershell -Command "Start-Process '%0' -Verb RunAs"
    exit /B
)

:UNINSTALL
cls
echo ===================================================
echo     UNINSTALLER EKSTENSI SIMRS MORBIS
echo     RSUD H. ABDUL MANAP
echo ===================================================
echo.
echo Menghapus policy MORBIS dari semua browser Chromium...
echo.

for %%P in (
    "Google\Chrome"
    "Microsoft\Edge"
    "BraveSoftware\Brave"
    "Vivaldi"
    "Opera Software\Opera"
    "Chromium"
) do (
    echo   - %%~P
    reg delete "HKLM\SOFTWARE\Policies\%%~P\ExtensionInstallForcelist" /f >nul 2>&1
    reg delete "HKLM\SOFTWARE\Policies\%%~P\ExtensionInstallAllowlist" /f >nul 2>&1
    reg delete "HKLM\SOFTWARE\Policies\%%~P\ExtensionInstallSources" /f >nul 2>&1
    reg delete "HKLM\SOFTWARE\Policies\%%~P\AutoplayAllowed" /f >nul 2>&1
    reg delete "HKLM\SOFTWARE\Policies\%%~P\ExtensionSettings\beljnjfifmncnfnhdkcmjpeonoigdnbl" /f >nul 2>&1
    reg delete "HKLM\SOFTWARE\Policies\%%~P\ExtensionSettings\cbkjilfkdgclmpilonabdnicngjjgegd" /f >nul 2>&1
    reg delete "HKLM\SOFTWARE\Policies\%%~P\ExtensionSettings\xae4a2ltyv2bj7lqyzxi2xeynpiefblg" /f >nul 2>&1
    reg delete "HKLM\SOFTWARE\Policies\%%~P" /v "AutoplayAllowed" /f >nul 2>&1
    REM Bersihkan sisa installer lama (.reg era Firefox/unpacked, level user).
    reg delete "HKCU\SOFTWARE\Policies\%%~P\ExtensionInstallForcelist" /f >nul 2>&1
    reg delete "HKCU\SOFTWARE\Policies\%%~P\ExtensionInstallAllowlist" /f >nul 2>&1
    reg delete "HKCU\SOFTWARE\Policies\%%~P\ExtensionInstallSources" /f >nul 2>&1
    reg delete "HKCU\SOFTWARE\Policies\%%~P\ExtensionSettings\beljnjfifmncnfnhdkcmjpeonoigdnbl" /f >nul 2>&1
)

echo.
echo Menutup semua browser Chromium...
taskkill /IM msedge.exe /F >nul 2>&1
taskkill /IM msedgewebview2.exe /F >nul 2>&1
taskkill /IM chrome.exe /F >nul 2>&1
taskkill /IM brave.exe /F >nul 2>&1
taskkill /IM vivaldi.exe /F >nul 2>&1
taskkill /IM opera.exe /F >nul 2>&1
taskkill /IM launcher.exe /F >nul 2>&1
taskkill /IM chromium.exe /F >nul 2>&1

echo.
echo ===================================================
echo  POLICY MORBIS SUDAH DIHAPUS.
echo ===================================================
echo Buka browser -^> halaman extensions -^> hapus kartu MORBIS manual.
echo Contoh: chrome://extensions atau edge://extensions.
echo.
pause
