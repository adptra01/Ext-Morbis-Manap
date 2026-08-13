/**
 * currentNumber — parser murni untuk endpoint antrian farmasi
 * `?section=isi&nomor=<loket>` (endpoint publik yang SAMA dipakai display
 * native via loadContent). Sumber kebenaran "nomor yang sedang dipanggil"
 * per counter — berubah SAAT klik "Selanjutnya" (verifikasi produksi
 * 2026-08-12), tidak bergantung WebSocket maupun status basi DOM native.
 *
 * Format respons (HTML fragment, verifikasi curl live 2026-08-12):
 *   current-number:
 *     <span class="current-number" data-counter="1">12</span>
 *   tabel antrian (nama pasien per nomor, baris panggilan ditandai):
 *     <tr class="status-called" data-id="78913" data-jenis="tunggal"
 *         data-nomor="12" style="cursor: pointer;">
 *       <td>BT-12</td>
 *       <td>10:40</td> <td>11:10</td>
 *       <td width="50%">SRI KUSMIATI</td>
 *       ...
 *
 * current-number = nomor yang sedang dipanggil (berubah saat klik).
 * Tabel = nama pasien untuk nomor itu — SATU fetch cukup untuk keduanya,
 * sehingga nama selalu sinkron (data_call bisa lag/basi di belakang
 * current-number, itu sebabnya nama TTS kadang kosong bila hanya
 * mengandalkan data_call).
 */

export type CurrentNumbers = Map<string, string>;

const CURRENT_RE = /current-number[^>]*data-counter="([^"]*)"[^>]*>([\s\S]*?)<\/span>/g;

const ROW_RE = /<tr[^>]*data-nomor="([^"]*)"[^>]*>([\s\S]*?)<\/tr>/g;

/** Info pasien per nomor antrian, diurai dari tabel ?section=isi. */
export type PatientRow = { nama: string; kode: string };
export type PatientByName = Map<string, PatientRow>;

/**
 * DOM parser untuk nama pasien di halaman view-call farmasi — sumber nama yang
 * DIJAMIN fresh (dirender server + di-update real-time oleh WebSocket native),
 * TANPA fetch terpisah. Mapping dari #list-content:
 *   <dl><dd class="col-1"><h4>BT-2</h4></dd>
 *       <dd class="col-3">ALISNITATI<p>RM : 6992</p></dd> ...</dl>
 * Di-parse nomor "B{nomor}" dari <h4>, nama dari dd.col-3.
 */
export function parseListContentPatient(listContent: Element | null): PatientByName {
  const m = new Map<string, PatientRow>();
  if (!listContent) return m;
  for (const dl of listContent.querySelectorAll('dl')) {
    const h4 = dl.querySelector('h4');
    if (!h4) continue;
    const nomorMatch = (h4.textContent || '').match(/(\d+)$/);
    if (!nomorMatch) continue;
    const nomor = nomorMatch[1];
    const dd3 = dl.querySelector('dd.col-3, dd.col-md-3');
    // nama = teks direct dari dd (hilangkan <p>RM : ...>); fallback teks penuh
    const nama = dd3
      ? Array.from(dd3.childNodes)
          .filter((n) => n.nodeType === Node.TEXT_NODE)
          .map((n) => n.textContent || '')
          .join('')
          .replace(/\s+/g, ' ')
          .trim()
      : '';
    const kode =
      dd3 && /[A-Za-z]/.test((h4.textContent || '').split('-')[0] || '')
        ? (h4.textContent || '').split('-')[0].toUpperCase()
        : '';
    if (nomor) m.set(nomor, { nama, kode });
  }
  return m;
}

export function parseCurrentNumbers(html: string): CurrentNumbers {
  const m = new Map<string, string>();
  for (const mm of html.matchAll(CURRENT_RE)) {
    const counter = mm[1].trim();
    const value = mm[2].replace(/\s+/g, ' ').trim();
    if (counter) m.set(counter, value);
  }
  return m;
}

export function parsePatients(html: string): PatientByName {
  const m = new Map<string, PatientRow>();
  for (const row of html.matchAll(ROW_RE)) {
    const nomor = row[1].trim();
    if (!nomor) continue;
    // Ambil teks sel <td>; kolom umum: [kode-nomor, waktu pesan, estimasi,
    // NAMA pasien, jam panggil]. Nama = sel berhuruf (bukan waktu / kode).
    const tds = [...row[2].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((t) =>
      t[1]
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim(),
    );
    const kode = tds[0] && /[A-Za-z]/.test(tds[0]) ? tds[0].split('-')[0] : '';
    const nama =
      tds.find((t) => /[A-Za-z]{2,}/.test(t) && !/^[A-Z]{1,3}-\d+$/.test(t)) ||
      tds[tds.length - 2] ||
      '';
    if (nama || kode) m.set(nomor, { nama, kode });
  }
  return m;
}

/** Nilai panggilan aktif untuk counter NON RACIKAN (counter 1), fallback
 *  counter lain yang punya nomor. "0"/kosong diabaikan. */
export function activeNumber(cur: CurrentNumbers): string {
  const prefer = ['1', '2'];
  for (const c of prefer) {
    const v = cur.get(c);
    if (v && v !== '0') return v;
  }
  for (const v of cur.values()) {
    if (v && v !== '0') return v;
  }
  return '';
}

/** Reset antrian? Tombol "Reset Antrian" di halaman manajemen mengembalikan
 *  current-number ke kecil/0 antar poll — bukan panggilan baru, jadi jangan
 *  di-announce. Panggilan normal selalu NAIK antarpoll; penurunan = reset. */
export function isReset(cur: CurrentNumbers, prev: CurrentNumbers): boolean {
  if (prev.size === 0) return false;
  for (const [c, v] of cur) {
    const p = prev.get(c);
    if (p === undefined) continue;
    const pn = Number(p);
    const vn = Number(v);
    if (Number.isFinite(pn) && Number.isFinite(vn) && vn < pn) return true;
  }
  return false;
}
