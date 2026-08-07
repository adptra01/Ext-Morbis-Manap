(function () {
  'use strict';
  const EXT_CLASS = 'ext-batal';
  const INTERVAL_MS = 3000;

  function isEnabled(): boolean {
    return document.documentElement.getAttribute('data-ext-cancel-batal') === '1';
  }

  function getIdFromOnclick(el: Element | null): number[] | null {
    if (!el) return null;
    const onclick = el.getAttribute('onclick');
    if (!onclick) return null;
    const m = onclick.match(/\d+/g);
    return m ? m.map(Number) : null;
  }

  function injectLab(): void {
    document.querySelectorAll<HTMLTableRowElement>('table tbody tr').forEach((row) => {
      if (row.querySelector('.' + EXT_CLASS)) return;
      const editEl = row.querySelector<HTMLElement>(
        '[onclick*="edit_hasil"],[onclick*="cetak_nota"]',
      );
      if (!editEl) return;
      const aksiCell = editEl.closest('td');
      if (!aksiCell) return;
      const params = getIdFromOnclick(editEl);
      if (!params || params.length < 1) return;
      const idLab = String(params[0]);
      const visitCell = row.querySelector('td:nth-child(4)');
      const idVisit = visitCell?.textContent?.trim() || '';
      const btn = document.createElement('button');
      btn.className = 'btn btn-danger btn-sm ' + EXT_CLASS;
      btn.style.marginLeft = '5px';
      btn.innerHTML = '<i class="fa fa-trash"></i> Batal';
      btn.onclick = () => {
        if (typeof (window as any).batal === 'function') {
          (window as any).batal(idLab, idVisit);
        } else {
          alert('Fungsi batal() tidak ditemukan. Refresh halaman dan coba lagi.');
        }
      };
      aksiCell.appendChild(btn);
    });
  }

  function injectRadio(): void {
    document.querySelectorAll<HTMLTableRowElement>('table tbody tr').forEach((row) => {
      if (row.querySelector('.' + EXT_CLASS)) return;
      const editEl = row.querySelector<HTMLElement>(
        '[onclick*="editBacaan"],[onclick*="showAddFotoRadiologi"]',
      );
      if (!editEl) return;
      const aksiCell = editEl.closest('td');
      if (!aksiCell) return;
      const params = getIdFromOnclick(editEl);
      if (!params || params.length < 1) return;
      const id = String(params[0]);
      const idVisit = params.length >= 3 ? String(params[2]) : '';
      const link = document.createElement('a');
      link.className = 'delete ' + EXT_CLASS;
      link.style.cssText = 'cursor:pointer;display:block;color:red;margin-top:2px;';
      link.textContent = 'Batal';
      link.onclick = () => {
        const w = window as any;
        if (typeof w.batal_radiologi === 'function') {
          w.batal_radiologi(id);
        } else if (typeof w.batal_pengajuan === 'function') {
          w.batal_pengajuan(id, idVisit);
        } else {
          alert('Fungsi pembatalan radiologi tidak ditemukan. Refresh halaman dan coba lagi.');
        }
      };
      aksiCell.appendChild(document.createElement('br'));
      aksiCell.appendChild(link);
    });
  }

  function run(): void {
    if (!isEnabled()) return;
    const path = location.pathname;
    if (/\/laboratorium\/input-hasil/.test(path)) {
      injectLab();
    } else if (/\/admisi\/radiologi\/pemeriksaan/.test(path)) {
      injectRadio();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
  setInterval(run, INTERVAL_MS);
})();
