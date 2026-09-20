import '../ui/web/ext-btn';

(function () {
  /**
   * inputHasilPa.ts — Replikasi langsung tombol aksi lab di halaman
   * input-hasil-pa. Tidak fetch halaman daftar & tidak butuh bridge:
   * semua id dibaca dari DOM halaman ini, dan URL/fungsi asli dijalankan
   * persis (window.open / POST) seperti tombol di halaman asli.
   *
   * Fungsi asli (diverifikasi live di laboratorium-data page 5, id_visit=203241):
   *   cetak (class .cetak_hasil, attr nolab=id_lab)
   *       → window.open('/laboratorium/print/hasil-lab?id=..&nolab=..')
   *   cetakFormPermintaanLab(idHasilLab, idVisit)
   *       → window.open('/admisi/formulir-permintaan-labor/cetak?id=..&id_visit=..&jenis=cetak')
   *   editFormPermintaanLab(idHasilLab)   // tombol asli hanya 1 arg → id_visit=undefined
   *       → window.open('/admisi/formulir-permintaan-labor/form?id=..&id_visit=undefined&jenis=edit')
   *     (CATATAN: /laboratorium/formulir-permintaan-labor/* → 404; path asli /admisi/*.)
   *   edit_tanggal(lab, visit, tgl, tgl_periksa)
   *       → modal + POST /laboratorium/control/edit_tanggal
   *         data: lab, id_visit, date, action=edit
   *
   * Sumber id di halaman ini:
   *   id_lab      → query ?id_lab= atau input[name="id_lab"]
   *   id_visit    → input[name="id_visit"]
   *   idHasilLab  → PERMINTAAN id (arg #1 cetakFormPermintaanLab/editFormPermintaanLab).
   *     Tidak ada di DOM halaman ini → diambil live dari laboratorium-data?id_visit=..
   *     baris yang nolab == id_lab. Cadangan: input[name="hasil[1][id]"].
   */

  const $ = (sel: string): HTMLElement | null => document.querySelector(sel);
  const val = (sel: string): string => ($(sel) as HTMLInputElement | null)?.value?.trim() || '';

  /** Tanggal pengajuan asli (dari halaman daftar) untuk isi awal modal edit tanggal. */
  let tanggalPengajuan: string | null = null;

  function readIds(): { idLab: string; idVisit: string; idHasilLab: string } {
    return {
      idLab:
        new URLSearchParams(window.location.search).get('id_lab') || val('input[name="id_lab"]'),
      idVisit: val('input[name="id_visit"]'),
      idHasilLab: val('input[name="hasil[1][id]"]'),
    };
  }

  /** Cari data baris lab dari halaman daftar (id permintaan + tanggal pengajuan). */
  async function fetchPermintaanData(
    idLab: string,
    idVisit: string,
  ): Promise<{ id: string; tgl: string | null } | null> {
    try {
      const res = await fetch(
        `/admisi/pelaksanaan_pelayanan/laboratorium-data?id_visit=${idVisit}`,
        {
          credentials: 'same-origin',
        },
      );
      const html = await res.text();
      const rows = html.match(/<tr[^>]*>[\s\S]*?<\/tr>/g) || [];
      const row = rows.find((r) => r.includes(`nolab="${idLab}"`));
      if (!row) return null;
      const id = row.match(/cetakFormPermintaanLab\(\s*(\d+)/)?.[1] || null;
      const tgl = row.match(/edit_tanggal\(\s*\d+\s*,\s*\d+\s*,\s*"([^"]+)"/)?.[1] || null;
      return id ? { id, tgl } : null;
    } catch {
      return null;
    }
  }

  function openUrl(path: string): void {
    window.open(path, '_blank');
  }

  /** Modal Edit Tanggal Pengajuan — modal manual (overlay) sederhana. */
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
    dateInput.type = 'date';
    dateInput.style.cssText =
      'width:100%;box-sizing:border-box;border:1px solid #cbd5e1;border-radius:6px;font-size:13px;padding:10px;';
    const m = tanggalPengajuan?.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
    if (m) dateInput.value = `${m[3]}-${m[2]}-${m[1]}`;
    const hint = document.createElement('div');
    hint.textContent = 'Server menerima dd/mm/yyyy hh:mm:ss — waktu diset otomatis ke 00:00:00.';
    hint.style.cssText = 'font-size:11px;color:#64748b;margin:4px 0 12px;';

    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;justify-content:flex-end;';
    const save = document.createElement('button');
    save.type = 'button';
    save.textContent = 'Edit Tanggal';
    save.style.cssText =
      'margin:18px;padding:15px;border:none;border-radius:6px;font-size:12px;font-weight:600;color:#fff;background:#2563eb;cursor:pointer;';
    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.textContent = 'Batal';
    cancel.style.cssText =
      'margin:18px;padding:15px;border:none;border-radius:6px;font-size:12px;font-weight:600;color:#fff;background:#dc2626;cursor:pointer;';

    save.addEventListener('click', async () => {
      const raw = dateInput.value.trim();
      if (!raw) {
        alert('Isi tanggal pengajuan baru dulu.');
        return;
      }
      const [y, mo, da] = raw.split('-');
      const date = `${da}/${mo}/${y} 00:00:00`;
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

  /** Render 4 tombol aksi (persis aksi halaman asli) di bawah form. */
  function renderActions(): void {
    const fieldset = Array.from(document.querySelectorAll('fieldset')).find((fs) =>
      fs.textContent?.includes('Data Pasien'),
    );
    if (!fieldset) return;

    const old = document.querySelector('[data-ext-lab-actions]');
    if (old) old.remove();

    const { idLab, idVisit, idHasilLab } = readIds();
    if (!idLab || !idVisit || !idHasilLab) {
      console.warn('[inputHasilPa] Missing ids', { idLab, idVisit, idHasilLab });
      return;
    }

    const container = document.createElement('div');
    container.setAttribute('data-ext-lab-actions', 'true');
    container.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;margin:10px 0;';
    const mk = (label: string, variant: string, onClick: () => void): HTMLElement => {
      const b = document.createElement('ext-btn');
      b.setAttribute('variant', variant);
      b.setAttribute('size', 'sm');
      b.textContent = label;
      b.addEventListener('click', onClick);
      return b;
    };

    // id permintaan + tanggal pengajuan belum tentu ada di halaman ini;
    // ambil dari halaman daftar (baris nolab == id_lab)
    let permintaanId = idHasilLab;
    fetchPermintaanData(idLab, idVisit).then((got) => {
      if (got) {
        permintaanId = got.id;
        tanggalPengajuan = got.tgl;
        console.log('[inputHasilPa] permintaan data', { idLab, idVisit, id: got.id, tgl: got.tgl });
      } else {
        console.warn('[inputHasilPa] Baris lab tidak ditemukan di daftar, pakai hasil[1][id].', {
          idLab,
          idVisit,
        });
      }
    });

    container.append(
      mk('Edit Tanggal Pengajuan', 'primary', () => showEditTanggalModal(idLab, idVisit)),
      mk('Cetak', 'info', () =>
        openUrl(`/laboratorium/print/hasil-lab?id=${idLab}&nolab=${idLab}`),
      ),
      mk('Cetak Form Permintaan Lab', 'secondary', () =>
        openUrl(
          `/admisi/formulir-permintaan-labor/cetak?id=${permintaanId}&id_visit=${idVisit}&jenis=cetak`,
        ),
      ),
      // tombol asli panggil editFormPermintaanLab(idHasilLab) — 1 arg → id_visit=undefined
      mk('Edit Form Permintaan Lab', 'secondary', () =>
        openUrl(
          `/admisi/formulir-permintaan-labor/form?id=${permintaanId}&id_visit=undefined&jenis=edit`,
        ),
      ),
      mk('Halaman Asli Pengajuan Lab', 'ghost', () =>
        openUrl(`/admisi/pelaksanaan_pelayanan/laboratorium-data?id_visit=${idVisit}`),
      ),
    );
    const target = Array.from(document.querySelectorAll('fieldset')).find((fs) =>
      fs.textContent?.includes('Tanggal Hasil'),
    );
    if (target) {
      target.after(container);
    } else {
      const form = document.querySelector('form');
      if (form) form.appendChild(container);
      else fieldset.after(container);
    }
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
