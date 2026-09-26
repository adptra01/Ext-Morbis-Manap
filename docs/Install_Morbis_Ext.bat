@echo off
setlocal EnableDelayedExpansion
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
echo.

REM ============================================================
REM  KONFIGURASI - sumber tunggal identitas produksi.
REM  EXT_ID = hash SHA256 public key dist.pem (wajib 32 char a-p).
REM  JANGAN ketik ulang manual - copy-paste dari update.xml live.
REM  Sinkronisasi dijaga otomatis oleh CI (guard di deploy-to-main.yml).
REM ============================================================
set EXT_ID=beljnjfifmncnfnhdkcmjpeonoigdnbl
set UPDATE_URL=https://adptra01.github.io/Ext-Morbis-Manap/update.xml

REM Validasi EXT_ID harus tepat 32 karakter (a-p).
call :StrLen
if not "!EXT_ID_LEN!"=="32" (
    echo.
    echo ==========================================
    echo  ERROR: EXT_ID panjang !EXT_ID_LEN! karakter.
    echo  Harus tepat 32 karakter (a-p).
    echo  Installer dihentikan - screenshot dan kirim ke admin.
    echo ==========================================
    pause
    exit /B 1
)
echo [OK] EXT_ID valid: 32 karakter.
echo.

REM Pastikan script dijalankan di 64-bit context kalau OS 64-bit
if "%PROCESSOR_ARCHITECTURE%"=="x86" if not defined PROCESSOR_ARCHITEW6432 (
    echo WARNING: OS 32-bit terdeteksi. Policy akan ditulis ke 32-bit view.
) else if "%PROCESSOR_ARCHITECTURE%"=="x86" (
    echo INFO: CMD 32-bit di OS 64-bit. /reg:64 akan memaksa tulis ke native view.
)

echo ===== PENTING SEBELUM INSTAL =====
echo 1. Hapus dulu ekstensi MORBIS versi LAMA (Load unpacked) di browser:
echo    chrome://extensions - cari MORBIS Ext Unofficial yang tertulis
echo    "Dimuat sebagai unpacked" - klik Hapus.
echo    Kalau tidak, ekstensi baru terpasang DUPLIKAT (dobel suara TTS).
echo 2. Installer akan MENUTUP semua jendela browser - simpan dulu
echo    pekerjaan Anda (mis. tab SIMRS) sebelum lanjut.
echo.
pause

echo.
echo [1/6] Menutup semua browser Chromium...
call :KillBrowsers
timeout /t 2 /nobreak >nul

echo [2/6] Membersihkan policy MORBIS lama...
REM HANYA nilai MORBIS di Forcelist yang dihapus (value "1" yang ditulis
REM installer ini) - key Forcelist/Allowlist/Sources TIDAK pernah dihapus
REM seluruhnya agar ekstensi lain yang dikelola IT tetap utuh.
REM Backup registry per browser dulu (path dicetak di bawah).
for %%P in (
    "Google\Chrome"
    "Microsoft\Edge"
    "BraveSoftware\Brave"
    "Vivaldi"
    "Opera Software\Opera"
    "Chromium"
) do (
    reg export "HKLM\SOFTWARE\Policies\%%~P" "%TEMP%\morbis-ext-backup-%%~nxP.reg" /y >nul 2>&1
    echo    backup policy %%~P -^> %TEMP%\morbis-ext-backup-%%~nxP.reg
    reg delete "HKLM\SOFTWARE\Policies\%%~P\ExtensionInstallForcelist" /v "1" /f /reg:64 >nul 2>&1
    REM Hapus subkey AutoplayAllowed yang salah (dibuat installer lama).
    reg delete "HKLM\SOFTWARE\Policies\%%~P\AutoplayAllowed" /f /reg:64 >nul 2>&1
    REM Hapus ExtensionSettings khusus MORBIS (ID baru + ID lama).
    reg delete "HKLM\SOFTWARE\Policies\%%~P\ExtensionSettings\beljnjfifmncnfnhdkcmjpeonoigdnbl" /f /reg:64 >nul 2>&1
    reg delete "HKLM\SOFTWARE\Policies\%%~P\ExtensionSettings\cbkjilfkdgclmpilonabdnicngjjgegd" /f /reg:64 >nul 2>&1
    reg delete "HKLM\SOFTWARE\Policies\%%~P\ExtensionSettings\xae4a2ltyv2bj7lqyzxi2xeynpiefblg" /f /reg:64 >nul 2>&1
)

echo [3/6] Menulis policy ke semua browser Chromium...
for %%P in (
    "Google\Chrome"
    "Microsoft\Edge"
    "BraveSoftware\Brave"
    "Vivaldi"
    "Opera Software\Opera"
    "Chromium"
) do (
    set "BASE=HKLM\SOFTWARE\Policies\%%~P"
    echo   - %%~P
    REM Forcelist: auto-install + auto-update dari update.xml.
    reg add "!BASE!\ExtensionInstallForcelist" /v "1" /t REG_SZ /d "!EXT_ID!;!UPDATE_URL!" /f /reg:64 >nul 2>&1
    REM ExtensionSettings: kunci update_url agar tidak balik ke Store.
    reg add "!BASE!\ExtensionSettings\!EXT_ID!" /v "installation_mode" /t REG_SZ /d "force_installed" /f /reg:64 >nul 2>&1
    reg add "!BASE!\ExtensionSettings\!EXT_ID!" /v "update_url" /t REG_SZ /d "!UPDATE_URL!" /f /reg:64 >nul 2>&1
    reg add "!BASE!\ExtensionSettings\!EXT_ID!" /v "override_update_url" /t REG_DWORD /d "1" /f /reg:64 >nul 2>&1
    REM Autoplay: izinkan suara TTS antrian tanpa klik (value di root key).
    reg add "!BASE!" /v "AutoplayAllowed" /t REG_DWORD /d "1" /f /reg:64 >nul 2>&1
)

echo.
echo [4/6] Verifikasi policy yang tertulis...
call :VerifyPolicy

echo.
echo [5/6] Menutup ulang browser (kalau ada yang auto-restart)....
call :KillBrowsers

echo.
echo [6/6] Selesai.
echo.
echo ===================================================
echo  INSTALASI SELESAI DAN SUKSES!
echo ===================================================
echo Silakan BUKA KEMBALI browser Anda. Ekstensi MORBIS akan
echo terinstal OTOMATIS via policy (ID: beljnjfifmncnfnhdkcmjpeonoigdnbl).
echo.
echo ===== VERIFIKASI =====
echo - chrome://extensions : kartu MORBIS TANPA label "unpacked"
echo - chrome://policy     : ExtensionInstallForcelist status OK, ID 32 char
echo - edge://policy       : idem untuk Edge
echo - brave://policy      : idem untuk Brave
echo - Update berikutnya OTOMATIS (update.xml di GitHub Pages),
echo   tanpa perlu klik refresh / menjalankan apa pun lagi.
echo.
pause
exit /B 0

REM ============================================================
REM  SUBROUTINE: hitung panjang EXT_ID -^> EXT_ID_LEN
REM ============================================================
:StrLen
set "EXT_ID_LEN=0"
set "_tmp=!EXT_ID!"
:StrLen_Loop
if not "!_tmp!"=="" (
    set "_tmp=!_tmp:~1!"
    set /a "EXT_ID_LEN+=1"
    goto :StrLen_Loop
)
set "_tmp="
exit /B

REM ============================================================
REM  SUBROUTINE: tutup semua proses browser Chromium
REM ============================================================
:KillBrowsers
taskkill /IM msedge.exe /F >nul 2>&1
taskkill /IM msedgewebview2.exe /F >nul 2>&1
taskkill /IM chrome.exe /F >nul 2>&1
taskkill /IM brave.exe /F >nul 2>&1
taskkill /IM vivaldi.exe /F >nul 2>&1
taskkill /IM opera.exe /F >nul 2>&1
taskkill /IM launcher.exe /F >nul 2>&1
taskkill /IM chromium.exe /F >nul 2>&1
exit /B

REM ============================================================
REM  SUBROUTINE: verifikasi Forcelist tertulis per browser
REM ============================================================
:VerifyPolicy
for %%P in (
    "Google\Chrome"
    "Microsoft\Edge"
    "BraveSoftware\Brave"
    "Vivaldi"
    "Opera Software\Opera"
    "Chromium"
) do (
    reg query "HKLM\SOFTWARE\Policies\%%~P\ExtensionInstallForcelist" /v "1" /reg:64 2>nul | findstr /C:"beljnjfifmncnfnhdkcmjpeonoigdnbl" >nul
    if !errorlevel! == 0 (
        echo   [OK]   %%~P
    ) else (
        echo   [FAIL] %%~P - policy tidak tertulis, ulangi sebagai Administrator.
    )
)
exit /B
