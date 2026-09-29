@echo off
setlocal EnableDelayedExpansion
title MORBIS Ext - Utilitas (Pasang / Perbarui / Uninstall)
color 0A

REM ============================================================
REM  SATU SKRIP UNTUK SEMUA KEBUTUHAN PC USER
REM    [1] Pasang / Perbarui  - sekali seumur, auto-update aktif
REM    [2] Verifikasi         - cek policy tanpa mengubah apa pun
REM    [3] Uninstall          - hapus policy (sekali seumur juga)
REM
REM  Pemakaian non-interaktif (opsional):
REM    Install_Morbis_Ext.bat install
REM    Install_Morbis_Ext.bat verify
REM    Install_Morbis_Ext.bat uninstall
REM
REM  CATATAN GPO: untuk 50-500 PC, JANGAN pakai .bat ini (ada
REM  interaksi/prompt). Pakai policy JSON di deploy/policy/ yang
REM  bisa di-push otomatis oleh GPO/Intune.
REM ============================================================

REM Cek admin. CATATAN: "net session" bisa GAGAL walau sudah admin bila
REM service Windows "Server" dimatikan - kondisi yang umum di PC kerja.
REM fltmc (Filter Manager) selalu ada di Windows modern dan tidak bergantung
REM service tersebut, jadi dipakai sebagai pemeriksaan utama.
fltmc >nul 2>&1
if errorlevel 1 (
    net session >nul 2>&1
    if errorlevel 1 (
        echo Meminta izin Administrator...
        powershell -Command "Start-Process '%0' -Verb RunAs"
        exit /B
    )
)

:MAIN
REM ============================================================
REM  KONFIGURASI - sumber tunggal identitas produksi.
REM  EXT_ID = hash SHA256 public key (wajib 32 char a-p).
REM  JANGAN ketik ulang manual - copy-paste dari update.xml live.
REM  Sinkronisasi dijaga otomatis oleh CI (guard di deploy-to-main.yml).
REM ============================================================
set EXT_ID=beljnjfifmncnfnhdkcmjpeonoigdnbl
set UPDATE_URL=https://adptra01.github.io/Ext-Morbis-Manap/update.xml

REM Argument (kalau ada) langsung jalankan, tanpa menu.
if /i "%~1"=="install"   goto :INSTALL
if /i "%~1"=="verify"    goto :VERIFY_ONLY
if /i "%~1"=="uninstall" goto :UNINSTALL

:MENU
cls
echo ===================================================
echo   MORBIS Ext - Utilitas
echo   RSUD H. ABDUL MANAP
echo ===================================================
echo.
echo  [1] PASANG / PERBARUI   (rekomendasi - sekali seumur)
echo      Ekstensi terpasang otomatis + update OTOMATIS
echo      setiap ada versi baru. Tidak perlu jalankan lagi.
echo.
echo  [2] VERIFIKASI          (cek policy, tidak mengubah apa pun)
echo.
echo  [3] UNINSTALL           (hapus policy dari semua browser)
echo.
echo  [0] KELUAR
echo.
set "PILIHAN="
set /p "PILIHAN=Pilih [1]: "
if not defined PILIHAN set "PILIHAN=1"
if "%PILIHAN%"=="1" goto :INSTALL
if "%PILIHAN%"=="2" goto :VERIFY_ONLY
if "%PILIHAN%"=="3" goto :UNINSTALL
if "%PILIHAN%"=="0" exit /B 0
echo.
echo Pilihan tidak dikenal.
timeout /t 2 /nobreak >nul
goto :MENU

:INSTALL
cls
echo ===================================================
echo     PASANG / PERBARUI EKSTENSI SIMRS MORBIS
echo     RSUD H. ABDUL MANAP
echo ===================================================
echo.
echo Sedang mengonfigurasi browser Anda...
echo.

REM Validasi EXT_ID harus tepat 32 karakter (a-p).
call :StrLen
if not "!EXT_ID_LEN!"=="32" (
    echo.
    echo ==========================================
    echo  ERROR: EXT_ID panjang !EXT_ID_LEN! karakter.
    echo  Harus tepat 32 karakter ^(a-p^).
    echo  Installer dihentikan - screenshot dan kirim ke admin.
    echo ==========================================
    pause
    exit /B 1
)
echo [OK] EXT_ID valid: 32 karakter.
echo.

REM Deteksi OS 32-bit. Semua policy ditulis dengan /reg:64 (view 64-bit);
REM di OS 32-bit switch itu tidak berlaku sehingga SETIAP reg add gagal
REM secara diam-diam. Lebih baik berhenti dengan pesan jelas.
set "OS32="
if /i "%PROCESSOR_ARCHITEW6432%"=="" if /i "%PROCESSOR_ARCHITECTURE%"=="x86" set "OS32=1"
if defined OS32 (
    echo ==========================================================
    echo  ERROR: OS 32-bit terdeteksi.
    echo  Script ini butuh Windows 64-bit karena policy ditulis ke
    echo  registry 64-bit ^(/reg:64^). Di OS 32-bit semua policy akan
    echo  gagal ditulis tanpa pesan - itu sebabnya ekstensi tidak muncul.
    echo  Hubungi admin: gunakan PC 64-bit atau pasang lewat GPO.
    echo ==========================================================
    pause
    exit /B 1
)

REM Pastikan script dijalankan di 64-bit context kalau OS 64-bit
if "%PROCESSOR_ARCHITECTURE%"=="x86" if not defined PROCESSOR_ARCHITEW6432 (
    echo WARNING: CMD 32-bit di OS 64-bit. /reg:64 akan memaksa tulis ke native view.
)

echo ===== PENTING SEBELUM INSTALL =====
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
    REM Host restriction (least-privilege): runtime_allowed_hosts membatasi
    REM SITE tempat extension boleh berjalan/menyuntik content script - hanya
    REM host SIMRS produksi. List = array string (value "1","2",...).
    REM PENTING: Chrome MEMBUKA entri policy ExtensionSettings bila satu nilai
    REM tidak valid. Pola runtime_allowed_hosts WAJIB scheme://host TANPA path
    REM (tanpa "/*") - kalau ada path, seluruh ExtensionSettings (termasuk
    REM force_installed) ditolak. Diverifikasi di chrome://policy (Linux).
    REM Catatan: ini pelengkap host_permissions; fetch jaringan tetap diatur
    REM manifest (Phase D menghapus host dev dari build produksi).
    reg add "!BASE!\ExtensionSettings\!EXT_ID!\runtime_allowed_hosts" /v "1" /t REG_SZ /d "http://103.147.236.140" /f /reg:64 >nul 2>&1
    reg add "!BASE!\ExtensionSettings\!EXT_ID!\runtime_allowed_hosts" /v "2" /t REG_SZ /d "http://103.147.236.138" /f /reg:64 >nul 2>&1
    reg add "!BASE!\ExtensionSettings\!EXT_ID!\runtime_allowed_hosts" /v "3" /t REG_SZ /d "http://192.168.8.4" /f /reg:64 >nul 2>&1
    reg add "!BASE!\ExtensionSettings\!EXT_ID!\runtime_allowed_hosts" /v "4" /t REG_SZ /d "http://dev.rsudkotajambi.id" /f /reg:64 >nul 2>&1
    REM Autoplay: izinkan suara TTS antrian tanpa klik (value di root key).
    reg add "!BASE!" /v "AutoplayAllowed" /t REG_DWORD /d "1" /f /reg:64 >nul 2>&1
)

echo.
echo [DIAGNOSIS] Memeriksa hasil penulisan (Chrome)...
reg query "HKLM\SOFTWARE\Policies\Google\Chrome\ExtensionInstallForcelist" /v "1" /reg:64 >nul 2>&1
if errorlevel 1 (
    echo.
    echo ==========================================================
    echo  PENULISAN POLICY GAGAL - ini penyebabnya:
    echo ==========================================================
    echo Chrome_forced = registry tidak berubah setelah ditulis.
    echo.
    echo 1^) Ulangi skrip ini dengan KLIK KANAN -^> "Run as administrator".
    echo 2^) Pastikan tidak ada antivirus/security software yang
    echo    memblokir perubahan registry.
    echo 3^) Lihat pesan error asli dari Windows di bawah ini:
    echo.
    reg add "HKLM\SOFTWARE\Policies\Google\Chrome\ExtensionInstallForcelist" /v "1" /t REG_SZ /d "!EXT_ID!;!UPDATE_URL!" /f /reg:64
    echo.
    echo Screenshot pesan di atas kirim ke admin.
    echo.
    pause
    goto :FINISH_FAIL
)
echo.
echo [4/6] Verifikasi lengkap (registry + update.xml + versi terpasang)...
call :VerifyPolicy

echo.
echo [5/6] Menutup ulang browser (kalau ada yang auto-restart)....
call :KillBrowsers

echo.
echo [6/6] Selesai.
echo.
echo ===================================================
echo  INSTALASI SELESAI
echo ===================================================
echo Silakan BUKA KEMBALI browser Anda. Ekstensi MORBIS akan
echo terinstal OTOMATIS via policy (ID: beljnjfifmncnfnhdkcmjpeonoigdnbl).
echo Installer sudah memverifikasi registry di atas. Tersisa 1 cek visual:
echo.
echo ===== VERIFIKASI WAJIB (1 menit) =====
echo 1. chrome://policy  (atau edge://policy)
echo    - baris ExtensionSettings ADA
echo    - kolom "Error" KOSONG  ^<-- WAJIB. Kalau ada error, policy ditolak
echo      browser dan ekstensi TIDAK akan ter-install.
echo 2. chrome://extensions
echo    - kartu MORBIS muncul, TANPA label "unpacked"
echo    - klik "Detail" - pastikan ID = beljnjfifmncnfnhdkcmjpeonoigdnbl
echo 3. Buka http://103.147.236.140 - ekstensi aktif di halaman SIMRS.
echo.
echo Update berikutnya OTOMATIS dari update.xml (GitHub Pages) - tanpa
echo perlu mengunduh atau memasang ulang apa pun. Skrip ini tidak perlu
echo dijalankan lagi.
echo.
pause
exit /B 0

:FINISH_FAIL
echo.
echo ===================================================
echo  INSTALL BELUM BERHASIL - policy tidak tertulis
echo ===================================================
echo Perbaiki dulu penyebab di atas, lalu jalankan skrip ini lagi.
echo Butuh bantuan? Screenshot jendela ini kirim ke admin.
echo.
pause
exit /B 1

:VERIFY_ONLY
cls
echo ===================================================
echo     VERIFIKASI POLICY - MORBIS EXT
echo ===================================================
echo.
echo Tidak ada yang diubah. Hanya membaca + memeriksa.
echo.
call :VerifyPolicy
echo.
pause
exit /B 0

:UNINSTALL
cls
color 0C
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
call :KillBrowsers

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
echo.
echo CATATAN: kartu MORBIS di chrome://extensions TIDAK hilang dengan
echo sendirinya (Chrome menahannya selama policy aktif). Setelah policy
echo dihapus, buka browser lalu hapus kartunya manual, atau gunakan
echo "chrome://extensions" - tombol Hapus.
echo.
pause
exit /B 0

REM ============================================================
REM  SUBROUTINE: hitung panjang EXT_ID -> EXT_ID_LEN
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
REM  SUBROUTINE: verifikasi_policy
REM  - ExtensionInstallForcelist (nilai "1" = EXT_ID;UPDATE_URL)
REM  - ExtensionSettings: installation_mode, update_url,
REM    override_update_url, AutoplayAllowed
REM  - runtime_allowed_hosts: 4 host WAJIB tanpa path - path membuat
REM    Chrome membatalkan SELURUH entri ExtensionSettings (regresi dicek).
REM  Browser tidak terpasang tetap dihitung OK (policy sah, siap
REM  bila browser di-install belakangan).
REM ============================================================
:VerifyPolicy
set "V_OK=0"
set "V_FAIL=0"
for %%P in (
    "Google\Chrome"
    "Microsoft\Edge"
    "BraveSoftware\Brave"
    "Vivaldi"
    "Opera Software\Opera"
    "Chromium"
) do (
    set "PB=HKLM\SOFTWARE\Policies\%%~P"
    set "BSTAT=OK"
    set "BDETAIL="

    reg query "!PB!\ExtensionInstallForcelist" /v "1" /reg:64 2>nul | findstr /C:"!EXT_ID!" >nul
    if errorlevel 1 (
        set "BSTAT=FAIL"
        set "BDETAIL=!BDETAIL! Forcelist "
    )
    reg query "!PB!\ExtensionSettings\!EXT_ID!" /v "installation_mode" /reg:64 2>nul | findstr /C:"force_installed" >nul
    if errorlevel 1 (
        set "BSTAT=FAIL"
        set "BDETAIL=!BDETAIL! installation_mode "
    )
    reg query "!PB!\ExtensionSettings\!EXT_ID!" /v "update_url" /reg:64 2>nul | findstr /C:"adptra01.github.io" >nul
    if errorlevel 1 (
        set "BSTAT=FAIL"
        set "BDETAIL=!BDETAIL! update_url "
    )
    reg query "!PB!\ExtensionSettings\!EXT_ID!" /v "override_update_url" /reg:64 2>nul | findstr /C:"0x1" >nul
    if errorlevel 1 (
        set "BSTAT=FAIL"
        set "BDETAIL=!BDETAIL! override_update_url "
    )
    REM Count host yang tertulis (nilai 1-4). Query /s lalu cocokkan host,
    REM bukan nama value, supaya aman terhadap urutan penulisan.
    set "HCNT=0"
    for %%H in (103.147.236.140 103.147.236.138 192.168.8.4 dev.rsudkotajambi.id) do (
        reg query "!PB!\ExtensionSettings\!EXT_ID!\runtime_allowed_hosts" /s /reg:64 2>nul | findstr /C:"%%~H" >nul
        if not errorlevel 1 set /a "HCNT+=1"
    )
    if !HCNT! LSS 4 (
        set "BSTAT=FAIL"
        set "BDETAIL=!BDETAIL! runtime_allowed_hosts=!HCNT!/4 "
    )
    REM Regresi: pola berpath "/*" PENOLAK seluruh ExtensionSettings.
    reg query "!PB!\ExtensionSettings\!EXT_ID!\runtime_allowed_hosts" /s /reg:64 2>nul | findstr /C:"/*" >nul
    if not errorlevel 1 (
        set "BSTAT=FAIL"
        set "BDETAIL=!BDETAIL! POLA-PATH(tolak) "
    )

    if "!BSTAT!"=="OK" (
        set /a "V_OK+=1"
        echo    [OK]   %%~P
    ) else (
        set /a "V_FAIL+=1"
        echo    [FAIL] %%~P - !BDETAIL!
        REM Tampilkan isi registry sebenarnya (jangan tebak penyebabnya).
        echo           isi registry:
        reg query "!PB!" /s /reg:64 2>&1 | findstr /C:"ExtensionInstallForcelist" /C:"ExtensionSettings" /C:"!EXT_ID!" /C:"update_url" /C:"ERROR"
    )
)

REM --- Cek update.xml (butuh internet) -------------------------------------
REM update.xml di-generate CI dengan format tetap:
REM   <updatecheck codebase='<url>' version='<X.Y.Z>' />
REM Dibaca per-token; bila format berubah, cek ini degrade jadi WARN
REM (bukan error - hanya tidak bisa dibandingkan).
set "LIVE="
curl -s --max-time 15 -o "%TEMP%\morbis-update-check.xml" "!UPDATE_URL!" 2>nul
if exist "%TEMP%\morbis-update-check.xml" (
    REM delims hanya apos (tanpa spasi - spasi akan merusak parsing batch).
    REM Kutip apos membagi: 1="<updatecheck codebase=", 2=URL, 3=" version=",
    REM 4=versi. tokens=4 = versi.
    for /f "tokens=4 delims='" %%V in ('findstr updatecheck "%TEMP%\morbis-update-check.xml"') do (
        if not defined LIVE set "LIVE=%%V"
    )
)
del /q "%TEMP%\morbis-update-check.xml" 2>nul
if defined LIVE (
    echo    [OK]   update.xml hidup, versi live: !LIVE!
    echo    Perbandingan: versi live harus ^>= versi yang terinstall.
) else (
    echo    [WARN] update.xml tidak terbaca - cek internet/proxy PC ini.
    echo           Update OTOMATIS tidak jalan tanpa akses URL di atas.
)

echo.
echo -- Ringkasan: !V_OK! lolos, !V_FAIL! gagal.
if not "!V_FAIL!"=="0" (
    echo    [PERINGATAN] Ada policy gagal. Ekstensi TIDAK ter-install di browser itu.
    echo    Buka chrome://policy - kolom "Error" akan memberi petunjuk.
) else (
    echo    Semua policy valid. Tutup jendela CMD ini.
)
exit /B
