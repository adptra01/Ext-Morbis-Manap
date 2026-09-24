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

set EXT_ID=beljnjifmncnfnhdkcmjpeonoigdnbl
set UPDATE_URL=https://adptra01.github.io/Ext-Morbis-Manap/update.xml

echo.
echo ===== PENTING SEBELUM INSTAL =====
echo 1. Hapus dulu ekstensi MORBIS versi LAMA (Load unpacked) di browser:
echo    chrome://extensions - cari MORBIS Ext Unofficial yang tertulis
echo    "Dimuat sebagai unpacked" - klik Hapus.
echo    Kalau tidak, ekstensi baru terpasang DUPLIKAT (dobel suara TTS).
echo 2. Tutup SEMUA jendela browser setelah installer selesai.
echo.
echo [1/5] Membersihkan policy MORBIS lama (ID lama / update.xml yang 404)...
REM Key policy di bawah dikelola installer MORBIS ini - dihapus dulu agar
REM ID lama tidak tersisa, lalu ditulis ulang dengan ID baru.
reg delete "HKLM\SOFTWARE\Policies\Microsoft\Edge\ExtensionInstallForcelist" /f >nul 2>&1
reg delete "HKLM\SOFTWARE\Policies\Microsoft\Edge\ExtensionInstallAllowlist" /f >nul 2>&1
reg delete "HKLM\SOFTWARE\Policies\Google\Chrome\ExtensionInstallForcelist" /f >nul 2>&1
reg delete "HKLM\SOFTWARE\Policies\Google\Chrome\ExtensionInstallAllowlist" /f >nul 2>&1
reg delete "HKLM\SOFTWARE\Policies\BraveSoftware\Brave\ExtensionInstallForcelist" /f >nul 2>&1
reg delete "HKLM\SOFTWARE\Policies\BraveSoftware\Brave\ExtensionInstallAllowlist" /f >nul 2>&1

echo [2/5] Menyiapkan Microsoft Edge...
reg add "HKLM\SOFTWARE\Policies\Microsoft\Edge\ExtensionInstallForcelist" /v "1" /t REG_SZ /d "%EXT_ID%;%UPDATE_URL%" /f >nul 2>&1
reg add "HKLM\SOFTWARE\Policies\Microsoft\Edge\ExtensionInstallAllowlist" /v "1" /t REG_SZ /d "%EXT_ID%" /f >nul 2>&1

echo [3/5] Menyiapkan Google Chrome...
reg add "HKLM\SOFTWARE\Policies\Google\Chrome\ExtensionInstallForcelist" /v "1" /t REG_SZ /d "%EXT_ID%;%UPDATE_URL%" /f >nul 2>&1
reg add "HKLM\SOFTWARE\Policies\Google\Chrome\ExtensionInstallAllowlist" /v "1" /t REG_SZ /d "%EXT_ID%" /f >nul 2>&1

echo [4/5] Menyiapkan Brave Browser...
reg add "HKLM\SOFTWARE\Policies\BraveSoftware\Brave\ExtensionInstallForcelist" /v "1" /t REG_SZ /d "%EXT_ID%;%UPDATE_URL%" /f >nul 2>&1
reg add "HKLM\SOFTWARE\Policies\BraveSoftware\Brave\ExtensionInstallAllowlist" /v "1" /t REG_SZ /d "%EXT_ID%" /f >nul 2>&1

echo.
echo [5/5] Menyiapkan Autoplay untuk Suara TTS Antrian...
REM TTS antrian (Google voice / MP3 / chime) diblokir Chrome tanpa user gesture.
REM Policy AutoplayAllowed=1 = izinkan autoplay semua situs (setara
REM --autoplay-policy=no-user-gesture-required) agar display antrian
REM berbunyi tanpa perlu diklik terlebih dahulu.
reg add "HKLM\SOFTWARE\Policies\Microsoft\Edge\AutoplayAllowed" /v "1" /t REG_DWORD /d "1" /f >nul 2>&1
reg add "HKLM\SOFTWARE\Policies\Google\Chrome\AutoplayAllowed" /v "1" /t REG_DWORD /d "1" /f >nul 2>&1
reg add "HKLM\SOFTWARE\Policies\BraveSoftware\Brave\AutoplayAllowed" /v "1" /t REG_DWORD /d "1" /f >nul 2>&1

echo.
echo ===================================================
echo  INSTALASI SELESAI DAN SUKSES!
echo ===================================================
echo Silakan TUTUP semua jendela browser yang sedang terbuka.
echo Saat Anda membuka browser kembali, ekstensi MORBIS akan
echo terinstal OTOMATIS via policy (ID: beljnjifmncnfnhdkcmjpeonoigdnbl).
echo.
echo ===== VERIFIKASI =====
echo - chrome://extensions : kartu MORBIS TANPA label "unpacked"
echo - chrome://policy     : ExtensionInstallForcelist memuat ID baru
echo - Update berikutnya OTOMATIS (update.xml di GitHub Pages),
echo   tanpa perlu klik refresh / menjalankan apa pun lagi.
echo.
pause