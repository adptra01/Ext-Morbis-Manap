@echo off
REM ============================================================
REM  MORBIS Ext — UPDATE TERJADWAL (JALUR CADANGAN A)
REM  Membuat tugas Windows: jalankan morbis-update-main.bat tiap
REM  hari pukul 05:00 agar file ekstensi di PC selalu mengikuti
REM  branch main terbaru.
REM
REM  Dipakai bila auto-update CRX policy (Jalur B / Install_Morbis_Ext.bat)
REM  tidak bisa dipasang di sebuah PC.
REM
REM  Syarat:
REM   - Folder clone %USERPROFILE%\morbis-ext SUDAH ada (jalankan
REM     morbis-update-main.bat minimal sekali dulu).
REM   - Jalankan script ini SEKALI sebagai Administrator.
REM
REM  Catatan: metode ini MASIH butuh satu klik REFRESH di
REM  chrome://extensions setelah file tertarik (ekstensi unpacked
REM  tidak bisa di-reload otomatis oleh Chromium).
REM ============================================================

schtasks /Create /F /TN "Morbis Ext Update" /TR "\"%USERPROFILE%\morbis-ext\morbis-update-main.bat\"" /SC DAILY /ST 05:00

if %errorLevel% == 0 (
    echo.
    echo ===== SUKSES =====
    echo Tugas "Morbis Ext Update" dibuat: tiap hari pukul 05:00.
    echo File ekstensi akan diperbarui otomatis dari branch main.
    echo Ingat: tetap perlu klik REFRESH di chrome://extensions
    echo setelah file tertarik (bila browser sedang terbuka).
) else (
    echo.
    echo [GAGAL] Tidak bisa membuat tugas.
    echo Jalankan script ini sebagai Administrator.
)
echo.
pause