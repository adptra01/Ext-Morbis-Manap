@echo off
setlocal EnableDelayedExpansion
title MORBIS Ext - Utilitas (Pasang / Perbarui / Uninstall)
color 0A

REM Paksa System32 di depan PATH. PC kerja sering punya tool pihak ketiga
REM (Git for Windows, Laragon, WSL) yang menaruh bin-nya lebih dulu di
REM PATH, sehingga reg.exe / findstr.exe / schtasks.exe yang dipanggil
REM tanpa path bisa resolve ke versi yang salah. Contoh nyata di PC uji:
REM "where curl" menunjuk D:\laragon\...\curl.exe, bukan curl Windows.
REM Perhatikan :PULL menambah path Git SESUDAH baris ini, jadi tool Git
REM tetap bisa dipakai - hanya utilitas Windows yang dilindungi.
set "PATH=%SystemRoot%\System32;%SystemRoot%;%SystemRoot%\System32\Wbem;%SystemRoot%\System32\WindowsPowerShell\v1.0;%PATH%"

REM ============================================================
REM  SATU SKRIP UNTUK SEMUA KEBUTUHAN PC USER
REM    [1] Pasang / Perbarui  - policy browser, perlu PC "managed"
REM    [2] Verifikasi         - cek policy tanpa mengubah apa pun
REM    [3] Pasang manual      - unpacked, untuk PC tanpa policy
REM    [4] Uninstall          - hapus policy
REM    [5] Jadwalkan update   - tarik update harian 05:00
REM    [6] Pulihkan policy    - kembalikan dari backup .reg
REM  pull = mode MESIN untuk tugas terjadwal (tanpa nomor menu,
REM         dipanggil sebagai "Install_Morbis_Ext.bat pull").
REM
REM .skrip ini adalah SATU-SATUNYA installer/uninstaller. Semua
REM .bat lama sudah digabung ke sini dan dihapus:
REM    Uninstall_Morbis_Ext.bat  - salinannya BERBEDA dan bisa
REM                                  menghapus policy milik IT
REM    Setup_Update_Terjadwal.bat- kini mode [5] di bawah
REM    pack-extension.bat / deploy-to-github.bat
REM                              - build tool, duplikat "npm run pack"
REM                                dan "npm run deploy"
REM    scripts\morbis-update-main.bat - kini mode [6] "pull" di bawah
REM    scripts\morbis-update.bat      - tak terpakai (Node/branch dev)
REM
REM  Konsekuensi: TIDAK ada lagi payload .bat terpisah yang ikut ter-clone
REM  ke %USERPROFILE%\morbis-ext. Folder itu boleh hilang/bergeser tanpa
REM  merusak apa pun, dan mode [5] jadwalkan menyalin file INI ke lokasi
REM  sendiri supaya skrip bertugas tidak ikut hilang bersama foldernya.
REM
REM  Pemakaian non-interaktif (opsional):
REM    Install_Morbis_Ext.bat install
REM    Install_Morbis_Ext.bat verify
REM    Install_Morbis_Ext.bat manual
REM    Install_Morbis_Ext.bat schedule
REM    Install_Morbis_Ext.bat restore
REM    Install_Morbis_Ext.bat pull
REM    Install_Morbis_Ext.bat uninstall
REM
REM  CATATAN GPO: untuk 50-500 PC, JANGAN pakai .bat ini (ada
REM  interaksi/prompt). Pakai policy JSON di deploy/policy/ yang
REM  bisa di-push otomatis oleh GPO/Intune.
REM ============================================================

:MAIN
REM ============================================================
REM  KONFIGURASI - sumber tunggal identitas produksi.
REM  EXT_ID = hash SHA256 public key (wajib 32 char a-p).
REM  JANGAN ketik ulang manual - copy-paste dari update.xml live.
REM  Sinkronisasi dijaga otomatis oleh CI (guard di deploy-to-main.yml).
REM ============================================================
set EXT_ID=beljnjfifmncnfnhdkcmjpeonoigdnbl
set UPDATE_URL=https://adptra01.github.io/Ext-Morbis-Manap/update.xml

REM View registry TETAP dihitung sekali di sini, sebelum cabang mana pun.
REM Sebelumnya RV hanya di-set di jalur :INSTALL, jadi jalur :UNINSTALL
REM memakai reg delete tanpa /reg:64 - pada cmd 32-bit di OS 64-bit itu
REM menulis ke Wow6432Node dan policy MORBIS di native view UTUH.
call :InitRegistryView

REM Argument (kalau ada) langsung jalankan, tanpa menu.
set "MODE=%~1"

REM Log disimpan di lokasi yang sama dengan utilitas terjadwal
REM (%LOCALAPPDATA%\Morbis), BUKAN %TEMP%. %TEMP% dibersihkan
REM saat reboot dan oleh Disk Cleanup, jadi log mode "pull" yang
REM paling dibutuhkan justru akan hilang tepat saat dibutuhkan.
set "TOOL_DIR=%LOCALAPPDATA%\Morbis"
set "LOGFILE=%TOOL_DIR%\morbis-utilitas.log"
set "BACKUP_DIR=%TOOL_DIR%\backup"
if not exist "%TOOL_DIR%" mkdir "%TOOL_DIR%" >nul 2>&1
REM Rotasi sederhana: mode "pull" jalan tiap hari, jadi tanpa rotasi file
REM membengkak tanpa batas. Kalau log sudah lewat 512KB, geser ke
REM -prev.log (satu generasi; cukup untuk forensik kemarin vs hari ini).
for %%L in ("!LOGFILE!") do if exist "%%L" if %%~zL GTR 524288 (
    move /Y "!LOGFILE!" "!TOOL_DIR!\morbis-utilitas-prev.log" >nul 2>&1
)
call :LogStamp
call :Log "START mode=%MODE% user=%USERNAME%"

if not defined MODE goto :MENU
goto :DISPATCH

:MENU
cls
echo ===================================================
echo   MORBIS Ext - Utilitas
echo   RSUD H. ABDUL MANAP
echo ===================================================
echo.
echo  [1] PASANG / PERBARUI   (policy browser - perlu PC "managed")
echo      Ekstensi terpasang otomatis + update OTOMATIS
echo      setiap ada versi baru. Tidak perlu jalankan lagi.
echo      GAGAL di PC yang tidak domain-joined / enrolled - skrip
echo      akan memberi tahu, bukan diam-diam claims berhasil.
echo.
echo  [2] VERIFIKASI          (cek policy, tidak mengubah apa pun)
echo.
echo  [3] PASANG MANUAL       (Jalur A - untuk PC tanpa policy)
echo      Tidak butuh admin/domain/Store. Ekstensi dimuat
echo      "unpacked" dari %USERPROFILE%\morbis-ext
echo      (butuh 1 klik REFRESH saat ada versi baru).
echo.
echo  [4] UNINSTALL           (hapus policy dari semua browser)
echo.
echo  [5] JADWALKAN UPDATE     (tarik versi baru tiap hari 05:00)
echo      Untuk mode [3] saja, jadi Anda tidak perlu
echo      menjalankan skrip update secara manual.
echo.
echo  [6] PULIHKAN POLICY     (kembalikan dari backup .reg)
echo      Dipakai kalau mode [1] menyebabkan masalah dan
echo      policy perlu dikembalikan ke kondisi sebelumnya.
echo      Backup: %LOCALAPPDATA%\Morbis\backup
echo.
echo  [0] KELUAR
echo.
echo  Perintah: install / verify / manual / uninstall / schedule /
echo             restore / pull
echo             (pull = mode mesin untuk tugas terjadwal)
set "PILIHAN="
set /p "PILIHAN=Pilih [1-6]: "
if not defined PILIHAN set "PILIHAN=1"
if "%PILIHAN%"=="0" exit /B 0
set "MODE=%PILIHAN%"
goto :DISPATCH

REM ============================================================
REM  DISPATCH + GERBANG ADMIN PER-MODE
REM  Dulu gerbang admin ada SATU kali di paling atas, sebelum
REM  menu. Efeknya mode [3] manual - yang justru dirancang buat
REM  PC tanpa hak admin - ikut memunculkan UAC,
REM  dengan klaim "tidak butuh admin". Di sini tiap mode
REM  menyatakan kebutuhannya sendiri:
REM    install / uninstall / schedule -> butuh admin
REM    manual / verify                 -> TIDAK butuh admin
REM ============================================================
:DISPATCH
if /i "%MODE%"=="1"        set "MODE=install"
if /i "%MODE%"=="2"        set "MODE=verify"
if /i "%MODE%"=="3"        set "MODE=manual"
if /i "%MODE%"=="4"        set "MODE=uninstall"
if /i "%MODE%"=="5"        set "MODE=schedule"
if /i "%MODE%"=="6"        set "MODE=restore"

if /i "%MODE%"=="install"   goto :D_INSTALL
if /i "%MODE%"=="verify"    goto :VERIFY_ONLY
if /i "%MODE%"=="manual"    goto :MANUAL_INSTALL
if /i "%MODE%"=="uninstall" goto :D_UNINSTALL
if /i "%MODE%"=="schedule"  goto :D_SCHEDULE
if /i "%MODE%"=="restore"   goto :D_RESTORE
if /i "%MODE%"=="pull"      goto :DISPATCH_PULL

cls
echo.
echo Pilihan tidak dikenal: "%MODE%"
echo Gunakan angka 0-6, atau install / verify / manual / schedule / pull / restore / uninstall.
call :Hold
exit /B 1

REM "pull" adalah mode MESIN: dipanggil schtasks tiap hari. Lihat catatan
REM di :Hold - mode ini tidak boleh menahan tombol apa pun.
:DISPATCH_PULL
set "NOPAUSE=1"
goto :PULL

:D_INSTALL
call :RequireAdmin "install"
if errorlevel 1 exit /B
goto :INSTALL

:D_UNINSTALL
call :RequireAdmin "uninstall"
if errorlevel 1 exit /B
goto :UNINSTALL

:D_SCHEDULE
call :RequireAdmin "schedule"
if errorlevel 1 exit /B
goto :SCHEDULE

:D_RESTORE
call :RequireAdmin "restore"
if errorlevel 1 exit /B
goto :RestorePolicy

REM ============================================================
REM  SUBRUTIN: RequireAdmin <mode>
REM  Mengembalikan 0 kalau sudah admin, 1 kalau elevation
REM  gagal. Memakai argumen mode supaya UAC elevating() membuka skrip
REM  yang sama persis, langsung masuk mode itu, bukan kembali ke menu.
REM  CATATAN: "net session" bisa GAGAL walau sudah admin bila
REM  service Windows "Server" dimatikan - kondisi yang umum di
REM  PC kerja. fltmc (Filter Manager) selalu ada di Windows
REM  modern dan tidak bergantung service tersebut, jadi dipakai
REM  sebagai pemeriksaan utama.
REM ============================================================
:RequireAdmin
fltmc >nul 2>&1
if not errorlevel 1 exit /B 0
net session >nul 2>&1
if not errorlevel 1 exit /B 0
echo Meminta izin Administrator...
if "%~1"=="" goto :RA_ELEVATE_PLAIN
powershell -Command "Start-Process '%0' -ArgumentList '%~1' -Verb RunAs" >nul 2>&1
if errorlevel 1 goto :RA_DENIED
echo.
echo Jendela baru Administrator dibuka - pekerjaan lanjut di sana.
echo Jendela ini SENGAJA ditahan supaya Anda sempat membaca.
call :Log "elevasi admin mode %~1 - lanjut di jendela Administrator"
call :Hold
exit /B 1
:RA_DENIED
echo.
echo [GAGAL] Elevasi Administrator gagal atau prompt UAC dibatalkan.
echo Jalankan ulang skrip ini dan setujui prompt UAC.
call :Log "GAGAL elevasi admin mode %~1"
call :Hold
exit /B 1
:RA_ELEVATE_PLAIN
powershell -Command "Start-Process '%0' -Verb RunAs" >nul 2>&1
if errorlevel 1 goto :RA_DENIED
echo.
echo Jendela baru Administrator dibuka - pekerjaan lanjut di sana.
echo Jendela ini SENGAJA ditahan supaya Anda sempat membaca.
call :Log "elevasi admin - lanjut di jendela Administrator"
call :Hold
exit /B 1

REM ============================================================
REM  SUBRUTIN: Hold
REM  Menahan jendela di akhir program - sukses maupun gagal - supaya
REM  user sempat membaca atau screenshot sebelum jendela tertutup.
REM
REM  Dulu beberapa akhir memakai "timeout /t N" buta: jendela menutup
REM  sendiri setelah N detik walau user belum selesai membaca, dan
REM  user bisa menekan tombol apa pun untuk membatalkan hitungannya.
REM
REM  PENTING: mode "pull" dipanggil schtasks tiap hari dengan sesi
REM  konsol NYATA. Kalau mode mesin ini menahan tombol apa pun, task
REM  akan menggantung selamanya tanpa pernah dilaporkan selesai. Karena
REM  itu NOPAUSE dipaksa aktif untuk "pull" - bukan sekadar opsional.
REM  Otomasi lain bisa memakai variabel lingkungan MORBIS_NO_PAUSE=1.
REM
REM  "pause >nul" dipakai, bukan "choice": choice menulis prompt ke
REM  stdout sehingga "choice ... >nul" JUSTRU menyembunyikan pertanyaannya.
REM  "pause >nul" menahan tombol di konsol sungguhan, dan langsung
REM  kembali kalau stdin di-redirect (dipakai otomatisasi/test) - jadi
REM  tidak ada risiko menggantung.
REM ============================================================
:Hold
if defined NOPAUSE exit /B 0
if defined MORBIS_NO_PAUSE exit /B 0
echo.
echo   --------------------------------------------------
echo    Semua proses selesai.
echo    Screenshot / salin teksnya bila perlu bantu admin.
echo    Tekan tombol apa saja untuk menutup jendela.
echo   --------------------------------------------------
REM "pause >nul" langsung kembali kalau stdin di-redirect (shortcut/IDE),
REM sehingga jendela bisa tertutup sebelum user selesai membaca. ReadKey
REM membaca langsung dari konsol, tidak peduli stdin di-redirect.
powershell -NoProfile -Command "$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')" >nul 2>&1
if errorlevel 1 pause >nul
exit /B 0

  REM ============================================================
  REM  Jalur A - pasang manual untuk PC yang TIDAK bisa memakai policy.
REM  Prismanya: mode [6] "pull" di bawah menarik branch main ke
REM  %USERPROFILE%\morbis-ext, lalu user memuatnya sekali lewat
REM  "Load unpacked". Update harian dijaga tugas terjadwal, jadi user
REM  cukup klik REFRESH saat ada fitur baru.
REM  Jalur ini butuh Git, bukan butuh admin - cocok untuk PCUSER
REM  yang tidak/domain-joined.
REM ============================================================
:MANUAL_INSTALL
cls
echo ===================================================
echo     PASANG MANUAL (TANPA POLICY) - JALUR A
echo     RSUD H. ABDUL MANAP
echo ===================================================
echo.
echo Jalur ini TIDAK memakai policy browser, jadi tidak perlu
echo PC terdaftar managed / domain / Chrome Web Store. Yang
echo dibutuhkan: koneksi internet dan Git.
echo.
echo PERINGATAN: ekstensi akan dimuat sebagai "unpacked".
echo  - chrome://extensions akan menampilkan "Dimuat sebagai
echo    unpacked" dan extension bisa dinonaktifkan user.
echo  - Auto-update TIDAK jalan; perlu klik REFRESH di
echo    chrome://extensions setiap ada versi baru (tugas terjadwal
echo    sudah menarik file terbaru-nya tiap jam 05:00).
echo.
pause

echo.
echo [1/3] Menarik versi terbaru ke %USERPROFILE%\morbis-ext ...
REM PULL_QUIET: mode [3] sudah mencetak langkahnya sendiri dan membuka
REM chrome di akhir, jadi :PULL tidak boleh cls/ buka browser lagi.
set "PULL_QUIET=1"
call :PULL
set "PULL_QUIET="
if errorlevel 1 (
    echo    [GAGAL] Tarik versi gagal. Lihat pesan di atas.
    pause
    goto :FINISH_FAIL
)
echo.
echo [2/3] Membuka chrome://extensions ...
start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" "chrome://extensions" 2>nul
start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" "chrome://extensions" 2>nul
start "" "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" "chrome://extensions" 2>nul
echo    (kalau Edge/Brave yang dipakai, buka edge://extensions / brave://extensions)
echo.
echo [3/3] Selesai - tinggal 1 langkah di browser.
echo.
echo ===================================================
echo  LANGKAH MANUAL DI BROWSER (wajib)
echo ===================================================
echo 1. chrome://extensions  -&gt; nyalakan "Mode developer" (pojok kanan atas)
echo 2. Klik "Load unpacked"  -&gt; pilih folder INI:
echo      %USERPROFILE%\morbis-ext
echo    (bukan folder di dalam, bukan folder dist)
echo 3. Pastikan kartu MORBIS Ext muncul, TIDAK ada label "blocked"
echo 4. Supaya update harian tetap jalan, jalankan mode [5]
echo    "Jadwalkan update" dari skrip ini (sekali saja).
echo      Menarik file baru tiap hari 05:00; Anda tetap klik
echo      REFRESH di chrome://extensions untuk memakainya.
echo.
call :Hold
exit /B 0

REM ============================================================
REM  Jalur A - Penjadwal update harian.
REM  Yang dijadwalkan adalah mode [6] "pull" milik file ini sendiri:
REM  menarik branch main ke %USERPROFILE%\morbis-ext tiap hari 05:00.
REM  CATATAN: skrip yang dijalankan task adalah SALINAN file ini di
REM  %LOCALAPPDATA%\Morbis\morbis-utilitas.bat - bukan installer yang
REM  sedang berjalan dan bukan file di dalam folder clone. Alasannya,
REM  folder %USERPROFILE%\morbis-ext bisa digeser ke .bak-<timestamp>
REM  oleh :PULL_SHIFT saat clone gagal, dan file di dalamnya ikut hilang
REM  sehingga jadwal ikut mati diam-diam.
REM ============================================================
:SCHEDULE
cls
echo ===================================================
echo     JADWALKAN UPDATE HARIAN
echo     RSUD H. ABDUL MANAP
echo ===================================================
echo.
echo Membuat tugas Windows "Morbis Ext Update": setiap hari
echo pukul 05:00 file di !USERPROFILE!\morbis-ext ditarik
echo ulang dari branch main.
echo.
echo Syarat:
echo   - Folder !USERPROFILE!\morbis-ext sudah ada
echo     (jalankan mode [3] PASANG MANUAL minimal sekali)
echo   - Git terpasang di PC ini
echo.
if not exist "%USERPROFILE%\morbis-ext" goto :SCHED_NO_CLONE

REM Tugas harus memanggil file yang BERTAHAN. Dulu skrip update terpisah
REM ikut ter-clone ke %USERPROFILE%\morbis-ext, tapi folder itu bisa
REM digeser oleh mode "pull" kalau clone gagal, jadi file .bat di
REM dalamnya ikut hilang. Installer ini disalin ke lokasi sendiri
REM (bukan di dalam folder clone) supaya jadwal tidak ikut rusak.
set "TOOL_DIR=%LOCALAPPDATA%\Morbis"
set "TOOL=%TOOL_DIR%\morbis-utilitas.bat"
if not exist "!TOOL_DIR!" mkdir "!TOOL_DIR!" >nul 2>&1
copy /Y "%~f0" "!TOOL!" >nul 2>&1
if not exist "!TOOL!" goto :SCHED_FAIL

"%SystemRoot%\System32\schtasks.exe" /Create /F /TN "Morbis Ext Update" /TR "\"!TOOL!\" pull" /SC DAILY /ST 05:00
if errorlevel 1 goto :SCHED_FAIL
REM Stability "run task as soon as possible after a scheduled start is
REM missed" TIDAK bisa diset lewat flag schtasks, hanya lewat XML.
REM Tanpa itu, PC yang mati/hibernate jam 05:00 langsung kehilangan
REM update hari itu - dan tidak ada yang mengetahuinya.
REM Ekspor task yang baru dibuat, suntik <StartWhenAvailable>true</...>
REM ke dalam XML, lalu import ulang. Kalau gagal, task tetap ada
REM dengan jadwal 05:00 (lebih baik daripada tidak ada task sama
REM sekali), hanya tanpa fitur catch-up.
set "TASK_TMP=%TEMP%\morbis-task.xml"
"%SystemRoot%\System32\schtasks.exe" /Query /TN "Morbis Ext Update" /XML > "!TASK_TMP!" 2>nul
if exist "!TASK_TMP!" (
    REM sisipkan <StartWhenAvailable>true</StartWhenAvailable> tepat
    REM setelah penutup <Settings ...>
    powershell -NoProfile -Command "$p='$env:TEMP\morbis-task.xml';$t=Get-Content -Raw -LiteralPath $p;if($t -notmatch 'StartWhenAvailable'){$t=$t -replace '(?s)(<Settings[^>]*>)','$1<StartWhenAvailable>true</StartWhenAvailable>';Set-Content -LiteralPath $p -Value $t -Encoding UTF8}" >nul 2>&1
    if not errorlevel 1 (
        "%SystemRoot%\System32\schtasks.exe" /Create /F /TN "Morbis Ext Update" /XML "!TASK_TMP!" >nul 2>&1
        if errorlevel 1 (
            echo    CATATAN: catch-up saat terlewat GAGAL di-setup, jadwal 05:00 tetap aktif.
        ) else (
            echo    Catch-up update terlewat: AKTIF
        )
    ) else (
        echo    CATATAN: catch-up update terlewat GAGAL di-setup, jadwal 05:00 tetap aktif.
    )
    del "!TASK_TMP!" >nul 2>&1
)

echo.
echo ===== SUKSES =====
echo Tugas "Morbis Ext Update" dibuat: tiap hari pukul 05:00.
echo File versi baru ditarik otomatis dari branch main.
echo.
echo Utilitas tersimpan di:
echo   !TOOL!
echo.
echo Ingat dua hal:
echo  - Tetap perlu klik REFRESH di chrome://extensions
echo    setelah file tertarik (ekstensi unpacked tidak bisa
echo    di-reload otomatis oleh Chromium).
echo  - Tugas HANYA bisa jalan kalau user sedang LOGGED ON,
echo    karena kredensial PC tidak disimpan sama sekali.
echo    Kalau PC menyala SETELAH 05:00, catch-up ("run as soon
echo    as possible after a missed start") TIDAK berjalan.
echo.
echo    Untuk berjalan tanpa user login sama sekali, task harus
echo    memakai /RU SYSTEM - itu TIDAK doing. %USERPROFILE% dan
echo    Git milik user tidak akan ter-resolve, dan pull akan gagal.
echo.
echo Log utilisitas (kirim ke admin kalau ada masalah):
echo   !LOGFILE!
echo.
call :Log "SCHEDULE sukses - task harian 05:00 dibuat"
call :Hold
exit /B 0

:SCHED_NO_CLONE
echo.
echo [GAGAL] Folder !USERPROFILE!\morbis-ext belum ada.
echo Jalankan dulu mode [3] PASANG MANUAL, baru kembali ke sini.
echo.
call :Log "SCHEDULE gagal - folder clone belum ada"
call :Hold
exit /B 1

:SCHED_FAIL
echo.
echo [GAGAL] Tidak bisa membuat tugas terjadwal.
echo Jalankan sebagai Administrator, lalu coba lagi.
echo.
call :Log "SCHEDULE gagal - schtasks tidak bisa membuat task"
call :Hold
exit /B 1

REM ============================================================
REM  Jalur A - Tarik versi terbaru (branch main).
REM  Logikanya dulunya ada di scripts\morbis-update-main.bat,
REM  sekarang di-inline supaya repo tidak perlu .bat tambahan.
REM  Branch main berisi file ekstensi siap pakai di akar repo,
REM  jadi TIDAK butuh Node/npm - hanya Git.
REM ============================================================
:PULL
if not defined PULL_QUIET cls
echo ===================================================
echo     TARIK VERSI TERBARU
echo     RSUD H. ABDUL MANAP
echo ===================================================
echo.
call :Log "PULL mulai repo=%USERPROFILE%\morbis-ext"
set "REPO_DIR=%USERPROFILE%\morbis-ext"
set "REPO_URL=https://github.com/adptra01/Ext-Morbis-Manap.git"
REM TS hanya untuk nama folder cadangan, jadi yang diminta: satu nama unik
REM tanpa space. Dua jebakan lama di sini:
REM   1. %%TIME:~0,2%% di-pad space cmd (" 9:05" -> " 9"), jadi jam 00-09
REM      menghasilkan "20260929_ 905" yang BERISI SPACE.
REM   2. %%DATE%% mengikuti locale. Kode ini mengambil char 3,2 sebagai
REM      bulan, jadi benar di PC id-ID (28/09/2026) tapi di PC en-US
REM      (09/28/2026) bulan dan HARINYA tertukar diam-diam.
REM PowerShell (sudah jadi dependensi:UAC + :WritePolicyPS) memberi
REM format tetap; %%RANDOM%% dipakai kalau PowerShell gagal.
set "TS="
for /f "usebackq delims=" %%T in (`powershell -NoProfile -Command "Get-Date -Format yyyyMMdd_HHmmss" 2^>nul`) do set "TS=%%T"
REM Fallback TIDAK boleh memakai %%DATE%%/%%TIME%% karena keduanya
REM locale-dependent dan space-padded. Kombinasi %%RANDOM%% cukup unik
REM untuk satu folder cadangan lokal.
if not defined TS set "TS=%RANDOM%"
REM Sabuk pengaman: nama folder tidak boleh mengandung space.
set "TS=!TS: =!"
if not defined TS set "TS=fallback-%RANDOM%"

echo [1/3] Git ...
git --version >nul 2>&1
if not errorlevel 1 goto :PULL_GIT_OK
echo    Git belum ada - install via winget ...
winget install -e --id Git.Git --accept-package-agreements --accept-source-agreements
if errorlevel 1 winget install -e --id Git.Git --scope user --accept-package-agreements --accept-source-agreements
REM winget tidak menyegarkan PATH sesi cmd ini, jadi tambahkan manual.
set "PATH=%ProgramFiles%\Git\cmd;%LOCALAPPDATA%\Programs\Git\cmd;%ProgramFiles(x86)%\Git\cmd;%PATH%"
where git >nul 2>&1
if errorlevel 1 goto :PULL_FAIL
:PULL_GIT_OK
echo    Git OK

REM Folder ada tapi BUKAN repo kita (dibuat manual / clone gagal
REM separuh): geser ke .bak-<timestamp> lalu clone ulang. Git menolak
REM clone ke folder non-kosong, dan update ke repo yang salah lebih
REM berbahaya daripada diam.
if exist "!REPO_DIR!" if not exist "!REPO_DIR!\.git" goto :PULL_SHIFT
if exist "!REPO_DIR!\.git" goto :PULL_ORIGIN
if not exist "!REPO_DIR!" goto :PULL_CLONE
:PULL_SHIFT
echo [2/3] !REPO_DIR! bukan repo git - digeser ke morbis-ext.bak-!TS! ...
call :Log "PULL geser folder non-repo ke morbis-ext.bak-!TS!"
ren "!REPO_DIR!" "morbis-ext.bak-!TS!"
if errorlevel 1 goto :PULL_FAIL
goto :PULL_CLONE

:PULL_ORIGIN
set "ORIGIN_URL="
for /f "usebackq delims=" %%u in (`git -C "!REPO_DIR!" remote get-url origin 2^>nul`) do set "ORIGIN_URL=%%u"
echo "!ORIGIN_URL!" | findstr /i "Ext-Morbis-Manap" >nul
if not errorlevel 1 goto :PULL_HAVE_REPO
echo [2/3] Origin tidak dikenali - digeser ke morbis-ext.bak-!TS! ...
call :Log "PULL origin tidak dikenali: !ORIGIN_URL!"
ren "!REPO_DIR!" "morbis-ext.bak-!TS!"
if errorlevel 1 goto :PULL_FAIL
goto :PULL_CLONE

:PULL_CLONE
echo [2/3] Clone branch main ke !REPO_DIR! ...
set "PULL_STEP=clone"
git clone -b main "!REPO_URL!" "!REPO_DIR!"
if errorlevel 1 goto :PULL_FAIL
goto :PULL_UPDATE

:PULL_HAVE_REPO
echo [2/3] Repo sudah ada di !REPO_DIR!

:PULL_UPDATE
cd /d "!REPO_DIR!"
echo [3/3] Reset paksa ke main terbaru ...
REM Retry HANYA untuk fetch, karena itu tahap yang paling sering gagal
REM akibat jaringan putus sesaat. checkout/reset gagal berarti
REM masalah lain (repo rusak / permission) - diulang tidak menolong.
REM PENTING: stderr TIDAK dibuang. Kalau log tidak bisa memberi
REM alasan kegagalan, log ini tidak berguna untuk support.
REM "timeout" juga tidak dipakai - di bawah schtasks tidak ada
REM konsol, jadi timeout gagal dan tidak pernah menjeda.
set "PULL_STEP=fetch"
set "PULL_TRY=1"
:PULL_FETCH
git merge --abort 2>nul
git fetch origin main
if not errorlevel 1 goto :PULL_FETCH_OK
if !PULL_TRY! GEQ 3 goto :PULL_FAIL
set /a PULL_TRY+=1
call :Log "fetch gagal, percobaan !PULL_TRY! dari 3 - tunggu lalu ulang"
"%SystemRoot%\System32\ping.exe" -n 6 127.0.0.1 >nul 2>&1
goto :PULL_FETCH
:PULL_FETCH_OK
set "PULL_TRY="
set "PULL_STEP=checkout"
git checkout -f main
if errorlevel 1 goto :PULL_FAIL
set "PULL_STEP=reset"
git reset --hard origin/main
if errorlevel 1 goto :PULL_FAIL
set "PULL_STEP="
call :Log "PULL sukses di !REPO_DIR!"

echo.
echo ===== VERSI TERPASANG =====
git log --oneline -1
echo Lokasi: !REPO_DIR!
echo.
echo ===== SELESAI =====
echo Supaya file baru dipakai Chrome:
echo   1. chrome://extensions -^> klik REFRESH pada kartu MORBIS Ext
echo   2. di halaman MORBIS tekan Ctrl+Shift+R
echo.
echo Pastikan yang dimuat (Load unpacked) adalah folder:
echo   !REPO_DIR!
echo.
REM Mode [3] sudah mencetak langkahnya sendiri dan membuka browser di
REM akhir, jadi jangan cls / jangan buka tab chrome dua kali.
REM :Hold aman di sini: mode mesin selalu NOPAUSE, jadi task terjadwal
REM tidak akan menggantung; yang ditahan hanya jalan manual.
REM "start" memunculkan dialog GUI "Windows cannot find ..." kalau path
REM tidak ada (bukan stderr, jadi 2>nul tidak menahannya). Cek existence
REM dulu supaya PC dengan Chrome 64-bit-only tidak kena dialog error.
if defined PULL_QUIET exit /B 0
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" "chrome://extensions" 2>nul
if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" "chrome://extensions" 2>nul
if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" start "" "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" "chrome://extensions" 2>nul
call :Hold
exit /B 0

:PULL_FAIL
echo.
call :Log "PULL GAGAL pada langkah=%PULL_STEP% percobaan=%PULL_TRY%"
if not defined NOPAUSE echo Screenshot jendela ini dan kirim ke admin.
if not defined NOPAUSE if defined LOGFILE echo Log lengkap: "!LOGFILE!"
call :Hold
exit /B 1

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
call :Hold
    exit /B 1
)
echo [OK] EXT_ID valid: 32 karakter.
echo.

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

echo [2/6] Membersihkan policy MORBIS lama...
REM Backup policy SEBELUM menimpa apa pun.
REM Dulu hasil "reg export" ditulis ke %TEMP%. %TEMP% dihapus
REM saat reboot dan oleh Disk Cleanup / Storage Sense, jadi file
REM yang paling dibutuhkan untuk memulihkan policy justru hilang
REM paling cepat. Backup yang tidak ada sama nilainya dengan tidak
REM ada backup, jadi sekarang disimpan di lokasi yang sama dengan
REM utilitas terjadwal: %LOCALAPPDATA%\Morbis\backup.
if not exist "!BACKUP_DIR!" mkdir "!BACKUP_DIR!" >nul 2>&1
for %%P in (
    "Google\Chrome"
    "Microsoft\Edge"
    "BraveSoftware\Brave"
    "Vivaldi"
    "Opera Software\Opera"
    "Chromium"
) do (
    reg export "HKLM\SOFTWARE\Policies\%%~P" "!BACKUP_DIR!\policy-%%~nxP.reg" /y >nul 2>&1
    if exist "!BACKUP_DIR!\policy-%%~nxP.reg" (
        echo    backup policy %%~P -^> !BACKUP_DIR!\policy-%%~nxP.reg
    ) else (
        REM reg export gagal kalau key tidak ada - itu normal di PC
        REM yang belum pernah punya policy, bukan error.
        echo    - tidak ada policy %%~P untuk dibackup, dilewati
    )
)
REM Pembersihan lengkap ada di :CleanMorbis - WAJIB dipanggil untuk HKLM DAN
REM HKCU. Installer lama hanya menghapus subkey ExtensionSettings\<id>,
REM padahal entri JSON string-nya ditulis sebagai VALUE langsung di bawah
REM key ExtensionSettings. Akibatnya value itu selamat dari setiap
REM instalasi ulang dan Chrome membuang SELURUH objek ExtensionSettings
REM ("Error validasi skema: Unknown property: ...") - termasuk force_installed
REM untuk ID yang benar. Lihat :CleanMorbis.
call :CleanMorbis

echo [3/6] Menulis policy ke semua browser Chromium...
REM Rantai fallback: kalau satu cara gagal, coba cara berikutnya. Tiap cara
REM diverifikasi dengan reg query sehingga "sukses" berarti benar-benar ada.
set "GLOBAL_OK=1"
for %%P in (
    "Google\Chrome"
    "Microsoft\Edge"
    "BraveSoftware\Brave"
    "Vivaldi"
    "Opera Software\Opera"
    "Chromium"
) do (
    echo   - %%~P
    REM Cara 1: HKLM dengan view yang benar untuk OS ini.
    call :WritePolicy "HKLM\SOFTWARE\Policies\%%~P"
    if errorlevel 1 (
        REM Cara 2: HKLM tanpa switch view (kalau /reg:64 bermasalah).
        if not defined OS32 (
            call :WritePolicy "HKLM\SOFTWARE\Policies\%%~P" force32
        )
        if errorlevel 1 (
            REM Cara 3: HKCU - dipakai kalau HKLM dikunci (antivirus/EDR/GPO).
            echo       HKLM gagal, mencoba HKCU...
            call :WritePolicy "HKCU\SOFTWARE\Policies\%%~P"
            if errorlevel 1 (
                REM Cara 4: PowerShell - kalau reg.exe diblokir software keamanan.
                echo       HKCU gagal, mencoba PowerShell...
                call :WritePolicyPS "%%~P"
                if errorlevel 1 set "GLOBAL_OK=0"
            )
        )
    )
)

echo.
echo [DIAGNOSIS] Memeriksa hasil penulisan...
if not "!GLOBAL_OK!"=="1" (
    echo.
    echo ==========================================================
    echo  SEMUA CARA PENULISAN GAGAL - ini penyebabnya:
    echo ==========================================================
    echo Registry tidak menerima perubahan dari script ini, padahal
    echo sudah dicoba: HKLM view 64-bit, HKLM view 32-bit, HKCU,
    echo dan PowerShell. Biasanya salah satu dari:
    echo.
    echo 1^) Tidak berjalan sebagai Administrator ^(ulangi: klik kanan
    echo    -^> "Run as administrator"^).
    echo 2^) Antivirus/EDR memblokir perubahan registry.
    echo 3^) PC-nya terkunci kebijakan sehingga registry tidak boleh diubah.
    echo.
    echo 4^) Lihat pesan error asli dari Windows di bawah ini:
    echo.
    reg add "HKLM\SOFTWARE\Policies\Google\Chrome\ExtensionInstallForcelist" /v "1" /t REG_SZ /d "!EXT_ID!;!UPDATE_URL!" /f %RV%
    echo.
    echo Screenshot pesan di atas kirim ke admin.
    echo.
    pause
    goto :FINISH_FAIL
)
echo   [OK] Policy tercatat di: !WRITTEN_ROOT!
echo.
echo [4/7] Verifikasi lengkap (registry + update.xml + versi terpasang)...
call :VerifyPolicy

echo.
echo [5/7] Menutup ulang browser (kalau ada yang auto-restart)....
call :KillBrowsers

echo.
echo [6/7] Mengecek apakah PC ini "terkelola perusahaan"...
REM INI GERBANG PALING PENTING. Policy sudah ditulis rapi, tapi Chrome
REM hanya mau memasang ekstensi dari luar Web Store bila PC-nya terdaftar
REM managed (AD domain / Entra ID / Chrome Enterprise Core). Tanpa itu
REM policy diabaikan diam-diam - dan installer lama justru mencetak
REM "INSTALASI SELESAI", membuat PC dianggap beres padahal tidak ada yang
REM terpasang. Cek dilakukan SEBELUM mengklaim sukses.
call :DetectManaged
if "!MANAGED!"=="1" goto :FINISH_OK

echo.
echo [7/7] GAGAL - ekstensi TIDAK akan terpasang di PC ini.
echo.
echo ==========================================================
echo  PENYEBAB: PC ini tidak terdaftar "managed" oleh browser
echo ==========================================================
echo Policy sudah ditulis dengan benar, tetapi Chrome/Edge/Brave MENOLAK
echo memasang ekstensi dari luar Web Store. Aturan resminya:
echo.
echo   "On Microsoft Windows, apps and extensions from outside the
echo    Chrome Web Store can only be force installed if the instance
echo    is joined to an Active Directory domain, joined to Azure AD
echo    or enrolled in Chrome Enterprise Core."
echo.
echo Gejalanya di browser - buka chrome://policy, perhatikan:
echo   - ExtensionInstallForcelist -^> "ID ekstensi tidak valid"
echo   - Warning: "Komputer ini tidak terdeteksi sebagai dikelola
echo     perusahaan sehingga kebijakan hanya dapat secara otomatis
echo     menginstal ekstensi yang dihosting di Web Store"
echo   - Brave/Chrome menandai entri "[BLOCKED]" di halaman policy.
echo     Itu CAP browser ("entri ini saya abaikan"), BUKAN isi registry
echo     - registry-nya sendiri sudah benar, jangan "diperbaiki" lagi.
echo.
echo Tidak ada perbaikan registry/JSON yang bisa melewati aturan ini.
echo Pilih salah satu dari empat jalan berikut:
echo.
echo   [A] EDGE ADD-ONS  (sudah aktif di repo ini)
echo       Untuk PC yang memakai Microsoft Edge. Ekstensi sudah terbit
echo       di Edge Add-ons - buka link Store, klik "Get". Setelah itu
echo       policy di atas otomatis mengambil update dari Store, bukan
echo       dari GitHub Pages. Lihat deploy/policy/EDGE-STORE.md
echo
echo   [B] TERBITKAN KE CHROME WEB STORE (unlisted)
echo       Jalur resmi untuk Chrome di PC unmanaged. Setelah terbit,
echo       policy di atas bekerja tanpa domain/Entra karena URL-nya
echo       sudah menunjuk Web Store:
echo         https://clients2.google.com/service/update2/crx
echo
echo   [C] PASANG MANUAL (Jalur A - tanpa policy sama sekali)
echo       Untuk PC yang tidak punya hak admin dan tidak didaftarkan.
echo       Tidak perlu domain, tidak perlu Store. Kekurangan: ekstensi
echo       dimuat "unpacked", jadi perlu klik REFRESH saat mau update.
echo       Jalankan mode [3] Manual di file ini, lalu mode [5] Jadwalkan
echo       supaya update harian terpenuhi otomatis.
echo
echo   [D] DAFTARKAN PC (Chrome Enterprise Core, gratis tanpa domain)
echo       Sekali enrolling, policy di atas langsung bekerja penuh.
echo
echo Detail tiap langkah: deploy/policy/MIGRASI-GPO.md
echo.
echo Policy TETAP ditulis rapi, jadi begitu PC terdaftar managed,
echo jalankan skrip ini lagi - tidak perlu langkah lain.
echo.
call :Hold
exit /B 2

:FINISH_OK
echo.
echo [7/7] Selesai.
echo.
echo ===================================================
echo  INSTALASI SELESAI
echo ===================================================
echo PC ini terdaftar managed, jadi policy di atas akan dipasang
echo browser. Buka lagi browser Anda, tunggu 1-2 menit.
echo.
echo ===== VERIFIKASI WAJIB (1 menit) =====
echo 1. chrome://policy  (atau edge://policy / brave://policy)
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
call :Log "INSTALL selesai - policy ditulis, PC managed"
call :Hold
exit /B 0

:FINISH_FAIL
echo.
echo ===================================================
echo  INSTALL BELUM BERHASIL - policy tidak tertulis
echo ===================================================
echo Perbaiki dulu penyebab di atas, lalu jalankan skrip ini lagi.
echo Butuh bantuan? Screenshot jendela ini kirim ke admin.
echo.
call :Log "INSTALL GAGAL - policy tidak tertulis"
call :Hold
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
call :Hold
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
call :CleanMorbis
echo   [OK] Policy MORBIS dibersihkan (HKLM + HKCU, semua browser).

echo.
echo Menutup semua browser Chromium...
call :KillBrowsers

echo.
echo Membersihkan jalur cadangan A (tugas terjadwal + clone lokal)...
REM Idempoten: hapus kalau ada, biarkan kalau tidak ada.
"%SystemRoot%\System32\schtasks.exe" /Delete /TN "Morbis Ext Update" /F >nul 2>&1
if exist "%USERPROFILE%\morbis-ext" rmdir /s /q "%USERPROFILE%\morbis-ext" >nul 2>&1

echo.
echo ===================================================
echo  POLICY MORBIS SUDAH DIHAPUS.
echo ===================================================
echo - Policy MORBIS dihapus dari HKLM dan HKCU, semua browser.
echo - Termasuk sisa installer lama: ExtensionSettings\<id> dalam
echo   bentuk SUBKEY maupun bentuk VALUE (JSON string yang membuat
echo   Chrome membuang seluruh objek ExtensionSettings), serta
echo   entri Forcelist/Allowlist milik MORBIS.
echo - Policy milik IT lain TIDAK disentuh - hanya nilai yang isinya
echo   menyebut ID MORBIS yang dihapus dari Forcelist/Allowlist.
echo - Tugas terjadwal "Morbis Ext Update" dihapus (jika ada).
echo - Folder %USERPROFILE%\morbis-ext dihapus (jika ada).
echo.
echo Yang SENGAJA TIDAK dihapus:
echo - Backup policy: !BACKUP_DIR!
echo     Backup ini satu-satunya cara mengembalikan policy kalau
echo     ternyata penghapusan ini ikut mengenai nilai milik IT.
echo     Hapus manual setelah Anda yakin tidak diperlukan lagi.
echo - Log: !LOGFILE!
echo.
echo CATATAN: kartu MORBIS di chrome://extensions TIDAK hilang dengan
echo sendiri (Chrome menahannya selama policy aktif). Setelah policy
echo dihapus, buka browser lalu hapus kartunya manual, atau gunakan
echo "chrome://extensions" - tombol Hapus.
echo.
call :Log "UNINSTALL selesai - policy MORBIS dihapus, backup dipertahankan"
call :Hold
exit /B 0

REM ============================================================
REM  SUBROUTINE: InitRegistryView
REM  Menentukan OS32 dan RV (switch view registry) SEKALI di :MAIN,
REM  dipakai bersama oleh install/verify/uninstall.
REM
REM  Semua policy ditulis dengan /reg:64 (view 64-bit). Di OS 32-bit
REM  switch itu tidak berlaku - semua reg add akan gagal diam-diam,
REM  jadi di sini instalasi TIDAK dibatalkan, hanya menentukan view
REM  mana yang benar.
REM
REM  Penting: subroutine ini harus dipanggil dari :MAIN, bukan dari
REM  dalam jalur :INSTALL saja. Kalau RV kosong di jalur uninstall,
REM  "reg delete" tanpa /reg:64 pada cmd 32-bit di OS 64-bit menulis
REM  ke Wow6432Node dan policy di native view UTUH - POLICY GAGAL
REM  DIHAPUS DAMPING-DAMPING.
REM ============================================================
:InitRegistryView
set "OS32="
if /i "%PROCESSOR_ARCHITEW6432%"=="" if /i "%PROCESSOR_ARCHITECTURE%"=="x86" set "OS32=1"

set "RV=/reg:64"
if defined OS32 set "RV="
if /i "%PROCESSOR_ARCHITECTURE%"=="x86" if not defined PROCESSOR_ARCHITEW6432 set "RV=/reg:64"
exit /B 0

REM ============================================================
REM  SUBROUTINE: DetectManaged
REM  Mengecek apakah PC ini terdaftar "managed" sehingga browser
REM  BOLEH memasang ekstensi dari luar Web Store.
REM
REM  Aturan resmi Chrome (ExtensionInstallForcelist / ExtensionSettings):
REM  di Windows, ekstensi non-Web-Store hanya boleh force-installed bila
REM  instance joined ke Active Directory domain, joined ke Azure AD
REM  (Entra), atau enrolled in Chrome Enterprise Core.
REM
REM  Teknik yang dipakai (semuanya read-only, tanpa hak lebih):
REM    1. dsregcmd /status        -> AADJoined / WorkplaceJoined
REM    2. Chrome Enterprise Core  -> enrollment token di policy root
REM    3. AD domain join         -> kredensial NetSetupJoin / Domain
REM  Kalau tidak ada yang cocok, MANAGED=0 dan installer MUSTAHIL
REM  memasang extension. Set MANAGED=1 hanya kalau ada bukti nyata -
REM ebak-abakan di sini membuat installer berbohong lagi.
REM ============================================================
:DetectManaged
set "MANAGED=0"
set "MGR_REASON=PC tidak terdaftar managed (bukan domain, bukan Entra,"
set "MGR_REASON2=belum enrolled Chrome Enterprise Core)"

REM 1) Entra ID / Azure AD join.
REM    PENTING: dsregcmd /status mencetak "AzureAdJoined : NO", jadi yang
REM    ditoken adalah NAMA FIELD (%%A) dan NILAINYA (%%B). Versi lama
REM    hanya mengambil %%A yang berisi YES/NO, lalu membandingkannya
REM    dengan nama field - tidak akan pernah cocok, dan "findstr Joined"
REM    juga tidak akan cocok karena isinya cuma YES/NO. Akibatnya deteksi
REM    join sama sekali tidak pernah menyalakan MANAGED.
for /f "tokens=1,2 delims=:" %%A in ('dsregcmd /status 2^>nul ^| findstr /I "AzureAdJoined EnterpriseJoined DomainJoined WorkplaceJoined"') do (
    set "DFIELD=%%A"
    set "DFIELD=!DFIELD: =!"
    set "DVAL=%%B"
    set "DVAL=!DVAL: =!"
    if /I "!DVAL!"=="YES" (
        set "MANAGED=1"
        if /I "!DFIELD!"=="AzureAdJoined"    set "MGR_REASON=Terdaftar Entra ID (Azure AD join)"
        if /I "!DFIELD!"=="EnterpriseJoined" set "MGR_REASON=Terdaftar Entra ID (enterprise join)"
        if /I "!DFIELD!"=="WorkplaceJoined"  set "MGR_REASON=Terdaftar Entra ID (workplace join)"
        if /I "!DFIELD!"=="DomainJoined"     set "MGR_REASON=Terdaftar Active Directory (domain join)"
    )
)

REM 2) Chrome Enterprise Core. Token enrollment disimpan di policy root
REM    tiap browser; kalau ada, Chrome menganggap PC terkelola.
if "!MANAGED!"=="0" (
    for %%P in ("Google\Chrome" "Microsoft\Edge" "BraveSoftware\Brave") do (
        for %%R in ("HKLM" "HKCU") do (
            reg query "%%~R:\SOFTWARE\Policies\%%~P" /v "CloudManagementEnrollmentToken" %RV% >nul 2>&1 && set "MANAGED=1"
            reg query "%%~R:\SOFTWARE\Policies\%%~P" /v "EnrollmentToken" %RV% >nul 2>&1 && set "MANAGED=1"
        )
    )
    if "!MANAGED!"=="1" set "MGR_REASON=Enrolled Chrome Enterprise Core"
)

REM 3) AD domain join (cadangan bila dsregcmd tak tersedia).
REM    Dua lokasi Dicek: ActiveComputerName\DomainName dan
REM    Tcpip\Parameters\Domain. Lokasi pertama wajib ikut diperiksa -
REM    di sebagian Windows Tcpip\Parameters tidak punya nilai Domain.
if "!MANAGED!"=="0" (
    for /f "tokens=3" %%D in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\ComputerName\ActiveComputerName" /v "DomainName" %RV% 2^>nul ^| findstr /I "DomainName"') do (
        if not "%%D"=="" if /I not "%%D"=="WORKGROUP" set "MANAGED=1"
    )
    if "!MANAGED!"=="0" (
        for /f "tokens=3" %%D in ('reg query "HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" /v "Domain" %RV% 2^>nul ^| findstr /I "Domain"') do (
            if not "%%D"=="" if /I not "%%D"=="WORKGROUP" set "MANAGED=1"
        )
    )
    if "!MANAGED!"=="1" set "MGR_REASON=Terdaftar Active Directory (domain join)"
)
exit /B 0

REM ============================================================
REM  SUBROUTINE: CleanMorbis
REM  Menghapus SELURUH policy MORBIS dari semua browser Chromium,
REM  di HKLM dan HKCU, tanpa menyentuh policy milik IT lain.
REM
REM  Dua layout yang HARUS dua-duanya dihapus:
REM    1. SUBKEY  ExtensionSettings\<id>        (layout installer sekarang)
REM    2. VALUE   ExtensionSettings  /v <id>    (layout installer LAMA -
REM       JSON-nya ditulis sebagai string ter-escape di bawah key
REM       ExtensionSettings, bukan sebagai object)
REM  Installer lama hanya menghapus bentuk (1). Bentuk (2) tidak bisa
REM  terhapus oleh "reg delete <path>\<id> /f" (tanpa /v) sehingga
REM  bertahan selamanya. Chrome membacanya sebagai property asing dan
REM  SEHINGGA membuang seluruh objek ExtensionSettings - termasuk
REM  force_installed untuk ID yang benar. Gejala di chrome://policy:
REM  "Error validasi skema: Unknown property: <id>".
REM
REM  Forcelist/Allowlist: nilai dihapus satu per satu HANYA bila isinya
REM  menyebut ID MORBIS, supaya entri milik IT tetap utuh.
REM ============================================================
:CleanMorbis
for %%P in (
    "Google\Chrome"
    "Microsoft\Edge"
    "BraveSoftware\Brave"
    "Vivaldi"
    "Opera Software\Opera"
    "Chromium"
) do (
    for %%R in ("HKLM" "HKCU") do call :CleanRoot "%%~R\SOFTWARE\Policies\%%~P"
)
REM Installer versi sangat lama membuat subkey AutoplayAllowed (policy ini
REM sebenarnya VALUE di root key). Hapus kedua bentuknya.
for %%P in (
    "Google\Chrome"
    "Microsoft\Edge"
    "BraveSoftware\Brave"
    "Vivaldi"
    "Opera Software\Opera"
    "Chromium"
) do (
    for %%R in ("HKLM" "HKCU") do (
        reg delete "%%~R\SOFTWARE\Policies\%%~P\AutoplayAllowed" /f %RV% >nul 2>&1
    )
)
exit /B 0

REM ============================================================
REM  SUBROUTINE: CleanRoot <root>
REM  Membersihkan policy MORBIS di satu root (HKLM/HKCU) satu browser.
REM ============================================================
:CleanRoot
set "CR=%~1"
for %%I in (
    beljnjfifmncnfnhdkcmjpeonoigdnbl
    cbkjilfkdgclmpilonabdnicngjjgegd
    xae4a2ltyv2bj7lqyzxi2xeynpiefblg
) do (
    REM Bentuk 1: subkey ExtensionSettings\<id>.
    reg delete "!CR!\ExtensionSettings\%%~I" /f %RV% >nul 2>&1
    REM Bentuk 2: VALUE ExtensionSettings /v <id>  <- akar bug ini.
    reg delete "!CR!\ExtensionSettings" /v "%%~I" /f %RV% >nul 2>&1
)
REM Forcelist: hapus hanya entri milik MORBIS (bukan seluruh key).
call :PurgeListValues "!CR!\ExtensionInstallForcelist" beljnjfifmncnfnhdkcmjpeonoigdnbl cbkjilfkdgclmpilonabdnicngjjgegd xae4a2ltyv2bj7lqyzxi2xeynpiefblg
REM Allowlist: installer lama pernah menaruhnya, dan nilainya tidak
REM sesuai format ("Nilai tidak sesuai format" di chrome://policy).
REM Sebenarnya redundan - ExtensionSettings sudah menimpanya - tapi
REM dibersihkan agar tidak terus error.
call :PurgeListValues "!CR!\ExtensionInstallAllowlist" beljnjfifmncnfnhdkcmjpeonoigdnbl cbkjilfkdgclmpilonabdnicngjjgegd xae4a2ltyv2bj7lqyzxi2xeynpiefblg
exit /B 0

REM ============================================================
REM  SUBROUTINE: PurgeListValues <key> <id1> [id2] [id3] ...
REM  Menghapus nilai Registry di <key> yang isinya menyebut salah satu
REM  ID yang diberikan. Nilai milik pihak lain TIDAK disentuh, jadi key
REM  ExtensionInstallForcelist milik IT tetap utuh.
REM  Nilai policy berbentuk "1", "2", ... jadi MAX 64 cukup.
REM ============================================================
:PurgeListValues
set "PLKEY=%~1"
shift
set "PLIDS=%1 %2 %3"
REM  Baris "reg query" berbentuk: <spasi> NAMA <spasi> TIPE <spasi> DATA.
REM  "for /f" membuang spasi depan, jadi token 1 = NAMA value, token 2
REM  = TIPE. Dulu nomor tokennya salah satu angka (dikira token 1 kosong),
REM  sehingga %%A berisi "REG_SZ" dan semua "reg delete /v REG_SZ" gagal
REM  diam-diam. Akibatnya nilai Forcelist/Allowlist milik MORBIS TIDAK
REM  PERNAH terhapus - racun bertahan selamanya di setiap PC.
if defined PLIDS (
    for /f "tokens=1,*" %%A in ('reg query "!PLKEY!" %RV% 2^>nul ^| findstr /R /C:"    [0-9]"') do (
        set "PLVAL=%%B"
        for %%I in (!PLIDS!) do (
            echo !PLVAL! | findstr /C:"%%~I" >nul && reg delete "!PLKEY!" /v "%%A" /f %RV% >nul 2>&1
        )
    )
)
set "PLKEY="
set "PLIDS="
exit /B 0

REM  Memeriksa policy pada root yang sedang diset di !PB!. Set BSTAT
REM  =OK/FAIL dan BDETAIL berisi daftar yang hilang.
REM ============================================================
:ProbeBrowser
set "BSTAT=OK"
set "BDETAIL="
reg query "!PB!\ExtensionInstallForcelist" /v "1" !RV! 2>nul | findstr /C:"!EXT_ID!" >nul
if errorlevel 1 (
    set "BSTAT=FAIL"
    set "BDETAIL=!BDETAIL! Forcelist "
)
reg query "!PB!\ExtensionSettings\!EXT_ID!" /v "installation_mode" !RV! 2>nul | findstr /C:"force_installed" >nul
if errorlevel 1 (
    set "BSTAT=FAIL"
    set "BDETAIL=!BDETAIL! installation_mode "
)
reg query "!PB!\ExtensionSettings\!EXT_ID!" /v "update_url" !RV! 2>nul | findstr /C:"adptra01.github.io" >nul
if errorlevel 1 (
    set "BSTAT=FAIL"
    set "BDETAIL=!BDETAIL! update_url "
)
reg query "!PB!\ExtensionSettings\!EXT_ID!" /v "override_update_url" !RV! 2>nul | findstr /C:"0x1" >nul
if errorlevel 1 (
    set "BSTAT=FAIL"
    set "BDETAIL=!BDETAIL! override_update_url "
)
REM Count host yang tertulis (nilai 1-4). Query /s lalu cocokkan host,
REM bukan nama value, supaya aman terhadap urutan penulisan.
set "HCNT=0"
for %%H in (103.147.236.140 103.147.236.138 192.168.8.4 dev.rsudkotajambi.id) do (
    reg query "!PB!\ExtensionSettings\!EXT_ID!\runtime_allowed_hosts" /s !RV! 2>nul | findstr /C:"%%~H" >nul
    if not errorlevel 1 set /a "HCNT+=1"
)
if !HCNT! LSS 4 (
    set "BSTAT=FAIL"
    set "BDETAIL=!BDETAIL! runtime_allowed_hosts=!HCNT!/4 "
)
REM Regresi: pola tanpa scheme/host - "/*" polos atau "1.2.3.4/*" - ditolak
REM Chrome dan membuat SELURUH ExtensionSettings tidak terbaca.
REM CARA PENTING: tidak boleh sekadar findstr /C:"/*", karena entri YANG
REM BENAR juga berakhiran "/*" - misalnya https://adptra01.github.io/*.
REM Kalau begitu setiap entri sah akan dilaporkan sebagai pola buruk.
REM Karena itu disaring dua tahap: baris yang punya "/*" LALU dibuang
REM lagi bila mengandung "://" (berarti punya scheme + host).
set "BADPAT="
for /f "usebackq delims=" %%L in (`reg query "!PB!\ExtensionSettings\!EXT_ID!\runtime_allowed_hosts" /s !RV! 2^>nul ^| findstr /C:"/*" ^| findstr /V /C:"://"`) do set "BADPAT=1"
if defined BADPAT (
    set "BSTAT=FAIL"
    set "BDETAIL=!BDETAIL! POLA-PATH-tanpa-scheme "
)
REM --- RACUN: ExtensionSettings\<id> sebagai VALUE, bukan SUBKEY -----------
REM Ini kondisi nyata di lapangan dan TIDAK terdeteksi oleh lima pemeriksaan
REM di atas, karena semuanya hanya membaca subkey milik ID yang benar. Akibatnya
REM verifikasi melaporkan [OK] padahal Chrome membuang SELURUH objek
REM ExtensionSettings. Gejalanya di chrome://policy:
REM   "Error validasi skema: Unknown property: <id>"
REM dan ekstensi tetap [BLOCKED] walau registry "terlihat benar".
set "POISON="
for %%I in (!EXT_ID! cbkjilfkdgclmpilonabdnicngjjgegd xae4a2ltyv2bj7lqyzxi2xeynpiefblg) do (
    reg query "!PB!\ExtensionSettings" /v "%%~I" !RV! >nul 2>&1 && set "POISON=1"
)
if defined POISON (
    set "BSTAT=FAIL"
    set "BDETAIL=!BDETAIL! RACUN-ExtensionSettings-bertipe-value "
)
REM Allowlist: sisa installer lama. Formatnya salah, Chrome melaporkannya
REM sebagai "Nilai tidak sesuai format" dan policy itu tidak berguna.
set "ALLOWBAD="
for /f "usebackq tokens=2,*" %%A in (`reg query "!PB!\ExtensionInstallAllowlist" !RV! 2^>nul ^| findstr /R /C:"^[0-9]"`) do (
    echo %%~B | findstr /I "!EXT_ID! cbkjilfkdgclmpilonabdnicngjjgegd xae4a2ltyv2bj7lqyzxi2xeynpiefblg" >nul && set "ALLOWBAD=1"
)
if defined ALLOWBAD (
    set "BSTAT=FAIL"
    set "BDETAIL=!BDETAIL! ALLOWLIST-format-salah "
)
exit /B

REM ============================================================
REM  SUBROUTINE: WritePolicy <root> [force32]
REM  Menulis seluruh policy MORBIS ke satu root, lalu MEMERIKSA hasilnya
REM  dengan reg query. Exit 0 = benar-benar tertulis, 1 = gagal.
REM  force32 = paksa view 32-bit (dipakai bila /reg:64 bermasalah).
REM ============================================================
:WritePolicy
set "WV=!RV!"
if /i "%~2"=="force32" set "WV="
set "B=%~1"
REM Forcelist: auto-install + auto-update dari update.xml.
reg add "!B!\ExtensionInstallForcelist" /v "1" /t REG_SZ /d "!EXT_ID!;!UPDATE_URL!" /f !WV! >nul 2>&1
REM ExtensionSettings: kunci update_url agar tidak balik ke Store.
reg add "!B!\ExtensionSettings\!EXT_ID!" /v "installation_mode" /t REG_SZ /d "force_installed" /f !WV! >nul 2>&1
reg add "!B!\ExtensionSettings\!EXT_ID!" /v "update_url" /t REG_SZ /d "!UPDATE_URL!" /f !WV! >nul 2>&1
reg add "!B!\ExtensionSettings\!EXT_ID!" /v "override_update_url" /t REG_DWORD /d "1" /f !WV! >nul 2>&1
REM Host restriction (least-privilege): runtime_allowed_hosts membatasi
REM SITE tempat extension boleh berjalan/menyuntik content script - hanya
REM host SIMRS produksi. List = array string (value "1","2",...).
REM PENTING: Chrome MEMBUKA entri policy ExtensionSettings bila satu nilai
REM tidak valid. Pola runtime_allowed_hosts WAJIB scheme://host TANPA path
REM (tanpa "/*") - kalau ada path, seluruh ExtensionSettings (termasuk
REM force_installed) ditolak. Diverifikasi di chrome://policy (Linux).
REM Catatan: ini pelengkap host_permissions; fetch jaringan tetap diatur
REM manifest (Phase D menghapus host dev dari build produksi).
reg add "!B!\ExtensionSettings\!EXT_ID!\runtime_allowed_hosts" /v "1" /t REG_SZ /d "http://103.147.236.140" /f !WV! >nul 2>&1
reg add "!B!\ExtensionSettings\!EXT_ID!\runtime_allowed_hosts" /v "2" /t REG_SZ /d "http://103.147.236.138" /f !WV! >nul 2>&1
reg add "!B!\ExtensionSettings\!EXT_ID!\runtime_allowed_hosts" /v "3" /t REG_SZ /d "http://192.168.8.4" /f !WV! >nul 2>&1
reg add "!B!\ExtensionSettings\!EXT_ID!\runtime_allowed_hosts" /v "4" /t REG_SZ /d "http://dev.rsudkotajambi.id" /f !WV! >nul 2>&1
REM AutoplayAllowed SENGAJA TIDAK DITULIS. Installer lama menulisnya dengan
REM asumsi "izin TTS tanpa klik", padahal itu policy autoplay Flash era lama -
REM tidak ada hubungannya dengan Manifest V3, dan gelombangnya membingungkan
REM karena :CleanMorbis justru MENGHAPUSnya. Installer sekarang hanya
REM membersihkan sisa itu, tidak pernah membuatnya lagi.
REM Verifikasi nyata: nilainya benar-benar ada di registry?
reg query "!B!\ExtensionInstallForcelist" /v "1" !WV! 2>nul | findstr /C:"!EXT_ID!" >nul
if errorlevel 1 exit /B 1
reg query "!B!\ExtensionSettings\!EXT_ID!" /v "installation_mode" !WV! 2>nul | findstr /C:"force_installed" >nul
if errorlevel 1 exit /B 1
set "WRITTEN_ROOT=!B!"
exit /B 0

REM ============================================================
REM  SUBROUTINE: WritePolicyPS <browser-base>
REM  Cara terakhir: reg.exe diblokir software keamanan tapi PowerShell
REM  boleh. Menulis ke HKLM (64-bit view) dan memverifikasi hasilnya.
REM ============================================================
:WritePolicyPS
set "PSOK="
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ErrorActionPreference='Stop'; $b='HKLM:\SOFTWARE\Policies\%~1'; $id='!EXT_ID!'; $u='!UPDATE_URL!'; New-Item -Path ($b+'\ExtensionInstallForcelist') -Force ^| Out-Null; New-ItemProperty -Path ($b+'\ExtensionInstallForcelist') -Name '1' -Value ($id+';'+$u) -PropertyType String -Force ^| Out-Null; $es=$b+'\ExtensionSettings\'+$id; New-Item -Path $es -Force ^| Out-Null; New-ItemProperty -Path $es -Name 'installation_mode' -Value 'force_installed' -PropertyType String -Force ^| Out-Null; New-ItemProperty -Path $es -Name 'update_url' -Value $u -PropertyType String -Force ^| Out-Null; New-ItemProperty -Path $es -Name 'override_update_url' -Value 1 -PropertyType DWord -Force ^| Out-Null; $rh=$es+'\runtime_allowed_hosts'; New-Item -Path $rh -Force ^| Out-Null; New-ItemProperty -Path $rh -Name '1' -Value 'http://103.147.236.140' -PropertyType String -Force ^| Out-Null; New-ItemProperty -Path $rh -Name '2' -Value 'http://103.147.236.138' -PropertyType String -Force ^| Out-Null; New-ItemProperty -Path $rh -Name '3' -Value 'http://192.168.8.4' -PropertyType String -Force ^| Out-Null; New-ItemProperty -Path $rh -Name '4' -Value 'http://dev.rsudkotajambi.id' -PropertyType String -Force ^| Out-Null" >nul 2>&1
if errorlevel 1 exit /B 1
REM  Pakai %RV%, bukan /reg:64 hardcode: di OS 32-bit switch itu tidak
REM  berlaku dan query verifikasi ini akan selalu gagal.
reg query "HKLM\SOFTWARE\Policies\%~1\ExtensionInstallForcelist" /v "1" %RV% 2>nul | findstr /C:"!EXT_ID!" >nul
if errorlevel 1 exit /B 1
set "WRITTEN_ROOT=HKLM\SOFTWARE\Policies\%~1 (PowerShell)"
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
REM  SUBROUTINE: log_ke_file
REM
REM  Awalnya semua output hanya ke console. Untuk mode "pull" yang
REM  jalan sendiri jam 05:00 lewat schtasks, tidak ada yang melihat
REM  console-nya sama sekali - kalau gagal, tidak ada bukti apa pun
REM  yang bisa dikirim ke admin.
REM
REM  Dua koreksi penting terhadap implementasi naif "%DATE% %TIME%":
REM   1. %DATE%/%TIME% itu locale-dependent. Di PC en-US hasilnya
REM      "Mon 09/28/2026 9:05:03 PM" - tidak rapi tapi yang lebih
REM      penting: pada locale 24 jam jadi "24:05" saat tengah
REM      malam, dan angka bisa mengandung separator lain. Log tidak
REM      boleh jadi sumber kebocoran "%" yang merusak penulisan file.
REM      Karena itu timestamp diambil lewat PowerShell yang sama
REM      dengan yang dipakai TS, hasilnya selalu "yyyy-MM-dd HH:mm:ss".
REM   2. "echo ... %~1>> file" itu parsing redirect yang rapuh: kalau
REM      pesan mengandung karakter yang dibaca cmd sebagai operator
REM      ("&", "<", ">", "|"), baris bisa salah parse dan log rusak.
REM      "%~1" di-quote per-token di bawah, dan setelan echo dilakukan
REM      lewat variabel, bukan argumen mentah.
REM
REM  Log hanya ditulis untuk mode yang mungkin jalan tanpa manusia
REM  (pull) dan untuk hasil akhir mode lain. Menu interaktif sengaja
REM  tidak di-log per baris supaya file tidak membanjir.
REM ============================================================
:Log
if not defined LOGFILE exit /B 0
set "LOGMSG=%~1"
if not defined LOGMSG exit /B 0
if not defined LOGTS call :LogStamp
>>"%LOGFILE%" echo [%LOGTS%] %LOGMSG%
exit /B 0

REM Ambil timestamp sekali per proses, format ISO (tidak ambigu).
:LogStamp
set "LOGTS=%DATE% %TIME%"
for /f "usebackq delims=" %%T in (`powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd HH:mm:ss'" 2^>nul`) do set "LOGTS=%%T"
if not defined LOGTS set "LOGTS=unknown-time"
exit /B 0

REM ============================================================
REM  SUBROUTINE: pulihkan_policy
REM  Memutar balik file .reg hasil "reg export" saat mode install.
REM  Dipakai kalau.policy MORBISmenyebabkan masalah pada browser
REM  dan admin perlu mengembalikan kondisi sebelum installer ini
REM  berjalan. Hanya mem-backup policy browser; tidak menyentuh
REM  clone repo, tugas terjadwal, atau file lain.
REM ============================================================
:RestorePolicy
cls
echo ===================================================
echo     PULIHKAN POLICY DARI BACKUP
echo     RSUD H. ABDUL MANAP
echo ===================================================
echo.
echo Folder backup:
echo   !BACKUP_DIR!
echo.
if not exist "!BACKUP_DIR!" (
    echo [GAGAL] Folder backup tidak ada: !BACKUP_DIR!
    echo        Belum pernah menjalankan mode [1], atau backup sudah dihapus.
    call :Hold
    exit /B 1
)
call :RequireAdmin
echo File backup yang tersedia:
echo.
set "RP_COUNT=0"
for %%F in ("!BACKUP_DIR!\*.reg") do (
    if exist %%F (
        set /a RP_COUNT+=1
        echo   %%~nxF
    )
)
if !RP_COUNT!==0 (
    echo   - tidak ada file .reg
    echo.
    echo [GAGAL] Tidak ada backup untuk dipulihkan.
    call :Hold
    exit /B 1
)
echo.
echo  PERINGATAN: restore akan menulis ulang seluruh isi key policy
echo  browser - termasuk nilai milik IT lain di dalam key itu.
echo  Sebaiknya backup ini dipakai kalau install memang penyebab
echo  masalah, dan GPO asli tetap jadi sumber kebenaran.
echo.
set /p "RP_OK=Lanjut restore semua file? (y/N): "
if /i not "!RP_OK!"=="y" (
    echo Dibatalkan.
    call :Hold
    exit /B 0
)
for %%F in ("!BACKUP_DIR!\*.reg") do (
    if exist %%F (
        echo   restore %%~nxF ...
        reg import "%%F" %RV%
        if errorlevel 1 (
            echo   [GAGAL] restore %%~nxF gagal
        ) else (
            echo   [OK] %%~nxF dipulihkan
        )
    )
)
call :Log "RESTORE policy selesai dari !BACKUP_DIR!"
echo.
echo ===== SELESAI =====
echo Jalankan mode [2] VERIFIKASI untuk memastikan policy kembali sesuai.
echo.
call :Hold
exit /B 0

REM ============================================================
REM  SUBROUTINE: tutup semua proses browser Chromium
REM
REM  Dulu semua proses langsung "taskkill /F" tanpa pilihan lain.
REM  Akibatnya user kehilangan tab yang belum disimpan - browser
REM  dibunuh, bukan ditutup.
REM
REM  Urutannya sekarang dua tahap:
REM    Tahap 1 - taskkill TANPA /F = minta tutup normal. Browser
REM             punya kesempatan menyimpan tab dan session sendiri.
REM    Tahap 2 - baru /F, dan HANYA ke proses yang masih hidup.
REM
REM  Catatan: "timeout" TIDAK dipakai untuk jeda. timeout butuh
REM  konsol interaktif; kalau stdin di-redirect (schtasks, test,
REM  pipeline) dia gagal dengan "Input redirection is not
REM  supported" dan tidak pernah menjeda. "ping -n" ke 127.0.0.1
REM  adalah jeda yang andal di semua kondisi.
REM ============================================================
:KillBrowsers
set "KB_SOFT="
for %%B in (
    msedge.exe
    chrome.exe
    brave.exe
    vivaldi.exe
    opera.exe
    launcher.exe
    chromium.exe
) do (
    taskkill /IM %%B >nul 2>&1
    if not errorlevel 1 set "KB_SOFT=!KB_SOFT!%%B "
)
REM Beri browser kesempatan menutup diri dan menyimpan state.
"%SystemRoot%\System32\ping.exe" -n 4 127.0.0.1 >nul 2>&1

set "KB_HARD="
for %%B in (
    msedge.exe
    msedgewebview2.exe
    chrome.exe
    brave.exe
    vivaldi.exe
    opera.exe
    launcher.exe
    chromium.exe
) do (
    taskkill /IM %%B /F >nul 2>&1
    if not errorlevel 1 set "KB_HARD=!KB_HARD!%%B "
)
call :Log "KillBrowsers: soft-close=!KB_SOFT! force=!KB_HARD!"
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
    REM Policy bisa tertulis di HKLM (machine) atau HKCU (user) - cari di
    REM keduanya, sesuai cara installer menulisnya.
    REM CATATAN: hasil KEDUA hive harus ditampilkan. Dulu hanya probe
    REM terakhir yang dilaporkan, sehingga policy HKLM yang benar tidak
    REM terlihat karena racun di HKCU - padahal dua-duanya harus dibersihkan.
    set "PB=HKLM\SOFTWARE\Policies\%%~P"
    call :ProbeBrowser "%%~P"
    set "LM_STAT=!BSTAT!"
    set "LM_DETAIL=!BDETAIL!"
    REM PENTING: jangan `goto` ke label di luar loop. Batch membaca
    REM variabel loop sebagai satu persen begitu control flow keluar dari
    REM blok for, sehingga nama browser ikut tercetak mentah. Semua
    REM cabangnya wajib tetap di dalam blok.
    if not "!LM_STAT!"=="OK" (
        set "PB=HKCU\SOFTWARE\Policies\%%~P"
        call :ProbeBrowser "%%~P"
        if not "!BSTAT!"=="OK" (
            set "BDETAIL=HKLM ^(!LM_DETAIL!^) + HKCU ^(!BDETAIL!^)"
        )
    )
    if "!BSTAT!"=="OK" (
        set /a "V_OK+=1"
        echo    [OK]   %%~P !BDETAIL!
    ) else (
        set /a "V_FAIL+=1"
        echo    [FAIL] %%~P - !BDETAIL!
        REM Tampilkan isi registry sebenarnya (jangan tebak penyebabnya),
        REM dari kedua hive karena keduanya bisa jadi penyebab.
        echo           isi registry HKLM:
        reg query "HKLM\SOFTWARE\Policies\%%~P" /s !RV! 2>&1 | findstr /C:"ExtensionInstallForcelist" /C:"ExtensionSettings" /C:"!EXT_ID!" /C:"update_url" /C:"ERROR"
        echo           isi registry HKCU:
        reg query "HKCU\SOFTWARE\Policies\%%~P" /s 2>&1 | findstr /C:"ExtensionInstallForcelist" /C:"ExtensionSettings" /C:"!EXT_ID!" /C:"update_url" /C:"ERROR"
    )
)

REM --- Cek update.xml (butuh internet) -------------------------------------
REM update.xml di-generate CI dengan format tetap:
REM   <updatecheck codebase='<url>' version='<X.Y.Z>' />
REM Dibaca per-token; bila format berubah, cek ini degrade jadi WARN
REM (bukan error - hanya tidak bisa dibandingkan).
set "LIVE="
REM curl.exe native (Windows 10 17063+) paling deterministik dan tidak
REM bisa di-shadow. Tapi tidak ada di Windows Server lama, jadi tetap
REM ada fallback ke curl yang ada di PATH.
REM BUKAN sekadar gaya: "where curl" di PC ini saja sudah resolve ke
REM D:\laragon\bin\laragon\utils\curl.exe, bukan curl bawaan Windows.
REM -L dipakai karena GitHub Pages kadang balas redirect.
set "CURL="
if exist "%SystemRoot%\System32\curl.exe" set "CURL=%SystemRoot%\System32\curl.exe"
if not defined CURL set "CURL=curl"
%CURL% -sL --max-time 15 -o "%TEMP%\morbis-update-check.xml" "!UPDATE_URL!" 2>nul
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
) else (
    echo    [WARN] update.xml tidak terbaca - cek internet/proxy PC ini.
    echo           Update OTOMATIS tidak jalan tanpa akses URL di atas.
)

REM --- Regresi cleanup: JSON stringified yang tersisa di bawah key ---------
REM Installer lama menulis ExtensionSettings\<id> sebagai VALUE berisi
REM JSON ter-escape. Chrome membaca itu sebagai property asing dan
REM membuang SELURUH objek ExtensionSettings - termasuk force_installed
REM untuk ID yang benar - walau registry terlihat "benar". Jadi bentuk
REM ini diperiksa eksplisit, bukan sekadar_andalkan query installation_mode.
echo.
echo -- Cek sisa policy installer lama...
set "POISON_FOUND="
for %%P in ("Google\Chrome" "Microsoft\Edge" "BraveSoftware\Brave" "Vivaldi" "Opera Software\Opera" "Chromium") do (
    for %%R in ("HKLM" "HKCU") do (
        for %%I in (beljnjfifmncnfnhdkcmjpeonoigdnbl cbkjilfkdgclmpilonabdnicngjjgegd xae4a2ltyv2bj7lqyzxi2xeynpiefblg) do (
            reg query "%%~R:\SOFTWARE\Policies\%%~P\ExtensionSettings" /v "%%~I" !RV! >nul 2>&1
            if not errorlevel 1 set "POISON_FOUND=1"
        )
    )
)
if defined POISON_FOUND (
    echo    [FAIL] Masih ada ExtensionSettings\^<id^> berbentuk VALUE.
    echo           Chrome akan membuang SELURUH objek ExtensionSettings
    echo           - error validasi skema "Unknown property" - sehingga
    echo           force_installed ikut hilang meski registry terlihat benar.
    echo           Jalankan: Install_Morbis_Ext.bat install
) else (
    echo    [OK]   Tidak ada sisa value JSON installer lama.
)

REM --- Perbandingan versi nyata (dulu cuma dicetak, tidak dicek) ----------
REM Versi live < versi terpasang berarti device sudah lebih baru dari
REM update.xml. Ini kondisi nyata di produksi: update.xml produksi hanya
REM bergeser saat ada tag vX.Y.Z, jadi bisa tertinggal jauh dari branch
REM dev (live 1.5.93 sementara manifest sudah 1.5.108). Tampil sebagai
REM WARN, bukan FAIL - policy tetap sah, hanya tidak ada versi baru
REM untuk diunduh.
if defined LIVE (
    set "INSTALLED_VER="
    REM Versi terpasang dibaca dari file manifest lokal bila ada (Jalur A).
    REM Ekstensi yang dipasang lewat policy tidak menyimpan file ini, jadi
    REM nilai yang dipakai harus diawali angka, supaya baris "version"
    REM milik dependency yang muncul lebih dulu tidak ikut terpakai.
    if exist "%USERPROFILE%\morbis-ext\manifest.json" (
        for /f "tokens=2 delims=:, " %%M in ('findstr /R /C:"\"version\"" "%USERPROFILE%\morbis-ext\manifest.json"') do (
            if not defined INSTALLED_VER (
                echo %%~M | findstr /R "^[0-9]" >nul && set "INSTALLED_VER=%%~M"
            )
        )
    )
    if defined INSTALLED_VER (
        call :VerGe !INSTALLED_VER! !LIVE! VLT
        if "!VLT!"=="1" (
            echo.
            echo    [WARN] Versi terpasang ^(!INSTALLED_VER!^) !>= versi live
            echo           update.xml ^(!LIVE!^). Browser tidak men-downgrade.
            echo           Penyebab: update.xml produksi hanya bergeser saat
            echo           ada tag vX.Y.Z, jadi bisa tertinggal dari branch dev.
            echo           Perbaiki di sisi release: tag lalu push tag itu
            echo             git tag v!INSTALLED_VER! ^&^& git push origin v!INSTALLED_VER!
        ) else (
            echo    [OK]   update.xml !LIVE! ^>= versi terpasang !INSTALLED_VER!.
        )
    ) else (
        echo    [INFO] Versi terpasang tidak bisa dibaca dari sini
        echo           (extension-installed-by-policy tidak menyimpan file
        echo           lokal). Cek manual di browser - halaman ekstensi.
    )
)

echo.
echo -- Ringkasan: !V_OK! lolos, !V_FAIL! gagal.
if not "!V_FAIL!"=="0" (
    echo    [PERINGATAN] Ada policy gagal. Ekstensi TIDAK ter-install di browser itu.
    echo    Buka chrome://policy - kolom "Error" akan memberi petunjuk.
) else (
    echo    Semua policy valid. Tutup jendela CMD ini.
)
if defined POISON_FOUND exit /B 1
exit /B 0

REM ============================================================
REM  SUBROUTINE: VerGe <a> <b> <outvar>
REM  Set <outvar>=1 bila versi semver <a> >= <b>, selain itu 0.
REM  Komponen yang tidak ada diisi nol ("1.5" -> 1.5.0), jadi
REM  perbandingan tetap valid walau update.xml menulis 3 minus satu
REM  komponen.
REM ============================================================
:VerGe
REM Inisialisasi dulu: for /f hanya mengisi token yang ADA, jadi bila
REM "1.5" (2 komponen) %%C tak pernah dieksekusi dan nilai lama akan
REM bocor ke perbandingan.
set "VA_A=0"
set "VA_B=0"
set "VA_C=0"
set "VB_A=0"
set "VB_B=0"
set "VB_C=0"
for /f "tokens=1-3 delims=." %%A in ("%~1") do (
    if not "%%~A"=="" set "VA_A=%%~A"
    if not "%%~B"=="" set "VA_B=%%~B"
    if not "%%~C"=="" set "VA_C=%%~C"
)
for /f "tokens=1-3 delims=." %%A in ("%~2") do (
    if not "%%~A"=="" set "VB_A=%%~A"
    if not "%%~B"=="" set "VB_B=%%~B"
    if not "%%~C"=="" set "VB_C=%%~C"
)
if !VA_A! GTR !VB_A! (set "%~3=1" & goto :VerGe_end)
if !VA_A! LSS !VB_A! (set "%~3=0" & goto :VerGe_end)
if !VA_B! GTR !VB_B! (set "%~3=1" & goto :VerGe_end)
if !VA_B! LSS !VB_B! (set "%~3=0" & goto :VerGe_end)
if !VA_C! GEQ !VB_C! (set "%~3=1") else (set "%~3=0")
:VerGe_end
exit /B 0