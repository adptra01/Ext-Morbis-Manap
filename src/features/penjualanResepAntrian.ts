/**
 * penjualanResepAntrian
 *
 * Antrian farmasi di halaman detail penjualan resep edit:
 *   /inventory/penjualan-resep-edit/detail?norm=...&visit=...&penjualan=...&id=...
 *
 * Sama spt farmasiAntrolShift tapi target DOM & baca-field berbeda.
 * Aksi antrian pakai shared/antrianActions.
 */
import {
  lookupAntrianAny,
  isResepBatal,
  antrikanResep,
  batalAntrian,
  cetakKartuUlang,
  type AntrianFieldReader,
} from './shared/antrianActions';
import { whenAntrianFarmasiActive } from './shared/farmasiQueueSync';

// Guard anti double-inject
if ((window as unknown as { __extPenjualanAntrian?: boolean }).__extPenjualanAntrian) {
  throw new Error('skip double inject penjualanResepAntrian');
}
(window as unknown as { __extPenjualanAntrian?: boolean }).__extPenjualanAntrian = true;

/** URL params: visit=id_visit, id=id_resep. */
const urlParams = new URLSearchParams(location.search);
const URL_ID_VISIT = urlParams.get('visit') ?? '';
const URL_ID_RESEP = urlParams.get('id') ?? '';

/** Nama pasien: #nama_pasien / #nama / label "Nama Pasien" / header fallback. */
function resolveNamaPasien(): string {
  const fromInput = document.querySelector<HTMLInputElement>('#nama_pasien')?.value?.trim();
  if (fromInput) return fromInput.toUpperCase();
  const fromNama = document.querySelector<HTMLInputElement>('#nama')?.value?.trim();
  if (fromNama) return fromNama.toUpperCase();

  const labeled = Array.from(document.querySelectorAll('th, td, label, strong, b, span'));
  for (const el of labeled) {
    const label = (el.textContent || '').trim();
    if (!/^nama\s*pasien$/i.test(label)) continue;
    const next =
      el.nextElementSibling ||
      el.parentElement?.querySelector('input, select') ||
      el.parentElement?.nextElementSibling;
    const val = (next?.textContent || (next as HTMLInputElement | null)?.value || '').trim();
    if (val) return val.toUpperCase();
  }

  const PAGE_KEYWORDS =
    /(resep|penjualan|antrian|farmasi|penerimaan|pendaftaran|detail|edit|input|rekap|daftar|shift|cetak|pembayaran|penyerahan|racik|racikan|obat|kasir|pilih|aturan|pakai|dosis|jumlah|satuan|harga|total|biaya|unit|depo|kekuatan|tipe|standar|kronis|klaim|inacbgs|batch|aksi|tambah|selesai|hapus|kembali|simpan)/i;
  const headers = Array.from(document.querySelectorAll('h1, h2, h3, .page-title, .card-title'));
  for (const h of headers) {
    if (h.closest('.modal, .modal-header, .modal-body, .dropdown, .dropdown-menu, [role="dialog"]'))
      continue;
    const t = (h.textContent || '').trim();
    if (!t || t.length < 4 || t.length > 60) continue;
    if (PAGE_KEYWORDS.test(t)) continue;
    const words = t.split(/\s+/).filter(Boolean);
    if (words.length < 2) continue;
    return t.toUpperCase();
  }
  return '';
}

/** Tanggal lahir: #tgl_lahir / baris "Tanggal lahir". */
function resolveTglLahir(): string {
  const fromInput = document.querySelector<HTMLInputElement>('#tgl_lahir')?.value?.trim();
  if (fromInput) return fromInput;
  const rows = document.querySelectorAll('tr');
  for (const row of rows) {
    const cells = row.querySelectorAll('td');
    for (let i = 0; i < cells.length - 1; i++) {
      if (/^tanggal\s*lahir$/i.test(cells[i].textContent?.trim() || '') && cells[i + 1]) {
        const val = cells[i + 1].textContent?.trim();
        if (val && val !== ':') return val;
      }
    }
  }
  return '';
}

/** Baca field hidden input by id + fallback name. */
function getField(id: string, fallbackName?: string): string {
  if (id) {
    const v1 = document.querySelector<HTMLInputElement>('#' + id)?.value?.trim() || '';
    if (v1) return v1;
  }
  if (fallbackName) {
    const v2 =
      document
        .querySelector<HTMLInputElement>('input[name="' + fallbackName + '"]')
        ?.value?.trim() || '';
    if (v2) return v2;
  }
  // Fallback ke URL params utk id_resep/id_visit
  if (id === 'id_resep') return URL_ID_RESEP;
  if (id === 'id_visit') return URL_ID_VISIT;
  return '';
}

const reader: AntrianFieldReader = {
  get: getField,
  namaPasien: resolveNamaPasien,
  tglLahir: resolveTglLahir,
};

/** Render bar tombol aksi: ready | issued(code). */
function renderActionBar(state: 'ready' | 'issued', code?: string): void {
  const bar = document.querySelector<HTMLElement>('#ext-antrian-bar');
  if (!bar) return;
  const nomorResep = getField('nomor_resep', 'id_resep');
  if (state === 'issued' && code) {
    bar.innerHTML =
      '<div style="display: flex; flex-direction: column; align-items: flex-start; width: 100%; gap: 6px;">' +
      '<span style="font-size:18px;font-weight:800;color:#198754;line-height:1.3;">' +
      '✓ Sudah antri — ' +
      code +
      '</span>' +
      '<div style="display: flex; gap: 6px;">' +
      '<button id="ext-antrian-cetak" class="btn" style="margin:0;background:#6c757d;color:#fff;border-color:#6c757d;" title="Cetak ulang kartu tanpa mengantrikan lagi">Cetak Kembali</button>' +
      '<button id="ext-antrian-batal" class="btn" style="margin:0;background:#dc3545;color:#fff;border-color:#dc3545;" title="Hapus antrian dari DB — resep bisa di-antrikan ulang">Batal antrian</button>' +
      '</div></div>';
    bar.querySelector('#ext-antrian-cetak')?.addEventListener('click', () => {
      if (!nomorResep) return;
      try {
        cetakKartuUlang(nomorResep, code || '', reader);
      } catch {
        /* abaikan */
      }
    });
    bar.querySelector('#ext-antrian-batal')?.addEventListener('click', async () => {
      if (!confirm('Batalkan antrian ' + code + '? Resep akan keluar dari daftar panggilan.'))
        return;
      const btn = bar.querySelector('#ext-antrian-batal') as HTMLButtonElement | null;
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Membatalkan…';
      }
      const res = await batalAntrian(code || '', nomorResep, reader);
      if (!res.ok) {
        alert('[MORBIS Ext] Gagal membatalkan antrian. Coba lagi.');
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Batal antrian';
        }
        return;
      }
      renderActionBar('ready');
    });
    return;
  }
  // Ready state: tombol racik + tunggal
  bar.innerHTML =
    '<button id="ext-antrian-racik" class="btn" style="margin:2px 6px 2px 0;background:#d97706;color:#fff;border-color:#d97706;" title="Antrikan sebagai obat RACIKAN (nomor R-XX)">Antrikan obat racik</button>' +
    '<button id="ext-antrian-tunggal" class="btn" style="margin:2px 0;background:#2193cf;color:#fff;border-color:#2193cf;" title="Antrikan sebagai obat TUNGGAL (nomor T-XX)">Antrikan obat tunggal</button>';
  const klik = (jenis: 'racik' | 'tunggal'): void => {
    const idVisit = getField('id_visit');
    const nomorResep2 = getField('id_resep', 'nomor_resep');
    if (!idVisit || !nomorResep2) {
      alert('[MORBIS Ext] data resep belum dimuat. Coba lagi.');
      return;
    }
    const btn = document.querySelector(
      jenis === 'racik' ? '#ext-antrian-racik' : '#ext-antrian-tunggal',
    ) as HTMLButtonElement | null;
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Memproses…';
    }
    antrikanResep(idVisit, nomorResep2, jenis, reader)
      .then((c) => renderActionBar('issued', c))
      .catch((e) => alert('[MORBIS Ext] ' + (e?.message || 'gagal mengantrikan')))
      .finally(() => {
        if (btn) {
          btn.disabled = false;
          btn.textContent = jenis === 'racik' ? 'Antrikan obat racik' : 'Antrikan obat tunggal';
        }
      });
  };
  bar.querySelector('#ext-antrian-racik')?.addEventListener('click', () => klik('racik'));
  bar.querySelector('#ext-antrian-tunggal')?.addEventListener('click', () => klik('tunggal'));
}

/** Cari host injeksi di halaman penjualan-resep-edit/detail.
 *  Pola: cari form/detail container, sisipkan fieldset "Antrian Farmasi" di atas tombol Simpan
 *  atau di kolom kanan form. Fallback: inject ke body (fixed top-right) agar tetap terlihat. */
function addAntrianBar(): void {
  const findHost = (): HTMLElement | null => {
    // Coba 1: fieldset perhatian (sama spt penerimaan)
    const td = Array.from(document.querySelectorAll<HTMLTableCellElement>('td[valign="top"]')).find(
      (c) => c.querySelector('fieldset#perhatian, fieldset[id="perhatian"]'),
    );
    if (td) {
      const fieldset = document.createElement('fieldset');
      fieldset.id = 'ext-antrian-fieldset';
      fieldset.style.cssText = 'margin-top:6px;';
      fieldset.innerHTML = '<legend>Antrian Farmasi</legend>';
      const bar = document.createElement('div');
      bar.id = 'ext-antrian-bar';
      bar.style.cssText = 'display:flex;flex-wrap:wrap;align-items:center;';
      fieldset.appendChild(bar);
      td.appendChild(fieldset);
      return bar;
    }

    // Coba 2: form detail utama — cari .card/.panel/form, inject sebelum tombol submit
    const form = document.querySelector('form');
    if (form) {
      const fieldset = document.createElement('fieldset');
      fieldset.id = 'ext-antrian-fieldset';
      fieldset.style.cssText = 'margin-top:6px;';
      fieldset.innerHTML = '<legend>Antrian Farmasi</legend>';
      const bar = document.createElement('div');
      bar.id = 'ext-antrian-bar';
      bar.style.cssText = 'display:flex;flex-wrap:wrap;align-items:center;';
      fieldset.appendChild(bar);
      // Insert di awal form atau sebelum submit
      const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
      if (submitBtn) {
        submitBtn.parentElement?.insertBefore(fieldset, submitBtn);
      } else {
        form.prepend(fieldset);
      }
      return bar;
    }

    // Coba 3: .card-body / .panel-body / .form-horizontal
    const panel = document.querySelector('.card-body, .panel-body, .form-horizontal');
    if (panel) {
      const fieldset = document.createElement('fieldset');
      fieldset.id = 'ext-antrian-fieldset';
      fieldset.style.cssText = 'margin-top:6px;';
      fieldset.innerHTML = '<legend>Antrian Farmasi</legend>';
      const bar = document.createElement('div');
      bar.id = 'ext-antrian-bar';
      bar.style.cssText = 'display:flex;flex-wrap:wrap;align-items:center;';
      fieldset.appendChild(bar);
      panel.prepend(fieldset);
      return bar;
    }

    // Fallback: fixed badge di kanan atas halaman
    if (!document.getElementById('ext-antrian-fieldset')) {
      const div = document.createElement('div');
      div.id = 'ext-antrian-fieldset';
      div.style.cssText =
        'position:fixed;top:60px;right:12px;z-index:9999;background:#fff;border:1px solid #ccc;border-radius:8px;padding:8px;box-shadow:0 2px 8px rgba(0,0,0,.15);';
      div.innerHTML =
        '<legend style="font-weight:700;margin-bottom:4px;display:block;">Antrian Farmasi</legend><div id="ext-antrian-bar" style="display:flex;flex-wrap:wrap;align-items:center;"></div>';
      document.body.appendChild(div);
      return div.querySelector('#ext-antrian-bar') as HTMLElement;
    }
    return null;
  };

  const tryInject = (): void => {
    const existing = document.querySelector<HTMLElement>('#ext-antrian-bar');
    const bar = existing || findHost();
    if (!bar) return;

    const check = (attempt: number): void => {
      const nomorResep = getField('id_resep', 'nomor_resep');
      if (!nomorResep) {
        if (attempt < 10) window.setTimeout(() => check(attempt + 1), 800);
        else renderActionBar('ready');
        return;
      }
      void lookupAntrianAny(reader).then((info) => {
        if (isResepBatal(info?.status)) {
          bar.innerHTML =
            '<span style="color:#b02a37;font-weight:700;">Resep dibatalkan — antrian tidak tersedia</span>';
          return;
        }
        if (info) renderActionBar('issued', info.queue_number);
        else if (attempt < 10) window.setTimeout(() => check(attempt + 1), 800);
        else renderActionBar('ready');
      });
    };
    check(0);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryInject, { once: true });
  } else {
    tryInject();
  }
  window.setTimeout(tryInject, 2000);
  window.setTimeout(tryInject, 5000);
}

// Gate: fitur antrianFarmasi aktif?
whenAntrianFarmasiActive(() => {
  blockAutoAntrol();
  addAntrianBar();
});

/** Blokir POST otomatis `/v2/antrol/search?sub=update_v2` (taskid=6) — sama spt penerimaan. */
function blockAutoAntrol(): void {
  const isAntrolCall = (url: unknown, body: unknown): boolean =>
    String(url ?? '').includes('/v2/antrol/search') &&
    String(url ?? '').includes('sub=update_v2') &&
    String(body ?? '').includes('taskid=6');

  const origOpen = XMLHttpRequest.prototype.open;
  const origSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (
    this: XMLHttpRequest & { __extUrl?: string },
    method: string,
    url: string | URL,
    ...rest: unknown[]
  ) {
    this.__extUrl = String(url);
    return origOpen.apply(this, [method, url, ...rest] as never);
  };
  XMLHttpRequest.prototype.send = function (
    this: XMLHttpRequest & { __extUrl?: string },
    body?: Document | XMLHttpRequestBodyInit | null,
  ) {
    if (isAntrolCall(this.__extUrl, body)) {
      console.log('[MORBIS Ext] antrol otomatis diblokir (pakai tombol Antrian & Cetak)');
      return;
    }
    return origSend.apply(this, [body] as never);
  };
  const origFetch = window.fetch.bind(window);
  window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    if (isAntrolCall(url, init?.body)) {
      console.log('[MORBIS Ext] antrol otomatis diblokir (pakai tombol Antrian & Cetak)');
      return Promise.resolve(new Response(null, { status: 200 }));
    }
    return origFetch(input, init);
  }) as typeof fetch;
}
