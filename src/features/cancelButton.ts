import '../ui/web';
import type { ExtModal } from '../ui/web';
import { confirmExt } from '../ui/web';

(function () {
  'use strict';
  const EXT_CLASS = 'ext-batal';
  const INTERVAL_MS = 3000;
  let _runIntervalId: number | null = null;

  /** FIX: stop polling interval agar gak zombie setelah fitur off / page navigate */
  function stopPolling(): void {
    if (_runIntervalId !== null) {
      clearInterval(_runIntervalId);
      _runIntervalId = null;
    }
  }

  function isEnabled(): boolean {
    return document.documentElement.getAttribute('data-ext-cancel-batal') === '1';
  }

  function getIdFromOnclick(el: Element | null): { id: string; idVisit: string } | null {
    if (!el) return null;
    const onclick = el.getAttribute('onclick');
    if (!onclick) return null;
    // id radiologi selalu ada sebagai query param `id=` di URL onclick
    // (mis. ?noRm=50801&status=1&id=53354) — bukan angka pertama yang bisa jadi noRm.
    const mId = onclick.match(/[?&]id=(\d+)/);
    const mVisit = onclick.match(/[?&]id_visit=(\d+)/);
    if (!mId) return null;
    return { id: mId[1], idVisit: mVisit ? mVisit[1] : '' };
  }

  function makeBtn(label: string, variant: string, size = 'sm'): HTMLElement {
    const btn = document.createElement('ext-btn');
    btn.setAttribute('variant', variant);
    btn.setAttribute('size', size);
    btn.setAttribute('class', EXT_CLASS);
    btn.setAttribute('style', 'margin-left:5px;');
    btn.textContent = label;
    return btn;
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
      if (!params) return;
      const idLab = params.id;
      const visitCell = row.querySelector('td:nth-child(4)');
      const idVisit = visitCell?.textContent?.trim() || '';
      const btn = makeBtn('Batal', 'danger');
      btn.onclick = () => {
        if (typeof (window as any).batal === 'function') {
          (window as any).batal(idLab, idVisit);
        } else {
          void confirmExt({
            title: 'Peringatan',
            message: 'Fungsi batal() tidak ditemukan. Refresh halaman dan coba lagi.',
            variant: 'warning',
            okLabel: 'OK',
            hideCancel: true,
          });
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
      if (!params) return;
      const id = params.id;
      const idVisit = params.idVisit;
      const btn = makeBtn('Batal', 'ghost-danger', 'sm');
      btn.onclick = () => {
        const w = window as any;
        if (typeof w.batal_radiologi === 'function') {
          w.batal_radiologi(id);
        } else if (typeof w.batal_pengajuan === 'function') {
          w.batal_pengajuan(id, idVisit);
        } else {
          void confirmExt({
            title: 'Peringatan',
            message: 'Fungsi pembatalan radiologi tidak ditemukan. Refresh halaman dan coba lagi.',
            variant: 'warning',
            okLabel: 'OK',
            hideCancel: true,
          });
        }
      };
      aksiCell.appendChild(document.createElement('br'));
      aksiCell.appendChild(btn);
    });
  }

  /** Modal konfirmasi pakai ext-modal — ganti swal yang tidak konsisten antar halaman. */
  function confirmBatal(title: string, message: string, okLabel: string, onOk: () => void): void {
    // fallback bila halaman tidak punya swal (form-edit) — ext-modal selalu tersedia
    const modal = document.createElement('ext-modal') as ExtModal;
    modal.setAttribute('variant', 'danger');
    modal.setAttribute('ok-label', okLabel);
    modal.setAttribute('cancel-label', 'Tutup');
    const titleEl = document.createElement('h3');
    titleEl.setAttribute('slot', 'title');
    titleEl.textContent = title;
    const body = document.createElement('div');
    body.textContent = message;
    const okBtn = document.createElement('ext-btn');
    okBtn.setAttribute('variant', 'danger');
    okBtn.textContent = okLabel;
    const cancelBtn = document.createElement('ext-btn');
    cancelBtn.setAttribute('variant', 'secondary');
    cancelBtn.textContent = 'Tutup';
    const footer = document.createElement('div');
    footer.setAttribute('slot', 'footer');
    footer.style.display = 'flex';
    footer.style.gap = '12px';
    footer.appendChild(cancelBtn);
    footer.appendChild(okBtn);
    modal.appendChild(titleEl);
    modal.appendChild(body);
    modal.appendChild(footer);
    document.body.appendChild(modal);
    modal.open();

    okBtn.addEventListener('click', () => {
      modal.close();
      modal.remove();
      onOk();
    });
    cancelBtn.addEventListener('click', () => {
      modal.close();
      modal.remove();
    });
    modal.addEventListener('ext-cancel', () => modal.remove());
  }

  function injectRadioForm(): void {
    // Halaman form-edit-bacaan-radiologi tidak memuat fungsi native batal_radiologi,
    // jadi tombol Batal di sini memanggil endpoint langsung (pola sama dgn fungsi native).
    const id = new URLSearchParams(location.search).get('id');
    if (!id) return;
    const group = document.querySelector<HTMLElement>('.field-group');
    if (!group || group.querySelector('.' + EXT_CLASS)) return;
    const btn = document.createElement('ext-btn');
    btn.setAttribute('variant', 'danger');
    btn.setAttribute('size', 'md');
    btn.setAttribute('class', EXT_CLASS);
    btn.setAttribute('style', 'margin-left:8px;');
    btn.textContent = 'Batal Radiologi';
    btn.onclick = () => {
      confirmBatal(
        'Batal Radiologi',
        'Jika Anda melanjutkan pembatalan maka billing pasien akan berubah, pastikan belum ada pembayaran atas pasien ini.',
        'Ya, Batal',
        () => {
          fetch('/routes/radiologi?opsi=batal-radiologi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'idRadiologi=' + encodeURIComponent(id),
          })
            .then((r) => r.json())
            .then((data) => {
              if (data.code === 200) {
                const ok = document.createElement('ext-modal') as ExtModal;
                ok.setAttribute('variant', 'success');
                ok.setAttribute('hide-cancel', '');
                const t = document.createElement('h3');
                t.setAttribute('slot', 'title');
                t.textContent = 'Berhasil';
                const b = document.createElement('div');
                b.textContent = 'Data berhasil dibatalkan';
                const f = document.createElement('div');
                f.setAttribute('slot', 'footer');
                f.appendChild(
                  (() => {
                    const c = document.createElement('ext-btn');
                    c.setAttribute('variant', 'primary');
                    c.textContent = 'OK';
                    c.addEventListener('click', () => {
                      ok.remove();
                    });
                    return c;
                  })(),
                );
                ok.appendChild(t);
                ok.appendChild(b);
                ok.appendChild(f);
                document.body.appendChild(ok);
                ok.open();
                setTimeout(() => location.reload(), 5000);
              } else {
                void confirmExt({
                  title: 'Gagal',
                  message: data.code + ' — ' + data.message,
                  variant: 'danger',
                  okLabel: 'OK',
                  hideCancel: true,
                });
              }
            })
            .catch(() => {
              void confirmExt({
                title: 'Gagal',
                message: 'Terjadi kesalahan, coba lagi',
                variant: 'danger',
                okLabel: 'OK',
                hideCancel: true,
              });
            });
        },
      );
    };
    group.appendChild(btn);
  }

  function run(): void {
    if (!isEnabled()) return;
    const path = location.pathname;
    if (/\/laboratorium\/input-hasil/.test(path)) {
      injectLab();
    } else if (/\/admisi\/radiologi\/pemeriksaan\/form-edit-bacaan-radiologi/.test(path)) {
      injectRadioForm();
    } else if (/\/admisi\/radiologi\/pemeriksaan/.test(path)) {
      injectRadio();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
  // FIX: simpan interval ID agar bisa di-clear saat navigasi / fitur mati
  _runIntervalId = window.setInterval(run, INTERVAL_MS);

  // Cleanup saat navigasi SPA atau close tab
  window.addEventListener('beforeunload', stopPolling);

  /** Helper untuk monitoring perubahan attribute (bila initscript di-toggle ulang) */
  const observer = new MutationObserver(() => {
    if (document.documentElement.getAttribute('data-ext-cancel-batal') !== '1') {
      stopPolling();
    }
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-ext-cancel-batal'],
  });
})();
