/**
 * cpptReader — tombol "Baca CPPT" di halaman detail/edit resep.
 *
 * Posisi: fieldset "Antrian Farmasi"-like bar di halaman resep
 * (sama konsep penjualanResepAntrian). Klik → modal berisi isian CPPT
 * pasien (rajal/ranap, auto-detect).
 *
 * Role: admin & apotek (gate via background.ts allowedRoles).
 */
import { whenFeatureEnabled } from './shared/featureGate.js';
import '../ui/web/ext-btn';
import { injectGlobalTokens } from '../ui/web/tokens';

whenFeatureEnabled('cpptReader', () => {
  'use strict';

  const urlParams = new URLSearchParams(location.search);
  const idVisit =
    urlParams.get('visit') ||
    urlParams.get('id_visit') ||
    document.querySelector<HTMLInputElement>('#id_visit')?.value?.trim() ||
    '';

  if (!idVisit) return;

  injectGlobalTokens();

  // --- fetch CPPT page & parse ---
  interface CpptEntry {
    waktu: string;
    penginput: string;
    subyektif: string;
    obyektif: string;
    assessment: string;
    planning: string;
    instruksi: string;
  }

  function parseCppt(html: string): CpptEntry[] {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const tables = Array.from(doc.querySelectorAll('table'));
    const cpptTable = tables.find((t) => {
      const h = t.querySelector('tr');
      const txt = (h?.textContent || '').toLowerCase();
      return txt.includes('subyektif') || txt.includes('assessment') || txt.includes('instruksi');
    });
    if (!cpptTable) return [];
    const rows: CpptEntry[] = [];
    cpptTable.querySelectorAll('tbody tr, tr').forEach((tr) => {
      const tds = Array.from(tr.querySelectorAll('td'));
      if (tds.length < 6) return;
      // skip header rows
      if (tds[0].tagName === 'TH') return;
      const txt = (el: Element | null) => (el?.textContent || '').replace(/\s+/g, ' ').trim();
      // columns: No, Aksi, Waktu, S, O, A, P, Instruksi, Penginput (aksi col has buttons)
      // find by index: try 9 cols
      const vals = tds.map(txt);
      // skip if first cell is "No" header
      if (/^no$/i.test(vals[0])) return;
      const entry: CpptEntry = {
        waktu: vals[2] || vals[1] || '',
        penginput: vals[vals.length - 1] || '',
        subyektif: vals[3] || '',
        obyektif: vals[4] || '',
        assessment: vals[5] || '',
        planning: vals[6] || '',
        instruksi: vals[7] || '',
      };
      if (entry.waktu || entry.subyektif || entry.assessment) rows.push(entry);
    });
    return rows;
  }

  async function fetchCppt(isRanap: boolean): Promise<CpptEntry[]> {
    const url = isRanap
      ? '/admisi/detail-rawat-inap/cppt?idVisit=' + encodeURIComponent(idVisit)
      : '/admisi/pelaksanaan_pelayanan/cppt?id_visit=' + encodeURIComponent(idVisit);
    try {
      const resp = await fetch(url, { credentials: 'include', cache: 'no-store' });
      if (!resp.ok) return [];
      const html = await resp.text();
      return parseCppt(html);
    } catch {
      return [];
    }
  }

  // tentukan rajal/ranap: cek mutasi pasien
  function isRanap(): boolean {
    const txt = (document.body?.textContent || '').toUpperCase();
    // cari "RAWAT INAP" di riwayat mutasi
    if (/RIWAYAT\s+MUTASI\s+PASIEN[\s\S]*RAWAT\s+INAP/i.test(txt)) return true;
    if (/UNIT\s+ASAL[\s\S]*RAWAT\s+INAP/i.test(txt)) return true;
    return false;
  }

  // --- modal ---
  function showModal(entries: CpptEntry[], source: string): void {
    const existing = document.getElementById('ext-cppt-reader-modal');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'ext-cppt-reader-modal';
    overlay.style.cssText =
      'position:fixed;inset:0;z-index:2147483600;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,.55);backdrop-filter:blur(2px);padding:16px;';

    const card = document.createElement('div');
    card.style.cssText =
      'width:900px;max-width:100%;max-height:90vh;background:#fff;border-radius:14px;box-shadow:0 20px 50px rgba(16,24,40,.18);overflow:hidden;display:flex;flex-direction:column;font-family:var(--ext-font-family,system-ui);';

    const header = document.createElement('div');
    header.style.cssText =
      'display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid #d0d5dd;';
    header.innerHTML =
      '<h3 style="margin:0;font-size:17px;font-weight:700;">Isian CPPT Pasien (' +
      source +
      ')</h3><button type="button" id="ext-cppt-close" style="border:none;background:#f8fafc;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:20px;">×</button>';

    const body = document.createElement('div');
    body.style.cssText = 'padding:14px 18px;overflow:auto;flex:1;';

    if (!entries.length) {
      body.innerHTML = '<p style="color:#667085;">Tidak ada data CPPT.</p>';
    } else {
      body.innerHTML = entries
        .map(
          (e, i) =>
            '<div style="border:1px solid #d0d5dd;border-radius:8px;padding:10px;margin-bottom:10px;">' +
            '<div style="font-weight:700;margin-bottom:6px;color:#00875a;">#' +
            (i + 1) +
            ' — ' +
            esc(e.waktu) +
            ' <span style="font-weight:400;color:#667085;font-size:12px;">(' +
            esc(e.penginput) +
            ')</span></div>' +
            (e.subyektif
              ? '<div style="margin-bottom:4px;"><b>S:</b> ' + esc(e.subyektif) + '</div>'
              : '') +
            (e.obyektif
              ? '<div style="margin-bottom:4px;"><b>O:</b> ' + esc(e.obyektif) + '</div>'
              : '') +
            (e.assessment
              ? '<div style="margin-bottom:4px;"><b>A:</b> ' + esc(e.assessment) + '</div>'
              : '') +
            (e.planning
              ? '<div style="margin-bottom:4px;"><b>P:</b> ' + esc(e.planning) + '</div>'
              : '') +
            (e.instruksi
              ? '<div style="margin-bottom:4px;"><b>Instruksi:</b> ' + esc(e.instruksi) + '</div>'
              : '') +
            '</div>',
        )
        .join('');
    }

    card.appendChild(header);
    card.appendChild(body);
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    const close = () => overlay.remove();
    overlay.querySelector('#ext-cppt-close')?.addEventListener('click', close);
    overlay.addEventListener('click', (ev) => {
      if (ev.target === overlay) close();
    });
  }

  function esc(s: string): string {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // --- inject button ---
  function addCpptButton(): void {
    if (document.getElementById('ext-cppt-btn')) return;
    const findHost = (): HTMLElement | null => {
      // coba fieldset perhatian / form / panel
      const td = Array.from(
        document.querySelectorAll<HTMLTableCellElement>('td[valign="top"]'),
      ).find((c) => c.querySelector('fieldset#perhatian, fieldset[id="perhatian"]'));
      if (td) {
        const fs = document.createElement('fieldset');
        fs.id = 'ext-cppt-fieldset';
        fs.style.cssText = 'margin-top:6px;';
        fs.innerHTML = '<legend>Baca CPPT</legend>';
        const bar = document.createElement('div');
        bar.id = 'ext-cppt-bar';
        bar.style.cssText = 'display:flex;align-items:center;';
        const btn = document.createElement('button');
        btn.id = 'ext-cppt-btn';
        btn.className = 'btn';
        btn.style.cssText = 'margin:2px 0;background:#2193cf;color:#fff;border-color:#2193cf;';
        btn.textContent = 'Baca CPPT';
        btn.addEventListener('click', onClick);
        bar.appendChild(btn);
        fs.appendChild(bar);
        td.appendChild(fs);
        return bar;
      }
      const form = document.querySelector('form');
      if (form) {
        const bar = document.createElement('div');
        bar.id = 'ext-cppt-bar';
        bar.style.cssText = 'display:flex;align-items:center;margin:6px 0;';
        const btn = document.createElement('button');
        btn.id = 'ext-cppt-btn';
        btn.type = 'button';
        btn.className = 'btn';
        btn.style.cssText = 'background:#2193cf;color:#fff;border-color:#2193cf;';
        btn.textContent = 'Baca CPPT';
        btn.addEventListener('click', onClick);
        bar.appendChild(btn);
        form.prepend(bar);
        return bar;
      }
      // fallback fixed
      if (!document.getElementById('ext-cppt-bar')) {
        const div = document.createElement('div');
        div.id = 'ext-cppt-fieldset';
        div.style.cssText =
          'position:fixed;top:60px;right:12px;z-index:9999;background:#fff;border:1px solid #ccc;border-radius:8px;padding:8px;box-shadow:0 2px 8px rgba(0,0,0,.15);';
        div.innerHTML = '<div id="ext-cppt-bar" style="display:flex;align-items:center;"></div>';
        document.body.appendChild(div);
        const bar = div.querySelector('#ext-cppt-bar') as HTMLElement;
        const btn = document.createElement('button');
        btn.id = 'ext-cppt-btn';
        btn.type = 'button';
        btn.className = 'btn';
        btn.style.cssText = 'background:#2193cf;color:#fff;border-color:#2193cf;';
        btn.textContent = 'Baca CPPT';
        btn.addEventListener('click', onClick);
        bar.appendChild(btn);
        return bar;
      }
      return null;
    };

    const tryInject = (): void => {
      const existing = document.querySelector<HTMLElement>('#ext-cppt-bar');
      const bar = existing || findHost();
      if (!bar) return;
      if (bar.querySelector('#ext-cppt-btn')) return;
      const btn = document.createElement('button');
      btn.id = 'ext-cppt-btn';
      btn.type = 'button';
      btn.className = 'btn';
      btn.style.cssText = 'background:#2193cf;color:#fff;border-color:#2193cf;';
      btn.textContent = 'Baca CPPT';
      btn.addEventListener('click', onClick);
      bar.appendChild(btn);
    };

    async function onClick(): Promise<void> {
      const btn = document.getElementById('ext-cppt-btn') as HTMLButtonElement | null;
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Memuat...';
      }
      const ranap = isRanap();
      const source = ranap ? 'Ranap' : 'Rajal';
      let entries = await fetchCppt(ranap);
      if (!entries.length && !ranap) {
        // coba ranap sebagai fallback
        entries = await fetchCppt(true);
      }
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Baca CPPT';
      }
      showModal(entries, source);
    }

    if (document.readyState === 'loading') {
      document.addEventListener(
        'DOMContentLoaded',
        () => {
          window.setTimeout(tryInject, 500);
          window.setTimeout(tryInject, 2000);
        },
        { once: true },
      );
    } else {
      window.setTimeout(tryInject, 500);
      window.setTimeout(tryInject, 2000);
    }
  }

  // Gate role: admin & apotek saja (di-handle via background allowedRoles, tapi double-check)
  // Feature registration
  const g = (window as unknown as { featureModules?: Record<string, unknown> }).featureModules;
  if (g) {
    g.cpptReader = {
      id: 'cpptReader',
      name: 'Baca CPPT (Resep)',
      description: 'Tombol baca isian CPPT pasien di halaman detail/edit resep',
      match: {
        oneOf: [
          { pathname: '/inventory/resep/penerimaan/detail' },
          { pathname: '/inventory/penjualan-resep-edit/detail' },
        ],
      },
      enabledWhen: () => true,
      run: () => addCpptButton(),
    };
  }
});
