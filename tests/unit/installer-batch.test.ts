/**
 * Guard Install_Morbis_Ext.bat (installer policy Windows).
 *
 * Test ini menangkap regresi yang sudah pernah terjadi di lapangan:
 *
 *  1. ASCII-only. Skrip ini diunduh user lalu dijalankan lewat cmd.exe, dan
 *     backlash corrupt pernah menyisipkan kata campuran non-ASCII di dalam
 *     komentar. Nicht-ASCII di .bat = mojibake atau karakter tak terduga.
 *
 *  2. View registry dihitung di :MAIN. Sebelumnya RV hanya di-set di dalam
 *     jalur :INSTALL, sehingga jalur :UNINSTALL menjalankan "reg delete"
 *     TANPA /reg:64. Pada cmd 32-bit di OS 64-bit itu menulis ke
 *     Wow6432Node - policy di native view UTUH, artinya uninstaller
 *     terlihat sukses padahal tidak menghapus apa pun.
 *
 *  3. Cleanup ExtensionSettings harus menangani DUA layout. Installer lama
 *     menulis ExtensionSettings\<id> sebagai VALUE berisi JSON ter-escape,
 *     bukan SUBKEY. "reg delete <path>\<id> /f" (tanpa /v) TIDAK menyentuh
 *     nilai, jadi racunnya bertahan selamanya; Chrome lalu membuang seluruh
 *     objek ExtensionSettings ("Unknown property: <id>") dan force_installed
 *     ikut hilang walau registry terlihat benar.
 *
 *  4. DetectManaged harus mencocokkan NAMA FIELD dan NILAI dari
 *     `dsregcmd /status`. Versi lama hanya mengambil token ke-2 (YES/NO)
 *     lalu membandingkannya dengan nama field, sehingga tidak pernah cocok
 *     dan MANAGED tidak pernah menjadi 1.
 *
 * Di Windows test ini juga MENGEKSEKUSI subrutin :VerGe lewat cmd sungguhan,
 * karena logikanya (pecah semver, bandingkan) mustahil dibuktikan dari teks.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, writeFileSync, mkdtempSync, existsSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';
import { tmpdir } from 'os';
import { join, relative, resolve } from 'path';

const rootDir = resolve(fileURLToPath(import.meta.url), '../../..');
const batPath = join(rootDir, 'deploy', 'Install_Morbis_Ext.bat');
const bat = readFileSync(batPath, 'utf-8');
const lines = bat.split(/\r?\n/);

const CURRENT_ID = 'beljnjfifmncnfnhdkcmjpeonoigdnbl';
const LEGACY_IDS = [
  CURRENT_ID,
  'cbkjilfkdgclmpilonabdnicngjjgegd',
  'xae4a2ltyv2bj7lqyzxi2xeynpiefblg',
];

/** Isi subroutine bernama `label` (sampai label berikutnya di kolom 0). */
function bodyOf(label: string): string {
  const start = lines.findIndex((l) => l.trim() === `:${label}`);
  expect(start, `label :${label} harus ada`).toBeGreaterThan(-1);
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^:[A-Za-z_]/.test(lines[i])) {
      end = i;
      break;
    }
  }
  return lines.slice(start, end).join('\n');
}

/**
 * Potong teks antara dua label, termasuk keduanya. Dipakai untuk
 * subroutine yang tersusun dari beberapa label berurutan (mis. :DISPATCH
 * lalu :D_INSTALL, :D_UNINSTALL, :D_SCHEDULE) - bodyOf akan berhenti
 * di label berikutnya sehingga tidak bisa menguji seluruh blok itu.
 */
function region(from: string, to: string): string {
  const start = lines.findIndex((l) => l.trim() === `:${from}`);
  const end = lines.findIndex((l) => l.trim() === `:${to}`);
  expect(start, `label :${from} harus ada`).toBeGreaterThan(-1);
  expect(end, `label :${to} harus ada`).toBeGreaterThan(start);
  return lines.slice(start, end).join('\n');
}

describe('Install_Morbis_Ext.bat - bentuk file', () => {
  it('hanya berisi ASCII', () => {
    const offenders = lines
      .map((l, i) => ({ l, i }))
      .filter(({ l }) => Array.from(l).some((ch) => ch.charCodeAt(0) > 127));
    expect(offenders.map((o) => `baris ${o.i + 1}: ${o.l}`)).toEqual([]);
  });

  it('tidak menyisakan kata campuran dari backlash corrupt', () => {
    // Kata-kata ini pernah muncul sebagai sisa editing yang tidak sengaja.
    const corrupt = [
      'MenChecked',
      'dipakaiotopic',
      'crampingin',
      'whatness',
      'menourism',
      'omnipretensikan',
      'sekali_andalkan',
      'policyShapes',
      'Dontah',
      // Pernah ada baris komentar yang kehilangan prefix REM sehingga
      // kata Indonesianya dieksekusi sebagai perintah tiap verifikasi.
      'MELEMPEKNYA',
    ];
    const found = corrupt.filter((w) => bat.includes(w));
    expect(found).toEqual([]);
  });
});

describe('Install_Morbis_Ext.bat - view registry', () => {
  it('memakai subroutine :InitRegistryView', () => {
    expect(bat).toMatch(/^:InitRegistryView$/m);
  });

  it('memanggilnya dari :MAIN, bukan hanya dari :INSTALL', () => {
    const mainIdx = lines.findIndex((l) => l.trim() === ':MAIN');
    expect(mainIdx).toBeGreaterThan(-1);
    // :InitRegistryView harus dipanggil SEBELUM cabang ke tiap jalur.
    const callIdx = lines.findIndex(
      (l) => /call :InitRegistryView/.test(l) && l.trim().startsWith('call'),
    );
    expect(callIdx, 'harus ada "call :InitRegistryView" di area :MAIN').toBeGreaterThan(mainIdx);
    expect(callIdx).toBeLessThan(lines.findIndex((l) => l.trim() === ':MENU'));
  });

  it('InitRegistryView selalu menghasilkan RV (/reg:64 di OS 64-bit)', () => {
    const body = bodyOf('InitRegistryView');
    expect(body).toMatch(/set\s+"RV=\/reg:64"/);
    expect(body).toMatch(/if\s+defined\s+OS32\s+set\s+"RV="/);
    // CMD 32-bit di OS 64-bit tetap harus /reg:64.
    expect(body).toMatch(/PROCESSOR_ARCHITEW6432\s+set\s+"RV=\/reg:64"/);
  });
});

describe('Install_Morbis_Ext.bat - cleanup ExtensionSettings', () => {
  const clean = bodyOf('CleanRoot');

  it('membawa ketiga ID (saat ini + legacy) dalam daftar', () => {
    for (const id of LEGACY_IDS) {
      expect(clean, `:CleanRoot harus memuat ID ${id}`).toContain(id);
    }
  });

  it('menghapus SUBKEY ExtensionSettings\\<id> (layout installer sekarang)', () => {
    // Loop atas %%I, jadi ID tidak ditulis literal di baris reg delete.
    expect(clean).toMatch(/reg\s+delete\s+"!CR!\\ExtensionSettings\\%%~I"\s+\/f/i);
  });

  it('menghapus VALUE ExtensionSettings /v <id> (layout installer lama)', () => {
    // Bentuk inilah yang tidak pernah terhapus sebelumnya - akar bug policy.
    // Tanpa /v di sini, racunnya bertahan selamanya.
    expect(clean).toMatch(/reg\s+delete\s+"!CR!\\ExtensionSettings"\s+\/v\s+"%%~I"/i);
  });

  it('membersihkan ExtensionInstallForcelist dan Allowlist lewat :PurgeListValues', () => {
    for (const key of ['ExtensionInstallForcelist', 'ExtensionInstallAllowlist']) {
      expect(clean).toMatch(new RegExp(`call :PurgeListValues[^\\n]*${key}`, 'i'));
      // Ketiga ID harus ikut diteruskan ke setiap call.
      const call = clean.split('\n').find((l) => l.includes(key) && l.includes('PurgeListValues'));
      for (const id of LEGACY_IDS) {
        expect(call, `call :PurgeListValues ${key} harus menyertakan ${id}`).toContain(id);
      }
    }
  });

  it('tidak menghapus seluruh key Forcelist milik IT', () => {
    // Kalau key diholesale, ekstensi milik IT ikut hilang.
    expect(clean).not.toMatch(/reg\s+delete\s+[^"]*ExtensionInstallForcelist["]\s+\/f/i);
  });

  it('menghapus subkey AutoplayAllowed (policy salah dari installer lama)', () => {
    // Bentuk root HARUS "HKLM\..." (backslash). Bentuk "HKLM:\..." adalah
    // sintaks PowerShell yang membuat reg.exe gagal total.
    expect(bodyOf('CleanMorbis')).toMatch(
      /reg\s+delete\s+"%%~R\\SOFTWARE\\Policies\\%%~P\\AutoplayAllowed"\s+\/f/i,
    );
  });
});

describe('Install_Morbis_Ext.bat - DetectManaged', () => {
  const body = bodyOf('DetectManaged');

  it('mengambil field DAN value dari dsregcmd', () => {
    // tokens=1,2 delims=: -> %%A = nama field, %%B = YES/NO.
    expect(body).toMatch(/tokens=1,2\s+delims=:/);
  });

  it('menyalakan MANAGED hanya saat nilainya YES', () => {
    expect(body).toMatch(/if\s+\/I\s+"!DVAL!"=="YES"/);
  });

  it('mencocokkan nama field ke nama field, bukan ke YES/NO', () => {
    // Regresi lama: variabel yang Holds YES/NO dibandingkan dengan nama
    // field ("AzureAdJoined"), sehingga tidak pernah cocok.
    expect(body).toMatch(/if\s+\/I\s+"!DFIELD!"=="AzureAdJoined"/);
    expect(body).toMatch(/if\s+\/I\s+"!DFIELD!"=="DomainJoined"/);
    // DVAL hanya boleh dibandingkan dengan YES.
    expect(body).not.toMatch(/!DVAL!"=="[A-Za-z]+Joined"/);
    // Variabel lama harus hilang total.
    expect(body).not.toContain('DREG');
  });

  it('tidak memakai findstr "Joined" terhadap nilai YES/NO', () => {
    expect(body).not.toMatch(/findstr\s+\/I\s+"Joined"/);
  });

  it('memeriksa kedua lokasi domain join', () => {
    expect(body).toMatch(/ActiveComputerName"[^|]*\|[^|]*DomainName/i);
    expect(body).toMatch(/Tcpip\\Parameters"[^|]*\|[^|]*Domain/i);
  });
});

/**
 * Menjalankan subrutin batch sungguhan. Hanya di Windows: CI repo ini
 * berjalan di ubuntu-24.04, jadi guard statis di atas tetap yang utama
 * di sana, sementara test ini menangkap bug logika saat develop lokal.
 */
const describeWin = process.platform === 'win32' ? describe : describe.skip;

describe('Install_Morbis_Ext.bat - satu sumber kebenaran', () => {
  it('tidak ada Uninstall_Morbis_Ext.bat terpisah lagi', () => {
    // Dua salinan logika registry itu pernah berbeda DAN salah: yang lama
    // hanya menghapus ExtensionSettings sebagai subkey (racun /v tertinggal),
    // hanya membersihkan 1 ID di HKCU, serta menghapus Forcelist /v "1"
    // secara buta - entri indeks 1, bukan "entri milik MORBIS".
    expect(existsSync(join(rootDir, 'deploy', 'Uninstall_Morbis_Ext.bat'))).toBe(false);
  });

  it('tidak ada skrip .bat lain di deploy/ yang menulis reg delete policy', () => {
    const offenders: string[] = [];
    for (const f of readdirSync(join(rootDir, 'deploy'))) {
      if (!f.toLowerCase().endsWith('.bat')) continue;
      if (f === 'Install_Morbis_Ext.bat') continue;
      const src = readFileSync(join(rootDir, 'deploy', f), 'utf-8');
      if (/^\s*reg\s+add\s+.*SOFTWARE\\Policies/im.test(src)) offenders.push(f);
    }
    expect(offenders).toEqual([]);
  });

  it('header mendaftarkan semua mode', () => {
    // Batas header diturunkan dari label pertama, bukan angka tetap.
    // Angka tetap ikut rapuh begitu ada satu baris komentar baru.
    const mainAt = lines.findIndex((l) => /^:MAIN\b/.test(l));
    expect(mainAt).toBeGreaterThan(0);
    const header = lines.slice(0, mainAt).join('\n');
    for (const mode of ['[1]', '[2]', '[3]', '[4]', '[5]', '[6]']) {
      expect(header, `header harus menyebut ${mode}`).toContain(mode);
    }
    for (const arg of ['install', 'verify', 'manual', 'schedule', 'restore', 'pull', 'uninstall']) {
      expect(header, `header harus menyebut argumen "${arg}"`).toContain(arg);
    }
  });

  it('header tidak mengklaim ada payload .bat terpisah', () => {
    // Semua .bat sudah digabung. Kalau header kembali menyatakan
    // scripts/*.bat "tidak digabung", dokumentasi menyesatkan.
    const mainAt = lines.findIndex((l) => /^:MAIN\b/.test(l));
    const header = lines.slice(0, mainAt).join('\n');
    expect(header).not.toMatch(/TIDAK digabung/);
    expect(header).not.toMatch(/payload\s+runtime\s+tetap\s+terpisah/i);
  });

  it('route uninstall / manual / schedule dari argumen CLI', () => {
    // Routing lewat :DISPATCH tunggal, bukan perlu-if terpisah per mode,
    // supaya titik masuk admin per-mode punya satu tempat yang jelas.
    const dispatch = region('DISPATCH', 'RequireAdmin');
    expect(dispatch).toMatch(/if\s+\/i\s+"%MODE%"=="uninstall"\s+goto :D_UNINSTALL/);
    expect(dispatch).toMatch(/if\s+\/i\s+"%MODE%"=="manual"\s+goto :MANUAL_INSTALL/);
    expect(dispatch).toMatch(/if\s+\/i\s+"%MODE%"=="schedule"\s+goto :D_SCHEDULE/);
    // Mode install/uninstall/schedule lewat gerbang admin lebih dulu.
    expect(dispatch).toMatch(
      /:D_UNINSTALL\s*\r?\ncall :RequireAdmin "uninstall"\s*\r?\nif errorlevel 1 exit \/B\s*\r?\ngoto :UNINSTALL/,
    );
  });

  it('route restore dari argumen CLI lewat gerbang admin', () => {
    const dispatch = region('DISPATCH', 'RequireAdmin');
    expect(dispatch).toMatch(/if\s+\/i\s+"%MODE%"=="restore"\s+goto :D_RESTORE/);
    expect(dispatch).toMatch(
      /:D_RESTORE\s*\r?\ncall :RequireAdmin "restore"\s*\r?\nif errorlevel 1 exit \/B\s*\r?\ngoto :RestorePolicy/,
    );
  });

  it('header menyebut keenam mode plus pull mesin', () => {
    const header = lines
      .slice(
        0,
        lines.findIndex((l) => /^:MAIN\b/.test(l)),
      )
      .join('\n');
    for (const arg of ['install', 'verify', 'manual', 'schedule', 'restore', 'pull', 'uninstall']) {
      expect(header, `header harus menyebut argumen "${arg}"`).toContain(arg);
    }
  });
});

describe('Install_Morbis_Ext.bat - :ProbeBrowser tidak boleh berbohong', () => {
  const body = bodyOf('ProbeBrowser');

  it('mendeteksi racun ExtensionSettings/<id> bertipe value', () => {
    // Tanpa ini, verifikasi melaporkan [OK] di PC yang_policy-nya rusak.
    // Terbukti nyata: kelima pemeriksaan lama hanya membaca subkey ID yang
    // benar, sementara racunnya ada di sibling-nya sebagai VALUE.
    expect(body).toMatch(/reg\s+query\s+"!PB!\\ExtensionSettings"\s+\/v\s+"%%~I"/i);
    expect(body).toMatch(/if\s+defined\s+POISON\b/);
    expect(body).toMatch(/RACUN-ExtensionSettings-bertipe-value/);
  });

  it('memeriksa ketiga ID, bukan hanya ID saat ini', () => {
    const loop = body.split('\n').find((l) => l.includes('for %%I in'));
    expect(loop, 'loop ID racun tidak ditemukan').toBeDefined();
    // ID saat ini dirujuk lewat !EXT_ID! supaya tetap satu sumber kebenaran.
    expect(loop!, 'loop racun harus memakai !EXT_ID! untuk ID saat ini').toContain('!EXT_ID!');
    for (const id of LEGACY_IDS.slice(1)) {
      expect(loop!, `loop racun harus memuat ID legacy ${id}`).toContain(id);
    }
  });

  it('mendeteksi sisa Allowlist berformat salah', () => {
    expect(body).toMatch(/if\s+defined\s+ALLOWBAD\b/);
    expect(body).toMatch(/ALLOWLIST-format-salah/);
  });

  it('menyaring pola /* tanpa scheme, bukan sekadar /*', () => {
    // Entri yang BENAR juga berakhiran /* (https://host/*). Kalau hanya
    // findstr /C:"/*" maka setiap entri sah dilaporkan sebagai pola buruk.
    expect(body).toMatch(/findstr\s+\/C:"\/\*"\s+\^\|\s*findstr\s+\/V\s+\/C:":\/\/"/);
  });

  it('tidak menulis AutoplayAllowed lagi (cleanup menghapusnya)', () => {
    // Install pernah menulis policy ini sementara :CleanMorbis menghapus
    //nya - installer berbohong soal "terpasang" lalu uninstall membersihkannya.
    expect(bodyOf('WritePolicy')).not.toMatch(/reg\s+add\s+"!B!"\s+\/v\s+"AutoplayAllowed"/i);
    expect(bat).not.toMatch(/New-ItemProperty -Path \$b -Name 'AutoplayAllowed'/);
  });
});

describe('Install_Morbis_Ext.bat - jendela tidak menutup sendiri', () => {
  const bodyOfHold = () => bodyOf('Hold');

  it('seluruh ujung program menahan jendela, bukan hitung mundur buta', () => {
    // Dulu "timeout /t N /nobreak" dipakai di beberapa ujung: jendela
    // menutup sendiri setelah N detik walau user belum selesai membaca.
    // Timeout yang masih sah itu timeout DI TENGAH alur (mis. jeda 2
    // detik setelah menutup browser), jadi yang dilarang adalah timeout
    // yang dipakai menggantikan "call :Hold" di ujung program.
    for (const [i, line] of lines.entries()) {
      if (/timeout\.exe\s+\/t\s+\d+/.test(line)) {
        const next = lines[i + 1] ?? '';
        const usedAsTerminalHold = /^\s*exit \/B/i.test(next);
        expect(
          usedAsTerminalHold,
          `timeout buta di baris ${i + 1} menggantikan tahan jendela`,
        ).toBe(false);
      }
    }
    expect(lines.filter((l) => /^\s*call :Hold\s*$/i.test(l)).length).toBeGreaterThanOrEqual(10);
  });

  it('subrutin :Hold ada dan recognizable oleh cmd', () => {
    // Label yang ter-indent tidak dikenali cmd sama sekali, sehingga
    // "call :Hold" akan jatuh ke baris berikutnya dan pesan penahan
    // jendela tidak pernah tampil.
    const holdAt = lines.findIndex((l) => /^:Hold$/.test(l));
    expect(holdAt).toBeGreaterThan(0);
    // Tidak boleh ada label yang ter-indent di seluruh file.
    const indented = lines
      .map((l, i) => ({ l, i }))
      .filter(({ l }) => /^\s+:[A-Za-z_]/.test(l))
      .map(({ i }) => i + 1);
    expect(indented).toEqual([]);
  });

  it(':Hold hanya menahan di konsol nyata, bukan di stdin redirect', () => {
    const body = bodyOfHold();
    expect(body).toMatch(/if defined NOPAUSE exit \/B 0/);
    expect(body).toMatch(/if defined MORBIS_NO_PAUSE exit \/B 0/);
    // "choice ... >ndul" justru menyembunyikan prompt-nya karena choice
    // menulis prompt ke stdout. "pause >nul" yang benar.
    expect(body).not.toMatch(/choice\s/);
    expect(body).toMatch(/pause >nul/);
  });

  it('mode mesin "pull" memaksa NOPAUSE sebelum masuk :PULL', () => {
    // Ini yang mencegah task terjadwal menggantung selamanya: schtasks
    // menjalankan "pull" dengan sesi konsol nyata, jadi tanpa NOPAUSE
    //menunggu tombol yang tidak akan pernah ditekan.
    const at = lines.findIndex((l) => /^:DISPATCH_PULL$/.test(l));
    expect(at).toBeGreaterThan(0);
    const block = lines.slice(at, at + 3).join('\n');
    expect(block).toMatch(/set "NOPAUSE=1"/);
    expect(block).toMatch(/goto :PULL/);

    const dispatch = bodyOf('DISPATCH');
    expect(dispatch).toMatch(/goto :DISPATCH_PULL/);
  });

  it('tidak ada ujung yang pakai pause mentah (semua lewat :Hold)', () => {
    for (const [i, line] of lines.entries()) {
      if (/^\s*pause\s*$/i.test(line)) {
        const next = lines[i + 1] ?? '';
        // Pause 'lanjut di tengah alur' boleh; ujung program tidak.
        expect(next, `pause di baris ${i + 1} diakhiri program`).not.toMatch(/^\s*exit \/B/i);
      }
    }
    const holdCalls = lines.filter((l) => /^\s*call :Hold\s*$/i.test(l)).length;
    expect(holdCalls).toBeGreaterThanOrEqual(10);
  });
});

describe('Install_Morbis_Ext.bat - timestamp backup bebas space & locale', () => {
  // Komentar REM sengaja masih menyebut pola bug lama sebagai dokumentasi,
  // jadi pemeriksaan harus dijalankan terhadap baris kode saja.
  const codeOf = (label: string) =>
    bodyOf(label)
      .split('\n')
      .filter((l) => !/^\s*REM\b/i.test(l))
      .join('\n');

  it('tidak memotong %%TIME%% langsung karena hour di-pad space cmd', () => {
    // cmd memberi " 9:05" untuk jam 09:05, jadi %%TIME:~0,2%% = " 9" dan
    // TS lama menjadi "20260929_ 905" - berisi spasi.
    const body = codeOf('PULL');
    expect(body).not.toMatch(/%TIME:~0,2%/);
    expect(body).toMatch(/Get-Date -Format yyyyMMdd_HHmmss/);
    // Sabuk pengaman terakhir: space dibuang dari nama folder.
    expect(body).toMatch(/set "TS=!TS: =!"/);
    expect(body).toMatch(/if not defined TS set "TS=%RANDOM%"/);
  });

  it('tidak mengasumsikan %%DATE%% berformat DD/MM/YYYY', () => {
    // Kode lama mengambil char 3,2 sebagai bulan, benar di id-ID tapi
    // bulan/hari tertukar di PC en-US (09/28/2026).
    const body = codeOf('PULL');
    expect(body).not.toMatch(/%DATE:~3,2%/);
    expect(body).not.toMatch(/%DATE:~0,2%/);
    expect(body).not.toMatch(/%TIME:~3,2%/);
  });
});

describe('Install_Morbis_Ext.bat - utilitas Windows tidak bisa di-shadow', () => {
  it('System32 dipaksa ke depan PATH di awal skrip', () => {
    // "where curl" di PC uji menunjuk D:\laragon\...\curl.exe, jadi
    // kelas bug ini nyata, bukan teoretis.
    const mainAt = lines.findIndex((l) => /^:MAIN\b/.test(l));
    const head = lines.slice(0, mainAt).join('\n');
    expect(head).toMatch(/set "PATH=%SystemRoot%\\System32;/);
  });

  it('curl memakai System32 bila ada, dengan fallback untuk OS lama', () => {
    const body = bodyOf('VerifyPolicy');
    expect(body).toMatch(/if exist "%SystemRoot%\\System32\\curl\.exe"/);
    expect(body).toMatch(/if not defined CURL set "CURL=curl"/);
    // -L: GitHub Pages kadang balas redirect.
    expect(body).toMatch(/%CURL% -sL --max-time 15/);
    expect(body).not.toMatch(/^\s*curl -s /);
  });

  it('schtasks memakai absolute path di create maupun delete', () => {
    expect(bodyOf('SCHEDULE')).toMatch(/"%SystemRoot%\\System32\\schtasks\.exe" \/Create/);
    const un = bodyOf('UNINSTALL');
    expect(un).toMatch(/"%SystemRoot%\\System32\\schtasks\.exe" \/Delete/);
    // Tidak boleh ada schtasks tanpa path.
    for (const [i, line] of lines.entries()) {
      if (/^\s*schtasks\s/.test(line)) {
        expect(line, `schtasks tanpa path di baris ${i + 1}`).toMatch(/System32\\schtasks\.exe/);
      }
    }
  });
});

describe('Install_Morbis_Ext.bat - struktur blok cmd', () => {
  /**
   * Parens kurung di dalam `echo` pada blok `( ... )` harus di-escape (`^(`).
   *
   * cmd menghitung parens SEBELUM menghormati kutip, jadi `)` di dalam teks
   * echo dapat menutup blok lebih awal dan sisa baris dieksekusi sebagai
   * perintah. Gejalanya persis seperti ini:
   *   "sehingga was unexpected at this time."
   *
   * Parens yang sudah di-escape, dan parens berpasangan dari ekspansi
   * !VAR!, sebelumnya lolos dari aturan ini - keduanya sekarang ikut
   * di-escape di skrip supaya aturannya bisa dijaga tanpa pengecualian.
   */
  it('tidak ada kurung tak ter-escape di dalam echo di dalam blok', () => {
    const offenders: string[] = [];
    let inBlock = false;
    for (const [i, line] of lines.entries()) {
      const trimmed = line.trim();
      if (/^(REM\b|::)/i.test(trimmed)) continue;
      if (/\(\s*$/.test(trimmed) || /\b(do|else)\s*\($/i.test(trimmed)) inBlock = true;
      if (inBlock && /^echo\b/i.test(trimmed)) {
        // Buang karakter yang di-escape dengan ^, termasuk parens-nya.
        const withoutEscapes = trimmed.replace(/\^./g, '');
        if (/[()]/.test(withoutEscapes)) {
          offenders.push(`baris ${i + 1}: ${trimmed}`);
        }
      }
      if (inBlock && /^\)\s*(else\s*\(|$)/i.test(trimmed)) inBlock = false;
    }
    expect(offenders).toEqual([]);
  });
});

describe('repo - hanya satu .bat di seluruh repo', () => {
  const repoRoot = resolve(__dirname, '../..');

  it('hanya Install_Morbis_Ext.bat yang tersisa', () => {
    // Logika tarik versi sudah di-inline ke mode "pull", jadi payload
    // scripts/morbis-update*.bat tidak lagi diperlukan.
    const found: string[] = [];
    const walk = (dir: string, depth: number): void => {
      if (depth > 4) return;
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        if (entry.name === 'node_modules' || entry.name === '.git') continue;
        const full = join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(full, depth + 1);
        } else if (entry.name.toLowerCase().endsWith('.bat')) {
          found.push(relative(repoRoot, full).replace(/\\/g, '/'));
        }
      }
    };
    walk(repoRoot, 0);
    // Satu installer aktif + satu script update main yang dikembalikan
    // (user minta scripts/morbis-update-main.bat di branch dev).
    expect(found.sort()).toEqual(
      ['deploy/Install_Morbis_Ext.bat', 'scripts/morbis-update-main.bat'].sort(),
    );
  });

  it('workflow tidak lagi menyalin .bat terpisah', () => {
    const wf = readFileSync(resolve(repoRoot, '.github/workflows/deploy-to-main.yml'), 'utf8');
    // Yang dilarang adalah aksi "cp", bukan penyebutan nama file di
    // komentar/aturan purge. Aturan purge justru wajib ada supaya
    // salinan lawas yang terlanjur tayang ikut hilang.
    expect(wf).not.toMatch(/cp\s+scripts\//);
    expect(wf).not.toMatch(/cp\s+-r?\s*"?scripts/);
    expect(wf).toMatch(/cp deploy\/Install_Morbis_Ext\.bat/);
    // Salinan lawas di Pages masih dibersihkan (baris di-indentasi).
    expect(wf).toMatch(/^\s*!morbis-update-main\.bat\s*$/m);
  });

  it('installer punya mode pull yang menggantikan skrip update', () => {
    // Kalau scripts/*.bat dihapus tapi mode pull tidak ada, jalur manual
    // tidak punya cara menarik versi baru sama sekali. Logikanya dipecah
    // ke beberapa subrutin, jadi tiap tahap diperiksa di tempatnya.
    for (const label of ['PULL', 'PULL_CLONE', 'PULL_UPDATE', 'PULL_FAIL']) {
      expect(bat).toMatch(new RegExp(`^:${label}\\b`, 'm'));
    }
    const body = bodyOf('PULL');
    expect(body).toMatch(/REPO_URL=https:\/\/github\.com/);
    expect(body).toMatch(/REPO_DIR=%USERPROFILE%\\morbis-ext/);
    expect(bodyOf('PULL_CLONE')).toMatch(/git clone -b main/);
    // PULL_UPDATE dipecah menjadi :PULL_FETCH agar retry hanya menjerat
    // fetch yang gagal; baca sampai :PULL_FAIL supaya seluruh tahap update
    // tetap diperiksa.
    const upd = region('PULL_UPDATE', 'PULL_FAIL');
    expect(upd).toMatch(/git fetch origin main/);
    expect(upd).toMatch(/git checkout -f main/);
    expect(upd).toMatch(/git reset --hard origin\/main/);
  });

  it('tugas terjadwal menunjuk installer, bukan .bat di dalam clone', () => {
    // Folder %USERPROFILE%\morbis-ext bisa digeser oleh mode pull saat
    // clone gagal, jadi skrip di dalamnya ikut hilang dan jadwal mati.
    const body = bodyOf('SCHEDULE');
    expect(body).toMatch(/copy \/Y "%~f0" "!TOOL!"/i);
    expect(body).toMatch(/\/TR "\\"!TOOL!\\" pull"/);
    expect(body).not.toMatch(/morbis-update-main\.bat/);
  });
});

describe('Install_Morbis_Ext.bat - laporan per-hive', () => {
  it('menampilkan hasil HKLM dan HKCU, bukan hanya probe terakhir', () => {
    // Dulu hanya hasil probe HKCU yang tampil, sehingga policy HKLM yang
    // sebenarnya keracunan tersamar rapi di balik "0/4".
    const body = bodyOf('VerifyPolicy');
    expect(body).toMatch(/HKLM \^\(!LM_DETAIL!\^\) \+ HKCU \^\(!BDETAIL!\^\)/);
    expect(body).toMatch(/HKLM \^\(!LM_DETAIL!\^\)/);
  });

  it('tidak keluar dari loop for saat mencabangkan', () => {
    // `goto` ke label di luar blok for membuat variabel loop dibaca
    // sebagai %~P sehingga nama browser tercetak mentah.
    const body = bodyOf('VerifyPolicy');
    const loopStart = body.indexOf('for %%P in');
    const loopEnd = body.lastIndexOf(')');
    const inside = body.slice(loopStart, loopEnd);
    expect(inside).not.toMatch(/goto\s+:PROBE_DONE/);
  });

  it('membuang isi registry kedua hive saat gagal', () => {
    const body = bodyOf('VerifyPolicy');
    expect(body).toMatch(/isi registry HKLM:/);
    expect(body).toMatch(/isi registry HKCU:/);
  });
});

describe('Install_Morbis_Ext.bat - hanya satu .bat di deploy/', () => {
  const deployRoot = resolve(__dirname, '../../deploy');

  it('tidak ada .bat lain di deploy/ selain installer', () => {
    const found = readdirSync(deployRoot)
      .filter((f) => f.toLowerCase().endsWith('.bat'))
      .map((f) => f.toLowerCase());
    expect(found).toEqual(['install_morbis_ext.bat']);
  });

  it('file .bat lama sudah dihapus', () => {
    for (const gone of [
      'Uninstall_Morbis_Ext.bat',
      'Setup_Update_Terjadwal.bat',
      'pack-extension.bat',
      'deploy-to-github.bat',
    ]) {
      expect(existsSync(join(deployRoot, gone)), `${gone} seharusnya tidak ada`).toBe(false);
    }
  });

  it('build tool yang dihapus digantikan oleh npm script', () => {
    // Dua .bat itu cuma pembungkus "npm run pack"/"npm run deploy", jadi
    // menghapusnya tidak menghilangkan kemampuan build.
    const pkg = JSON.parse(readFileSync(resolve(__dirname, '../../package.json'), 'utf8'));
    expect(pkg.scripts.pack).toBeTruthy();
    expect(pkg.scripts.deploy).toBeTruthy();
  });
});

describe('Install_Morbis_Ext.bat - penjadwal update digabung sebagai mode', () => {
  it('mode schedule ada dan memanggil schtasks', () => {
    expect(bat).toMatch(/^:SCHEDULE\b/m);
    const body = bodyOf('SCHEDULE');
    // schtasks dipanggil lewat absolute path System32 supaya tidak bisa
    // di-shadow utility pihak ketiga di PATH.
    expect(body).toMatch(
      /"%SystemRoot%\\System32\\schtasks\.exe" \/Create \/F \/TN "Morbis Ext Update"/i,
    );
    expect(body).toMatch(/\/SC DAILY\s+\/ST 05:00/);
  });

  it('menolak membuat tugas kalau folder clone belum ada', () => {
    // Tanpa penjagaan ini, schtasks tetap terdaftar tapi gagal tiap malam
    // karena skrip update yang ditunjuk tidak pernah ada.
    const body = bodyOf('SCHEDULE');
    expect(body).toMatch(
      /if\s+not\s+exist\s+"%USERPROFILE%\\morbis-ext"\s+goto\s+:SCHED_NO_CLONE/i,
    );
  });

  it('tidak menggandakan penjadwalan di luar mode ini', () => {
    // Logikanya harus hidup di SATU tempat (:SCHEDULE). Ada dua baris
    // /Create yang sah: pembuatan langsung (/TR) dan import ulang XML
    // untuk StartWhenAvailable. Keduanya harus di dalam :SCHEDULE.
    const sched = bodyOf('SCHEDULE');
    const direct = lines.filter(
      (l) => /schtasks(\.exe)?"?\s+\/Create/i.test(l) && /\/TR\b/i.test(l),
    );
    const xml = lines.filter((l) => /schtasks(\.exe)?"?\s+\/Create/i.test(l) && /\/XML\b/i.test(l));
    expect(direct).toHaveLength(1);
    expect(xml).toHaveLength(1);
    expect(sched).toMatch(/\/TR "\\"!TOOL!\\" pull"/);
    expect(sched).toMatch(/StartWhenAvailable/);
    const outside = lines.filter((l, i) => {
      if (!/schtasks(\.exe)?"?\s+\/Create/i.test(l)) return false;
      const at = lines.findIndex((x) => /^:SCHEDULE\b/.test(x));
      const end = lines.findIndex((x, j) => j > at && /^:SCHED_NO_CLONE\b/.test(x));
      return !(i > at && i < end);
    });
    expect(outside).toEqual([]);
  });

  it('catch-up memakai XML StartWhenAvailable, bukan /RU berpassword', () => {
    // /RU tanpa password tidak menghasilkan "run whether logged on";
    // kredensial plaintext juga tidak boleh disimpan. Catch-up yang sah
    // adalah StartWhenAvailable lewat export/import XML.
    const sched = bodyOf('SCHEDULE');
    expect(sched).toMatch(/\/Query \/TN "Morbis Ext Update" \/XML/);
    expect(sched).toMatch(/StartWhenAvailable/);
    expect(sched).not.toMatch(/\/RU\s+"%USERNAME%"\s+\/RP/i);
    expect(sched).toMatch(/\/RU SYSTEM - itu TIDAK/);
  });
});

describe('Install_Morbis_Ext.bat - logging ke file', () => {
  it('log diinisialisasi di :MAIN di lokasi persisten', () => {
    const main = region('MAIN', 'MENU');
    expect(main).toMatch(/set "TOOL_DIR=%LOCALAPPDATA%\\Morbis"/);
    expect(main).toMatch(/set "LOGFILE=%TOOL_DIR%\\morbis-utilitas\.log"/);
    expect(main).toMatch(/set "BACKUP_DIR=%TOOL_DIR%\\backup"/);
    expect(main).toMatch(/call :Log "START mode=%MODE% user=%USERNAME%"/);
    // Rotasi: pull jalan tiap hari, log tidak boleh membengkak selamanya.
    expect(main).toMatch(/morbis-utilitas-prev\.log/);
    expect(main).toMatch(/GTR 524288/);
    expect(bat).toMatch(/^:Log$/m);
    expect(bat).toMatch(/^:LogStamp$/m);
  });

  it('timestamp log locale-independent dan pesan tidak memakai %DATE%/%TIME%', () => {
    const stamp = bodyOf('LogStamp');
    expect(stamp).toMatch(/Get-Date -Format 'yyyy-MM-dd HH:mm:ss'/);
    // Komentar boleh menyebut pola lama sebagai dokumentasi; yang
    // diperiksa adalah baris kode.
    const code = bodyOf('Log')
      .split('\n')
      .filter((l) => !/^\s*REM\b/i.test(l))
      .join('\n');
    expect(code).toMatch(/>>"%LOGFILE%" echo/);
    expect(code).not.toMatch(/%DATE%|%TIME%/);
  });

  it('titik penting menulis hasil ke log', () => {
    expect(region('PULL', 'PULL_FAIL')).toMatch(/call :Log "PULL mulai repo=/);
    expect(region('PULL_UPDATE', 'PULL_FAIL')).toMatch(/call :Log "PULL sukses di/);
    expect(bodyOf('PULL_FAIL')).toMatch(/call :Log "PULL GAGAL pada langkah=%PULL_STEP%/);
    expect(bodyOf('SCHEDULE')).toMatch(/call :Log "SCHEDULE sukses/);
    expect(bodyOf('SCHED_FAIL')).toMatch(/call :Log "SCHEDULE gagal/);
    expect(bodyOf('FINISH_OK')).toMatch(/call :Log "INSTALL selesai/);
    expect(bodyOf('FINISH_FAIL')).toMatch(/call :Log "INSTALL GAGAL/);
    expect(bodyOf('UNINSTALL')).toMatch(/call :Log "UNINSTALL selesai/);
  });
});

describe('Install_Morbis_Ext.bat - cleanup benar-benar menghapus', () => {
  it('root registry tanpa titik-dua PowerShell (HKLM: invalid untuk reg.exe)', () => {
    // "HKLM:\..." adalah sintaks provider PowerShell; reg.exe menjawab
    // "ERROR: Invalid key name" dan SEMUA reg delete gagal diam-diam.
    // Pernah terjadi: langkah [2/6] "Membersihkan" jadi no-op total dan
    // racun bertahan selamanya di setiap PC.
    // :CleanMorbis merakit root dari loop hive; :CleanRoot/:PurgeListValues
    // menerima root jadi dan tidak boleh mengandung pola "HIVE:\...".
    const morbis = bodyOf('CleanMorbis');
    expect(morbis, ':CleanMorbis tidak boleh memakai HKLM:/HKCU:').not.toMatch(/%%~R:/);
    expect(morbis, ':CleanMorbis harus memakai HKLM\\/HKCU\\').toMatch(/%%~R\\/);
    for (const label of ['CleanMorbis', 'CleanRoot', 'PurgeListValues']) {
      const body = bodyOf(label);
      expect(body, `:${label} tidak boleh mengandung pola HIVE:\\`).not.toMatch(/(HKLM|HKCU):\\/);
    }
  });

  it('PurgeListValues memakai token 1 sebagai nama value', () => {
    // Baris "reg query" = <spasi> NAMA <spasi> TIPE <spasi> DATA; for /f
    // membuang spasi depan jadi token 1 = NAMA. Pernah tertulis
    // "tokens=2,*" sehingga %%A = "REG_SZ" dan setiap
    // "reg delete /v REG_SZ" gagal diam-diam - Forcelist/Allowlist
    // MORBIS tidak pernah terhapus.
    const body = bodyOf('PurgeListValues');
    expect(body).toMatch(/tokens=1,\*/);
    expect(body).not.toMatch(/tokens=2,\*/);
  });

  it('CleanRoot menghapus ketiga ID dalam dua bentuk + kedua list', () => {
    const body = bodyOf('CleanRoot');
    for (const id of [
      'beljnjfifmncnfnhdkcmjpeonoigdnbl',
      'cbkjilfkdgclmpilonabdnicngjjgegd',
      'xae4a2ltyv2bj7lqyzxi2xeynpiefblg',
    ]) {
      expect(body, `harus membersihkan ${id}`).toContain(id);
    }
    expect(body).toMatch(/ExtensionSettings\\%%~I/);
    expect(body).toMatch(/ExtensionSettings" \/v "%%~I"/);
    expect(body).toMatch(/PurgeListValues "!CR!\\ExtensionInstallForcelist"/);
    expect(body).toMatch(/PurgeListValues "!CR!\\ExtensionInstallAllowlist"/);
  });

  it('menjelaskan cap [BLOCKED] di halaman policy (bukan isi registry)', () => {
    // brave://policy menandai entri "[BLOCKED]" kalau browser menolak
    // policy PC unmanaged. Tanpa penjelasan ini, admin mengira registry
    // rusak dan "memperbaiki" sesuatu yang sudah benar. Subrutin yang
    // menulis registry tidak boleh mengandung prefix itu.
    expect(bat).toMatch(/\[BLOCKED\]/);
    expect(bat).toMatch(/CAP browser/);
    for (const label of ['CleanMorbis', 'CleanRoot', 'WritePolicy']) {
      expect(bodyOf(label)).not.toMatch(/\[BLOCKED\]/);
    }
  });
});

describe('Install_Morbis_Ext.bat - backup dan restore policy', () => {
  it('backup .reg di lokasi persisten, bukan %TEMP%', () => {
    const inst = bodyOf('INSTALL');
    expect(inst).toMatch(/!BACKUP_DIR!\\policy-%%~nxP\.reg/);
    expect(inst).not.toMatch(/%TEMP%\\morbis-ext-backup/);
  });

  it('restore tersedia sebagai mode dan memakai reg import dari backup', () => {
    expect(bat).toMatch(/^:RestorePolicy$/m);
    const rp = bodyOf('RestorePolicy');
    expect(rp).toMatch(/BACKUP_DIR/);
    expect(rp).toMatch(/\.reg/);
    expect(rp).toMatch(/reg import/);
    expect(rp).toMatch(/call :RequireAdmin/);
  });

  it('uninstall mempertahankan backup sebagai jaring pengaman', () => {
    const un = bodyOf('UNINSTALL');
    expect(un).toMatch(/BACKUP_DIR/);
    expect(un).toMatch(/SENGAJA TIDAK dihapus/);
    expect(un).not.toMatch(/rmdir[^\r\n]*BACKUP_DIR/);
    expect(un).not.toMatch(/del[^\r\n]*BACKUP_DIR/);
  });
});

describe('Install_Morbis_Ext.bat - pull retry dan soft-close browser', () => {
  it('retry hanya menjerat fetch dan tidak memakai timeout', () => {
    const upd = region('PULL_UPDATE', 'PULL_FAIL');
    expect(upd).toMatch(/:PULL_FETCH$/m);
    expect(upd).toMatch(/set "PULL_TRY=1"/);
    expect(upd).toMatch(/if !PULL_TRY! GEQ 3 goto :PULL_FAIL/);
    expect(upd).toMatch(/ping\.exe" -n 6/);
    expect(upd).not.toMatch(/timeout\.exe\s+\/t/);
    expect(upd).toMatch(/set "PULL_STEP=fetch"/);
    expect(upd).toMatch(/set "PULL_STEP=checkout"/);
    expect(upd).toMatch(/set "PULL_STEP=reset"/);
    // Ujung sukses pull menahan jendela untuk jalan manual; mode mesin
    // aman karena selalu NOPAUSE.
    expect(upd).toMatch(/call :Hold/);
  });

  it('KillBrowsers soft-close dulu dan hanya force yang masih hidup', () => {
    const kb = bodyOf('KillBrowsers');
    expect(kb).toMatch(/taskkill \/IM %%B >nul/);
    expect(kb).toMatch(/ping\.exe" -n 4/);
    expect(kb).toMatch(/taskkill \/IM %%B \/F >nul/);
    expect(kb).not.toMatch(/timeout\.exe/);
    expect(kb).toMatch(/call :Log "KillBrowsers:/);
  });

  it('buka chrome://extensions hanya kalau path Chrome benar-benar ada', () => {
    // "start" memunculkan dialog GUI "Windows cannot find ..." kalau
    // path tidak ada - dan 2>nul tidak menahannya karena itu dialog,
    // bukan stderr. PC dengan Chrome 64-bit-only kena dialog error.
    const body = region('PULL_UPDATE', 'PULL_FAIL');
    expect(body).toMatch(
      /if exist "%ProgramFiles%\\Google\\Chrome\\Application\\chrome\.exe" start/,
    );
    expect(body).toMatch(
      /if exist "%ProgramFiles\(x86\)%\\Google\\Chrome\\Application\\chrome\.exe" start/,
    );
    expect(body).toMatch(
      /if exist "%LOCALAPPDATA%\\Google\\Chrome\\Application\\chrome\.exe" start/,
    );
    expect(body).not.toMatch(/^\s*start "" "%ProgramFiles%/);
  });
});

describe('Install_Morbis_Ext.bat - gerbang admin per-mode', () => {
  it('tidak ada cek admin global sebelum menu/dispatch', () => {
    // Cek admin global membuat mode [3] manual ikut kena UAC, padahal
    // dideskripsikan sebagai "tidak butuh admin". Admin dipindah ke
    // :RequireAdmin dan dipanggil per-mode.
    const mainIdx = lines.findIndex((l) => /^:MAIN\b/.test(l));
    const dispatchIdx = lines.findIndex((l) => /^:DISPATCH\b/.test(l));
    const head = lines.slice(0, dispatchIdx).join('\n');
    expect(head).not.toMatch(/^\s*fltmc\s+>nul/m);
    expect(mainIdx).toBeGreaterThan(-1);
    expect(dispatchIdx).toBeGreaterThan(mainIdx);
  });

  it('manual dan verify tidak lewat RequireAdmin', () => {
    const dispatch = region('DISPATCH', 'RequireAdmin');
    for (const mode of ['install', 'uninstall', 'schedule', 'restore']) {
      expect(dispatch, `${mode} harus minta admin`).toContain(`call :RequireAdmin "${mode}"`);
    }
    expect(dispatch).toMatch(/if\s+\/i\s+"%MODE%"=="manual"\s+goto\s+:MANUAL_INSTALL/);
    expect(dispatch).toMatch(/if\s+\/i\s+"%MODE%"=="verify"\s+goto\s+:VERIFY_ONLY/);
    // Tidak boleh ada gerbang admin di dalam kedua mode itu.
    const manual = bodyOf('MANUAL_INSTALL');
    expect(manual).not.toMatch(/RequireAdmin/i);
  });

  it('elevasi ulang dengan argumen mode, bukan kembali ke menu', () => {
    // Kalau UAC elevating tanpa argumen, user akan melihat menu lagi
    // dan harus memilih ulang - sangat mudah membingungkan.
    const body = bodyOf('RequireAdmin');
    expect(body).toMatch(/Start-Process '%0' -ArgumentList '%~1' -Verb RunAs/);
  });

  it('jendela asal ditahan saat handoff UAC, bukan ditutup diam-diam', () => {
    // Dulu setelah spawn jendela Administrator, jendela asal langsung
    // "exit /B 1" - user melihat jendela hilang dan tidak sempat membaca.
    // region dipakai karena alur elevasi memakai tiga label berurutan.
    const body = region('RequireAdmin', 'Hold');
    expect(body).toMatch(/^:RA_DENIED$/m);
    expect(body).toMatch(/Jendela baru Administrator dibuka/);
    const holds = body.split('\n').filter((l) => /^\s*call :Hold\s*$/i.test(l));
    expect(holds.length).toBeGreaterThanOrEqual(3);
  });
});

describeWin('Install_Morbis_Ext.bat - :VerGe (eksekusi cmd)', () => {
  function runVerGe(cases: Array<[string, string, number]>): void {
    // Blok admin di awal skrip dibuang, lalu disisipkan entry point test.
    const kept: string[] = [];
    let skipping = false;
    for (const l of lines) {
      if (/^\s*fltmc >nul 2>&1\s*$/.test(l)) {
        skipping = true;
        continue;
      }
      if (skipping) {
        if (/^\s*\)\s*$/.test(l)) skipping = false;
        continue;
      }
      kept.push(l);
    }
    const probe = [
      ':__TEST',
      'setlocal EnableDelayedExpansion',
      ...cases.map(([a, b], i) => `call :VerGe ${a} ${b} R${i}\r\necho R${i}=!R${i}!\r\n`),
      'exit /B 0',
      '',
    ].join('\r\n');

    const mainIdx = kept.findIndex((l) => l.trim() === ':MAIN');
    kept.splice(mainIdx, 0, probe);
    // :MAIN langsung lompat ke probe agar blok admin/menu tidak dieksekusi.
    const mainLine = kept.indexOf(':MAIN');
    kept.splice(mainLine + 1, 0, 'goto :__TEST');

    const dir = mkdtempSync(join(tmpdir(), 'morbis-bat-'));
    const file = join(dir, 'probe.bat');
    writeFileSync(file, kept.join('\r\n'), 'ascii');
    const out = execFileSync('cmd.exe', ['/c', file], { encoding: 'utf-8' });

    cases.forEach(([, , expected], i) => {
      const m = out.match(new RegExp(`R${i}=(\\d)`));
      expect(m, `tidak ada output untuk kasus ke-${i}:\n${out}`).not.toBeNull();
      expect(Number(m![1]), `kasus ke-${i} (${cases[i][0]} ge ${cases[i][1]})`).toBe(expected);
    });
  }

  it('membandingkan major/minor/patch dengan benar', () => {
    runVerGe([
      ['1.5.93', '1.5.93', 1],
      ['1.5.108', '1.5.93', 1],
      ['1.5.93', '1.5.108', 0],
      ['2.0.0', '10.0.0', 0],
      ['1.5.100', '1.5.99', 1],
    ]);
  });

  it('menangani versi yang komponennya kurang', () => {
    // "1.4" harus dibaca 1.4.0, bukan gagal diam-diam.
    runVerGe([
      ['1.4', '1.4.0', 1],
      ['1.4.1', '1.4', 1],
      ['1.4', '1.4.1', 0],
    ]);
  });
});
