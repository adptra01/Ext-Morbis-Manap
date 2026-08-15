/* FarmasiIssue — Penerbitan Antrian Petugas + cetak sheet A4.
 *
 * Jalan di halaman konsole MORBIS /antrian-farmasi/v2 (yg punya #isi).
 * - Baca antrian live list-antrian-v2.
 * - Renumber bersih (R-xx / T-xx) deterministic dari data MORBIS.
 * - Tampilkan urutan (nomor + nama pasien) di panel kecil.
 * - Tombol "Cetak Sheet A4": buka print view berisi grid semua nomor
 *   (1+ lembar A4, potong) utk diberikan ke pasien sesuai urut.
 *
 * Prinsip: tidak menulis balik ke DB MORBIS (zero-risk ke data resep).
 * Nomor publik berlaku utk TAMPILAN/cetak/panggilan saja.
 */
import { getQueueState, issuePending, getTicket, type QueueTicket } from './shared/farmasiQueue';

const LIST_URL = '/public/antrian-farmasi-v2/list-antrian-v2';

async function fetchRows(): Promise<Array<Record<string, unknown>>> {
  // Kontrak endpoint (verifikasi live 2026-08-15): GET ?type=data_call →
  // PHP "Undefined index: id_unit" (HTML, bukan JSON) & POST data_call → [].
  // `check_antrian` (POST) = sumber tabel antrian native — data LENGKAP
  // (ID, ID_PASIEN, NOMOR, KODE, JENIS, NAMA_PASIEN, WAKTU, NAMA_UNIT).
  // Butuh session MORBIS — konsol farmasi selalu dalam session login.
  const res = await fetch(LIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: 'type=check_antrian',
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const j = (await res.json()) as Array<Record<string, unknown>>;
  if (!Array.isArray(j)) throw new Error('bukan array');
  return j;
}

/** Issue nomor publik utk semua baris lalu kembalikan peta id→tiket (code+jenis). */
async function loadTickets(
  rows: Array<Record<string, unknown>>,
): Promise<Map<string, QueueTicket>> {
  await issuePending(
    rows.map((r) => ({
      id: String(r.ID ?? ''),
      jenis: (r.JENIS as string | null) ?? null,
      waktu: (r.WAKTU as string | null) ?? null,
      // konsol issue cuma tahu antrian aktif; baris tak-selesai dianggap belum selesai
      selesai: false,
    })),
  );
  const st = await getQueueState();
  const m = new Map<string, QueueTicket>();
  for (const r of rows) {
    const tid = String(r.ID ?? '');
    const t = getTicket(st, tid);
    if (t) m.set(tid, t);
  }
  return m;
}

function buildPanel(): HTMLDivElement {
  const p = document.createElement('div');
  p.id = 'ext-farmasi-issue';
  p.style.cssText =
    'position:fixed;right:16px;bottom:16px;z-index:99999;background:#fff;border:1px solid #0f5132;' +
    'border-radius:14px;box-shadow:0 8px 30px rgba(0,0,0,.18);padding:14px 16px;max-width:340px;' +
    'font:13px/1.5 "Inter",system-ui,sans-serif;color:#212529;display:none;';
  p.innerHTML =
    '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:8px;">' +
    '<b style="color:#0f5132;font-size:14px;">Penerbitan Antrian</b>' +
    '<button id="ext-issue-collapse" style="border:none;background:none;font-size:16px;cursor:pointer;line-height:1;" title="Tutup">–</button>' +
    '</div>' +
    '<div id="ext-issue-status" style="color:#6c757d;font-size:12px;margin-bottom:8px;">Memuat…</div>' +
    // Tab: Aktif (belum selesai) vs Tertunda (sudah dipanggil, belum selesai —
    // kemungkinan terlewat/belum ada di tempat saat dipanggil).
    '<div style="display:flex;gap:6px;margin-bottom:8px;">' +
    '<button id="ext-issue-tab-active" class="ext-issue-tab" style="flex:1;padding:6px;border:1px solid #0f5132;background:#0f5132;color:#fff;border-radius:8px;cursor:pointer;font:inherit;">Aktif</button>' +
    '<button id="ext-issue-tab-pending" class="ext-issue-tab" style="flex:1;padding:6px;border:1px solid #ced4da;background:#fff;color:#495057;border-radius:8px;cursor:pointer;font:inherit;">Tertunda</button>' +
    '</div>' +
    '<input id="ext-issue-search" type="search" placeholder="Cari nama / no antrian…" ' +
    'style="width:100%;box-sizing:border-box;padding:6px 8px;border:1px solid #ced4da;border-radius:8px;font:13px/1.4 inherit;margin-bottom:8px;" />' +
    '<div id="ext-issue-list" style="max-height:240px;overflow:auto;border:1px solid #e9ecef;border-radius:8px;margin-bottom:10px;"></div>' +
    '<div style="display:flex;gap:8px;">' +
    '<button id="ext-issue-refresh" style="flex:1;padding:7px;border:1px solid #0f5132;background:#fff;color:#0f5132;border-radius:8px;cursor:pointer;">Segarkan</button>' +
    '<button id="ext-issue-print" style="flex:1;padding:7px;border:none;background:#0f5132;color:#fff;border-radius:8px;cursor:pointer;">Cetak Sheet A4</button>' +
    '</div>';
  return p;
}

/** Toggle floating: membuka/menutup panel Penerbitan Antrian (bisa dibuka lagi). */
function buildToggle(): HTMLButtonElement {
  const b = document.createElement('button');
  b.id = 'ext-issue-toggle';
  b.textContent = 'Antrian';
  b.title = 'Buka/Tutup panel Penerbitan Antrian';
  b.style.cssText =
    'position:fixed;right:16px;bottom:16px;z-index:100000;padding:10px 18px;border:none;' +
    'border-radius:999px;background:#0f5132;color:#fff;font:700 13px/1 "Inter",system-ui,sans-serif;' +
    'cursor:pointer;box-shadow:0 6px 18px rgba(15,81,50,.4);';
  return b;
}

/** Tab panel saat ini: 'active' (belum selesai) | 'pending' (sudah dipanggil, belum selesai). */
let currentTab: 'active' | 'pending' = 'active';

/** Dispatch klik sintetis ke baris tabel operator → recallDeleg (MAIN world)
 *  menangkap & memanggil panggilUlang native + sinyal localStorage utk display.
 *  Baris tak ada (id hilang/render ulang) → sinyal langsung ke localStorage
 *  (display tetap announce; native tak bisa tanpa baris — acceptable fallback). */
function callRow(id: string, jenis: string, nomor: string, nomorTeks: string): void {
  try {
    localStorage.setItem(
      'ext-afd-recall',
      JSON.stringify({ jenis, nomor, nomorTeks, ts: Date.now() }),
    );
  } catch {
    /* ignore */
  }
  const row = document.querySelector<HTMLTableRowElement>(`tr[data-id="${id}"]`);
  if (row) {
    row.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  }
}

async function renderRows(rows: Array<Record<string, unknown>>): Promise<void> {
  const tickets = await loadTickets(rows);
  // urutan tampil = urutan tiket publik (num naik) — sama dgn urutan WAKTU antrian
  const byNum = [...tickets.entries()].sort((a, b) => a[1].num - b[1].num);
  const list = document.getElementById('ext-issue-list');
  const status = document.getElementById('ext-issue-status');
  if (!list || !status) return;
  // Aktif = belum selesai (ISSUED/WAITING/PROCESSING/READY). Tertunda =
  // sudah dipanggil (CALLED/RECALLED/MISSED) tapi belum selesai — pasien
  // kemungkinan terlewat / belum ada di tempat saat dipanggil.
  const isPending = (st: string): boolean =>
    st === 'CALLED' || st === 'RECALLED' || st === 'MISSED';
  const aktif = byNum.filter(([, t]) => !isPending(t.status));
  const tertunda = byNum.filter(([, t]) => isPending(t.status));
  const urutan = currentTab === 'pending' ? tertunda : aktif;
  if (byNum.length === 0) {
    status.textContent = 'Tidak ada antrian aktif.';
    list.innerHTML = '';
    return;
  }
  status.textContent = `${byNum.length} antrian · ${aktif.length} aktif, ${tertunda.length} tertunda`;
  const name = new Map(rows.map((r) => [String(r.ID), String(r.NAMA_PASIEN ?? '')]));
  const panel = document.getElementById('ext-farmasi-issue');
  const printOneBtn = document.getElementById('ext-issue-printone');
  if (panel) panel.setAttribute('data-rows', JSON.stringify(rows));
  // Realtime filter: input search → substring nama (case-insensitive) ATAU kode
  // publik (T-01/R-05). Kosong → semua. Render ulang dari data mentah tiap
  // ketik — murah (≤ ratusan baris) & sederhana (tanpa state terpisah).
  const q = (document.getElementById('ext-issue-search') as HTMLInputElement | null)?.value
    .trim()
    .toLowerCase();
  const visible = urutan.filter(([id, t]) => {
    if (!q) return true;
    return t.code.toLowerCase().includes(q) || (name.get(id) || '').toLowerCase().includes(q);
  });
  list.innerHTML =
    visible
      .map(([id, t]) => {
        const idx = rows.findIndex((r) => String(r.ID) === id);
        return (
          '<div style="display:flex;justify-content:space-between;align-items:center;gap:6px;padding:4px 6px;">' +
          '<b style="color:#0f5132;min-width:52px;">' +
          t.code +
          '</b>' +
          '<span style="flex:1;color:#495057;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' +
          (name.get(id) || '') +
          '</span>' +
          '<button class="ext-issue-call" data-idx="' +
          idx +
          '" style="flex-shrink:0;padding:3px 8px;border:none;border-radius:8px;background:#0f5132;color:#fff;cursor:pointer;font-size:12px;" title="Panggil pasien ini">📢</button>' +
          '<button class="ext-issue-printone" data-idx="' +
          idx +
          '" style="flex-shrink:0;padding:3px 8px;border:1px solid #0f5132;background:#fff;color:#0f5132;border-radius:8px;cursor:pointer;font-size:12px;" title="Cetak tiket pasien ini">🖨</button>' +
          '</div>'
        );
      })
      .join('') || '<div style="padding:6px;color:#6c757d;">tidak ada yang cocok</div>';
  document
    .getElementById('ext-issue-print')
    ?.setAttribute('data-urutan', JSON.stringify(urutan.map(([, t]) => t.code)));
  document.getElementById('ext-issue-print')?.setAttribute('data-rows', JSON.stringify(rows));
  void printOneBtn;
}

/** Filter kode dalam rentang: prefix 'R-'|'T-', from/sampai (angka, inklusif). */
function inRange(kode: string, prefix: string, from: number, to: number): boolean {
  if (!kode.startsWith(prefix)) return false;
  const n = parseInt(kode.slice(2), 10);
  return Number.isFinite(n) && n >= from && n <= to;
}

/** Cetak sheet A4 (semua / rentang). Popup BUKA SINKRON saat klik (user-gesture)
 *  supaya lolos popup-blocker; isi konten di-fill setelah ticked siap (async). */
function openPrint(rows: Array<Record<string, unknown>>): void {
  // buka popup saat masih dalam user gesture (sebelum await) — mencegah diblokir
  const win = window.open('', '_blank', 'width=900,height=1200');
  if (!win) {
    alert('Popup diblokir — izinkan popup utk mencetak.');
    return;
  }
  void (async () => {
    try {
      const tickets = await loadTickets(rows);
      // urutan tampil = urutan tiket publik
      const urutan = [...tickets.entries()]
        .sort((a, b) => a[1].num - b[1].num)
        .map(([, t]) => t.code);
      const name = new Map(rows.map((r) => [String(r.ID), String(r.NAMA_PASIEN ?? '')]));
      const unit = new Map(rows.map((r) => [String(r.ID), String(r.NAMA_UNIT ?? '')]));

      // Tentukan rentang per jenis via SATU prompt format "dari-sampai" (mis. "1-20"),
      // atau "1" (satu nomor), atau kosong = semua. Jauh lebih simpel bagi petugas.
      const rCodes = urutan.filter((k) => k.startsWith('R-'));
      const tCodes = urutan.filter((k) => k.startsWith('T-'));

      const parseRange = (input: string): { from: number; to: number } => {
        const g = input.match(/(\d+)\s*[-–]\s*(\d+)/); // "6-20" / "6–20"
        if (g) return { from: Math.min(+g[1], +g[2]), to: Math.max(+g[1], +g[2]) };
        const single = input.match(/(\d+)/); // "10" = hanya satu
        if (single) return { from: +single[1], to: +single[1] };
        return { from: 0, to: Infinity }; // kosong = semua
      };

      const rInp = rCodes.length
        ? (window.prompt(
            `Rentang R- (${rCodes[0].slice(2)}–${rCodes[rCodes.length - 1].slice(2)}). Kosong = semua`,
            '',
          ) ?? '')
        : '';
      const tInp = tCodes.length
        ? (window.prompt(
            `Rentang T- (${tCodes[0].slice(2)}–${tCodes[tCodes.length - 1].slice(2)}). Kosong = semua`,
            '',
          ) ?? '')
        : '';
      const r = parseRange(rInp);
      const t = parseRange(tInp);

      const sel = urutan.filter(
        (k) => inRange(k, 'R-', r.from, r.to) || inRange(k, 'T-', t.from, t.to),
      );
      const grid = sel
        .map((k) => {
          const id = [...tickets].find(([, v]) => v.code === k)?.[0] ?? '';
          return (
            '<div style="width:92mm;height:48mm;border:1px solid #000;box-sizing:border-box;padding:8px 10px;text-align:center;page-break-inside:avoid;' +
            'display:flex;flex-direction:column;justify-content:center;">' +
            '<div style="font-size:10px;font-weight:600;text-transform:uppercase;">RSUD H. Abdul Manap</div>' +
            '<div style="font-size:9px;margin-bottom:4px;">Antrian Farmasi</div>' +
            '<div style="font-size:30px;font-weight:700;letter-spacing:1px;">' +
            k +
            '</div>' +
            '<div style="font-size:11px;margin-top:3px;">' +
            (name.get(id) || '') +
            '</div>' +
            '<div style="font-size:9px;color:#333;">' +
            (unit.get(id) || '') +
            '</div>' +
            '</div>'
          );
        })
        .join('');

      // ponytail: CSP extension memblokir <script> inline di about:blank popup →
      // panggil window.print() dari sini (parent) setelah popup selesai ditulis.
      win.document.write(
        '<style>@page{size:A4;margin:5mm;}body{font-family:Arial,Helvetica,sans-serif;}@media print{.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:3mm;}}</style>' +
          '<div class="grid">' +
          (grid || '<div style="padding:20px;color:#666;">Tidak ada nomor dalam rentang.</div>') +
          '</div>',
      );
      win.document.close();
      window.setTimeout(() => {
        try {
          win.focus();
          win.print();
        } catch {
          /* popup ditutup sebelum print — abaikan */
        }
      }, 300);
    } catch {
      win.close();
    }
  })();
}

// Cetak 1 tiket utk SATU pasien (saat pasien datang minta no antrian).
// Popup BUKA SINKRON saat klik (user-gesture) supaya lolos popup-blocker.
function openPrintOne(rows: Array<Record<string, unknown>>, idx: number): void {
  const row = rows[idx];
  if (!row) return;
  const win = window.open('', '_blank', 'width=500,height=700');
  if (!win) {
    alert('Popup diblokir — izinkan popup utk mencetak.');
    return;
  }
  void (async () => {
    try {
      const tickets = await loadTickets(rows);
      const tid = String(row.ID ?? '');
      const t = tickets.get(tid);
      const nomorKe = t?.code ?? '';
      const jenis = /racik/i.test(String(row.JENIS ?? '')) ? 'Racikan' : 'Non Racikan';
      const nama = String(row.NAMA_PASIEN ?? '');
      const unit = String(row.NAMA_UNIT ?? '');
      const body =
        '<div style="width:92mm;height:48mm;border:1px solid #000;box-sizing:border-box;margin:0 auto;' +
        'padding:14px 12px;text-align:center;display:flex;flex-direction:column;justify-content:center;gap:4px;' +
        'font-family:Arial,Helvetica,sans-serif;">' +
        '<div style="font-size:11px;font-weight:600;text-transform:uppercase;">RSUD H. Abdul Manap</div>' +
        '<div style="font-size:10px;">Antrian Farmasi</div>' +
        '<div style="font-size:34px;font-weight:700;letter-spacing:1px;margin:6px 0;">' +
        (nomorKe || '') +
        '</div>' +
        '<div style="font-size:13px;">' +
        nama +
        '</div>' +
        '<div style="font-size:10px;color:#333;">' +
        (jenis + (unit ? ' · ' + unit : '')) +
        '</div>' +
        '<div style="font-size:9px;color:#555;margin-top:6px;">Silakan menunggu panggilan</div>' +
        '</div>';
      // ponytail: CSP extension memblokir <script> inline di about:blank popup →
      // panggil window.print() dari sini (parent) setelah popup selesai ditulis.
      win.document.write(
        '<style>@page{size:A5 landscape;margin:4mm;}body{margin:0;padding:8px;}</style>' + body,
      );
      win.document.close();
      window.setTimeout(() => {
        try {
          win.focus();
          win.print();
        } catch {
          /* popup ditutup sebelum print — abaikan */
        }
      }, 300);
    } catch {
      win.close();
    }
  })();
}

function ensureRecallDelegation(): void {
  if (document.getElementById('ext-afd-recall-deleg')) return;
  const s = document.createElement('script');
  s.id = 'ext-afd-recall-deleg';
  s.src = chrome.runtime.getURL('features/farmasiRecallDeleg.js');
  s.onerror = () => console.error('[FarmasiIssue] recall deleg inject failed');
  (document.head || document.documentElement).appendChild(s);
}

function init(): void {
  // Recall (panggil ulang): native MORBIS bind klik `.status-called` HANYA sekali
  // saat DOMContentLoaded. Setelah recall, contentloader mengganti #isi → baris
  // baru TANPA listener → freeze. Fix: event delegation di document (MAIN world,
  // karena panggilUlang native hidup di MAIN world) — bertahan dari reload #isi.
  // Capture + stopPropagation → listener per-baris native tidak double-fire.
  ensureRecallDelegation();
  const panel = buildPanel();
  const toggle = buildToggle();
  document.body.appendChild(panel);
  document.body.appendChild(toggle);

  const setOpen = (open: boolean): void => {
    panel.style.display = open ? 'block' : 'none';
    toggle.style.display = open ? 'none' : 'block';
  };

  toggle.addEventListener('click', () => setOpen(true));
  panel.querySelector('#ext-issue-collapse')?.addEventListener('click', () => setOpen(false));

  // Tab Aktif/Tertunda: ganti tab → re-render dari data terakhir.
  const setTab = (tab: 'active' | 'pending'): void => {
    currentTab = tab;
    panel.querySelectorAll<HTMLElement>('.ext-issue-tab').forEach((btn) => {
      const active = btn.id === 'ext-issue-tab-' + tab;
      btn.style.background = active ? '#0f5132' : '#fff';
      btn.style.color = active ? '#fff' : '#495057';
      btn.style.borderColor = active ? '#0f5132' : '#ced4da';
    });
    const raw = (panel.getAttribute('data-rows') || '').trim();
    if (!raw) return;
    void renderRows(JSON.parse(raw) as Array<Record<string, unknown>>);
  };
  panel.querySelector('#ext-issue-tab-active')?.addEventListener('click', () => setTab('active'));
  panel.querySelector('#ext-issue-tab-pending')?.addEventListener('click', () => setTab('pending'));

  // Realtime search: filter list dari data terakhir (data-rows) tanpa fetch ulang.
  panel.querySelector('#ext-issue-search')?.addEventListener('input', () => {
    const raw = (panel.getAttribute('data-rows') || '').trim();
    if (!raw) return;
    void renderRows(JSON.parse(raw) as Array<Record<string, unknown>>);
  });

  panel.querySelector('#ext-issue-refresh')?.addEventListener('click', async () => {
    const status = document.getElementById('ext-issue-status');
    if (status) status.textContent = 'Memuat…';
    try {
      await renderRows(await fetchRows());
    } catch (e) {
      if (status) status.textContent = 'Gagal: ' + String((e as Error).message);
    }
  });
  panel.querySelector('#ext-issue-print')?.addEventListener('click', () => {
    const raw = (panel.querySelector('#ext-issue-print')?.getAttribute('data-rows') || '').trim();
    if (!raw) return;
    openPrint(JSON.parse(raw) as Array<Record<string, unknown>>);
  });
  // Klik tombol di baris panel: 🖨 (cetak) atau 📢 (panggil). Panggil = dispatch
  // klik sintetis ke baris tabel operator → farmasiRecallDeleg (MAIN world)
  // menangkap → panggilUlang native + sinyal localStorage utk display/TTS.
  document.getElementById('ext-issue-list')?.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest(
      '.ext-issue-printone, .ext-issue-call',
    ) as HTMLElement | null;
    if (!btn) return;
    const raw = (
      document.getElementById('ext-farmasi-issue')?.getAttribute('data-rows') || ''
    ).trim();
    if (!raw) return;
    const rows = JSON.parse(raw) as Array<Record<string, unknown>>;
    const idx = Number(btn.getAttribute('data-idx') ?? '-1');
    const row = rows[idx];
    if (!row) return;
    if (btn.classList.contains('ext-issue-call')) {
      callRow(String(row.ID ?? ''), String(row.JENIS ?? ''), String(row.NOMOR ?? ''), '');
      return;
    }
    openPrintOne(rows, idx);
  });
  // muat awal (panel mulai tertutup — data di-prepare utk cetak cepat)
  fetchRows()
    .then((rows) => void renderRows(rows))
    .catch((e) => {
      const s = document.getElementById('ext-issue-status');
      if (s) s.textContent = 'Gagal: ' + String((e as Error).message);
    });
}

init();
