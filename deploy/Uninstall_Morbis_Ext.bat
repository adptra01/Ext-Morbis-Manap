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
    REM /reg:64 wajib pada SEMUA reg delete (tanpa ini, host cmd 32-bit
    REM menulis ke Wow6432Node dan policy MORBIS di native view selamat).
    REM HANYA nilai MORBIS (value "1") yang dihapus - key Forcelist dan
    REM key lain TIDAK disentuh agar ekstensi lain yang dikelola IT aman.
    reg delete "HKLM\SOFTWARE\Policies\%%~P\ExtensionInstallForcelist" /v "1" /f /reg:64 >nul 2>&1
    REM Hapus subkey AutoplayAllowed yang salah (dibuat installer lama).
    reg delete "HKLM\SOFTWARE\Policies\%%~P\AutoplayAllowed" /f /reg:64 >nul 2>&1
    REM Hapus ExtensionSettings khusus MORBIS (ID baru + ID lama).
    reg delete "HKLM\SOFTWARE\Policies\%%~P\ExtensionSettings\beljnjfifmncnfnhdkcmjpeonoigdnbl" /f /reg:64 >nul 2>&1
    reg delete "HKLM\SOFTWARE\Policies\%%~P\ExtensionSettings\cbkjilfkdgclmpilonabdnicngjjgegd" /f /reg:64 >nul 2>&1
    reg delete "HKLM\SOFTWARE\Policies\%%~P\ExtensionSettings\xae4a2ltyv2bj7lqyzxi2xeynpiefblg" /f /reg:64 >nul 2>&1
    reg delete "HKLM\SOFTWARE\Policies\%%~P" /v "AutoplayAllowed" /f /reg:64 >nul 2>&1
    REM Bersihkan sisa installer lama (level user) - tetap HANYA nilai MORBIS.
    reg delete "HKCU\SOFTWARE\Policies\%%~P\ExtensionInstallForcelist" /v "1" /f /reg:64 >nul 2>&1
    reg delete "HKCU\SOFTWARE\Policies\%%~P\ExtensionSettings\beljnjfifmncnfnhdkcmjpeonoigdnbl" /f /reg:64 >nul 2>&1
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
echo Membersihkan jalur cadangan A (tugas terjadwal + clone lokal)...
REM Idempoten: hapus kalau ada, biarkan kalau tidak ada.
schtasks /Delete /TN "Morbis Ext Update" /F >nul 2>&1
if exist "%USERPROFILE%\morbis-ext" rmdir /s /q "%USERPROFILE%\morbis-ext" >nul 2>&1

echo.
echo ===================================================
echo  POLICY MORBIS SUDAH DIHAPUS.
echo ===================================================
echo - Hanya nilai MORBIS di Forcelist yang dihapus; ekstensi lain
echo   yang dikelola IT tetap utuh.
echo - Tugas terjadwal "Morbis Ext Update" dihapus (jika ada).
echo - Folder %USERPROFILE%\morbis-ext dihapus (jika ada).
echo Buka browser -^> halaman extensions -^> hapus kartu MORBIS manual.
echo Contoh: chrome://extensions atau edge://extensions.
echo.
pause
exit /B 0
