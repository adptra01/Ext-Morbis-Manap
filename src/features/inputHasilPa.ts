(function () {
  /**
   * inputHasilPa.ts — Replikasi langsung tombol aksi lab di halaman
   * input-hasil-pa. Tidak fetch halaman daftar & tidak butuh bridge:
   * semua id dibaca dari DOM halaman ini, dan URL/fungsi asli dijalankan
   * persis (window.open / POST) seperti tombol di halaman asli.
   *
   * Fungsi asli (diverifikasi di laboratorium-data & view-lab):
   *   cetak_nota(id) → window.open('/admisi/print/nota-lab?id=' + id)
   *   cetakFormPermintaanLab(idHasilLab, idVisit)
   *       → window.open('/admisi/formulir-permintaan-labor/cetak?id=..&id_visit=..&jenis=cetak')
   *   editFormPermintaanLab(idHasilLab, idVisit)
   *       → window.open('/admisi/formulir-permintaan-labor/form?id=..&id_visit=..&jenis=edit')
   *   edit_tanggal(lab, visit, tgl, tgl_periksa)
   *       → modal + POST /laboratorium/control/edit_tanggal
   *         data: lab, id_visit, date, action=edit
   *
   * Sumber id di halaman ini:
   *   id_lab      → query ?id_lab= atau input[name="id_lab"]
   *   id_visit    → input[name="id_visit"]
   *   idHasilLab  → input[name="hasil[1][id]"]
   */

  const $ = (sel: string): HTMLElement | null => document.querySelector(sel);
  const val = (sel: string): string => ($(sel) as HTMLInputElement | null)?.value?.trim() || '';

  function readIds(): { idLab: string; idVisit: string; idHasilLab: string } {
    return {
      idLab:
        new URLSearchParams(window.location.search).get('id_lab') || val('input[name="id_lab"]'),
      idVisit: val('input[name="id_visit"]'),
      idHasilLab: val('input[name="hasil[1][id]"]'),
    };
  }

  function openUrl(path: string): void {
    window.open(path, '_blank', 'width=1000px, height=500px, scrollbars=1');
  }

  /** Modal Edit Tanggal Pengajuan — replikasi edit_tanggal() + update_tanggal_lab(). */
  function showEditTanggalModal(idLab: string, idVisit: string): void {
    const overlay = document.createElement('div');
    overlay.style.cssText =
      'position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:999999;display:flex;align-items:center;justify-content:center;';
    const box = document.createElement('div');
    box.style.cssText =
      'background:#fff;border-radius:8px;padding:16px 18px;min-width:340px;box-shadow:0 8px 30px rgba(0,0,0,.25);font-family:Arial,sans-serif;';

    const title = document.createElement('div');
    title.textContent = 'Edit Tanggal Pengajuan';
    title.style.cssText = 'font-weight:700;font-size:14px;margin-bottom:10px;color:#1e293b;';

    const dateInput = document.createElement('input');
    dateInput.type = 'text';
    dateInput.placeholder = 'dd/mm/yyyy hh:mm:ss';
    dateInput.style.cssText =
      'width:100%;box-sizing:border-box;padding:6px 8px;border:1px solid #cbd5e1;border-radius:6px;font-size:13px;';
    const hint = document.createElement('div');
    hint.textContent = 'Format: 16/09/2026 17:43:55';
    hint.style.cssText = 'font-size:11px;color:#64748b;margin:4px 0 12px;';

    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;gap:8px;justify-content:flex-end;';
    const save = document.createElement('button');
    save.type = 'button';
    save.textContent = 'Edit Tanggal';
    save.style.cssText =
      'padding:5px 14px;border:none;border-radius:6px;font-size:12px;font-weight:600;color:#fff;background:#2563eb;cursor:pointer;';
    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.textContent = 'Batal';
    cancel.style.cssText =
      'padding:5px 14px;border:none;border-radius:6px;font-size:12px;font-weight:600;color:#fff;background:#dc2626;cursor:pointer;';

    save.addEventListener('click', async () => {
      const date = dateInput.value.trim();
      if (!date) {
        alert('Isi tanggal pengajuan baru dulu.');
        return;
      }
      save.disabled = true;
      save.textContent = 'Menyimpan…';
      let ok = false;
      try {
        const res = await fetch('/laboratorium/control/edit_tanggal', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: new URLSearchParams({
            lab: idLab,
            id_visit: idVisit,
            date,
            action: 'edit',
          }).toString(),
        });
        ok = (await res.json()).status == 1;
      } catch {
        ok = false;
      }
      overlay.remove();
      alert(ok ? 'Edit Tanggal Pengajuan berhasil diubah.' : 'Gagal menyimpan tanggal baru.');
      if (ok) window.location.reload();
    });
    cancel.addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });

    btnRow.append(save, cancel);
    box.append(title, dateInput, hint, btnRow);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    dateInput.focus();
  }

  /** Render 4 tombol aksi (persis aksi halaman asli) di fieldset Data Pasien. */
  function renderActions(): void {
    const fieldset = Array.from(document.querySelectorAll('fieldset')).find((fs) =>
      fs.textContent?.includes('Data Pasien'),
    );
    if (!fieldset) return;

    const old = fieldset.querySelector('[data-ext-lab-actions]');
    if (old) old.remove();

    const { idLab, idVisit, idHasilLab } = readIds();
    if (!idLab || !idVisit || !idHasilLab) {
      console.warn('[inputHasilPa] Missing ids', { idLab, idVisit, idHasilLab });
      return;
    }

    const container = document.createElement('div');
    container.setAttribute('data-ext-lab-actions', 'true');
    container.style.cssText = 'display:flex;gap:6px;margin:8px 0;flex-wrap:wrap;';
    const mk = (label: string, bg: string, onClick: () => void): HTMLButtonElement => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = label;
      b.style.cssText =
        `padding:4px 10px;border:none;border-radius:6px;font-size:11px;font-weight:600;` +
        `background:${bg};color:#fff;cursor:pointer;`;
      b.addEventListener('click', onClick);
      return b;
    };

    container.append(
      mk('Edit Tanggal Pengajuan', '#f59e0b', () => showEditTanggalModal(idLab, idVisit)),
      mk('Cetak', '#0891b2', () => openUrl(`/admisi/print/nota-lab?id=${idLab}`)),
      mk('Cetak Form Permintaan Lab', '#2563eb', () =>
        openUrl(
          `/laboratorium/formulir-permintaan-labor/cetak?id=${idHasilLab}&id_visit=${idVisit}&jenis=cetak`,
        ),
      ),
      mk('Edit Form Permintaan Lab', '#7c3aed', () =>
        openUrl(
          `/laboratorium/formulir-permintaan-labor/form?id=${idHasilLab}&id_visit=${idVisit}&jenis=edit`,
        ),
      ),
    );
    fieldset.appendChild(container);
  }

  function injectUi(): void {
    if (!document.documentElement.getAttribute('data-ext-lab-history')) return;
    renderActions();
  }

  const start = performance.now();
  (function poll() {
    if (document.documentElement.getAttribute('data-ext-lab-history')) {
      injectUi();
    } else if (performance.now() - start < 5000) {
      setTimeout(poll, 200);
    }
  })();

  // Handle PJAX navigation
  const origPushState = history.pushState;
  history.pushState = function (...args) {
    origPushState.apply(this, args);
    setTimeout(injectUi, 100);
  };
  window.addEventListener('popstate', () => setTimeout(injectUi, 100));
})();
