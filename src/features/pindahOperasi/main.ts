import { confirmLegacy } from '../shared/batchUtils.js';
import { decideFeatureGate, type FeatureGateConfig } from '../shared/featureGate.js';

/** Endpoint simpan beda per halaman: edit-operasi (pengajuan) vs detail
 *  endoskopi/cathlab (control masing-masing). */
export function saveEndpointFor(pathname: string): string {
  const p = pathname.toLowerCase();
  if (/\/endoskopi\/detail_operasi/.test(p)) return '/admisi/pelaksanaan-operasi/endoskopi/control';
  if (/\/cathlab\/detail_operasi/.test(p)) return '/admisi/pelaksanaan-operasi/cathlab/control';
  return '/admisi/pelaksanaan_pelayanan/control/pengajuan-operasi?opsi=simpan';
}

function pindahOperasi(): void {
  const form = document.querySelector<HTMLFormElement>('#form-data');
  if (!form) {
    void confirmLegacy({
      title: 'Error',
      message: 'Form #form-data tidak ditemukan',
      variant: 'warning',
      okLabel: 'OK',
      hideCancel: true,
    });
    return;
  }

  const targetVisit = prompt('Masukkan ID Visit tujuan:');
  if (!targetVisit || !/^\d+$/.test(targetVisit)) return;

  const targetKunjungan = prompt('Masukkan ID Kunjungan tujuan (opsional):') || '';

  const fd = new FormData(form);
  const params = new URLSearchParams();
  for (const [k, v] of Array.from(fd.entries())) {
    if (k !== 'id_pengajuan') params.append(k, v);
  }

  params.set('id_visit', targetVisit);
  if (targetKunjungan) params.set('id_kunjungan', targetKunjungan);

  const btn = document.querySelector<HTMLInputElement>('#simpan-pindah');
  if (btn) {
    btn.disabled = true;
    btn.value = 'Memproses...';
  }

  fetch(saveEndpointFor(location.pathname), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: params.toString(),
  })
    .then((r) => r.json())
    .then((data) => {
      if (data.status === '200' || data.status === 200) {
        void confirmLegacy({
          title: 'Berhasil',
          message: 'Operasi dipindahkan ke Visit ' + targetVisit,
          variant: 'success',
          okLabel: 'OK',
          hideCancel: true,
        });
        location.reload();
      } else {
        void confirmLegacy({
          title: 'Gagal',
          message: data.message || 'Respon tidak dikenal',
          variant: 'danger',
          okLabel: 'OK',
          hideCancel: true,
        });
      }
    })
    .catch(
      (e) =>
        void confirmLegacy({
          title: 'Error',
          message: e.message,
          variant: 'danger',
          okLabel: 'OK',
          hideCancel: true,
        }),
    )
    .finally(() => {
      if (btn) {
        btn.disabled = false;
        btn.value = 'Pindahkan Operasi';
      }
    });
}

/** Halaman daftar endoskopi/cathlab: tombol "Pindah Status" di baris
 *  "Sudah Dilaksanakan" memanggil showFormUpdateStatus() asli SIMRS supaya
 *  status bisa dikembalikan ke Menunggu/Ditunda (bukan pindah visit). */
export function isStatusListPage(pathname: string): boolean {
  const p = pathname.toLowerCase();
  return p.includes('/pelaksanaan-operasi/endoskopi') || p.includes('/pelaksanaan-operasi/cathlab');
}

function initStatusList(): void {
  const selesai = document.querySelector<HTMLElement>('#tselesai');
  if (!selesai) return;
  let n = 0;
  for (const tr of Array.from(selesai.querySelectorAll('tr'))) {
    const aksi = tr.cells?.[1];
    if (!aksi || aksi.querySelector('.ext-pindah-status')) continue;
    const html = tr.innerHTML;
    const m = html.match(/(?:detail_info|serahTerima|detail)\((\d+)\)/);
    if (!m) continue;
    const id = m[1];
    const pasien = tr.cells?.[4]?.textContent?.trim() ?? '-';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-danger ext-pindah-status';
    btn.textContent = 'Update Status';
    // Sama persis dengan updateStatus() di halaman operasi asli: kembalikan
    // operasi Selesai ke status Belum Dilaksanakan lewat sub=update-status.
    const url = `/admisi/pelaksanaan-operasi/batal-operasi?sub=update-status&type=ajax&id=${id}`;
    const msg = `Apakah Anda yakin mengembalikan operasi pasien ${pasien} ke status Belum Dilaksanakan?`;
    // Panggil showConfirmDialog() global dari library.js lewat listener —
    // nama pasien scraped bisa memuat kutip/newline yang merusak inline onclick.
    btn.addEventListener('click', () => {
      showConfirmDialog(msg, url, id, () => location.reload());
    });
    aksi.appendChild(btn);
    n++;
  }
  if (n) console.log(`[PindahOperasi] Update Status buttons added: ${n}`);
}

async function isAllowed(): Promise<boolean> {
  try {
    const result = await chrome.storage.local.get('extensionConfig');
    const cfg = result.extensionConfig as
      (FeatureGateConfig & { extensionEnabled?: boolean }) | undefined;
    if (!cfg || cfg.extensionEnabled !== true) return false;
    return decideFeatureGate('pindahOperasi', cfg);
  } catch {
    return false; // ISOLATED world: chrome.storage tersedia; gagal baca = jangan jalan
  }
}

function init(): void {
  const loginPaths = ['/login', '/auth', '/signin', '/masuk', '/keluar', '/logout'];
  if (
    loginPaths.some((p) => location.pathname.toLowerCase().includes(p)) ||
    document.querySelectorAll('input[type="password"]').length > 0
  )
    return;
  if (isStatusListPage(location.pathname)) {
    initStatusList();
    return;
  }
  if (document.getElementById('simpan-pindah')) return;

  const simpan = document.querySelector<HTMLElement>(
    '#simpan, #save, input[type="submit"], button[type="submit"]',
  );
  if (!simpan || !simpan.parentNode) return;

  const btn = document.createElement('input');
  btn.type = 'button';
  btn.className = 'btn btn-warning';
  btn.id = 'simpan-pindah';
  btn.value = 'Pindahkan Operasi';
  btn.onclick = pindahOperasi;

  simpan.parentNode.insertBefore(btn, simpan.nextSibling);
  console.log('[PindahOperasi] Button added');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    isAllowed().then((ok) => {
      if (ok) init();
    });
  });
} else {
  isAllowed().then((ok) => {
    if (ok) init();
  });
}
