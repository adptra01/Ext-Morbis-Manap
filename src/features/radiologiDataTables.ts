/**
 * radiologiDataTables — DataTables for /admisi/radiologi/pemeriksaan
 * Columns: No, Tgl Masuk, No. Registrasi, NO RM, Nama, Unit Asal,
 *          Dokter Pengirim, Asuransi, Golongan, Tindakan Pemeriksaan,
 *          Bacaan Hasil, Hasil Foto, Pegawai Input, Catatan,
 *          Status Pembayaran, Aksi, Aksi
 *
 * ponytail: CDN pattern inherited from original radiologiDataTables.
 */
import { loadDataTablesDeps, scanTables } from './shared/dataTablesLoader';

const LOG = 'RadioDT';

const COLUMNS = [
  { idx: 0, label: 'No', width: '30px', orderable: false },
  { idx: 1, label: 'Tgl Masuk', width: '100px' },
  { idx: 2, label: 'No. Registrasi', width: '100px' },
  { idx: 3, label: 'NO RM', width: '80px' },
  { idx: 4, label: 'Nama', width: '150px', truncate: 28 },
  { idx: 5, label: 'Unit Asal', width: '110px' },
  { idx: 6, label: 'Dokter Pengirim', width: '130px', truncate: 25 },
  { idx: 7, label: 'Asuransi', width: '100px' },
  { idx: 8, label: 'Golongan', width: '80px' },
  { idx: 9, label: 'Tindakan Pemeriksaan', truncate: 35 },
  { idx: 10, label: 'Bacaan Hasil', truncate: 35 },
  { idx: 11, label: 'Hasil Foto', width: '80px', orderable: false },
  { idx: 12, label: 'Pegawai Input', width: '110px', truncate: 20 },
  { idx: 13, label: 'Catatan', truncate: 30 },
  { idx: 14, label: 'Status Pembayaran', width: '100px' },
  { idx: 15, label: 'Aksi', width: '80px', orderable: false },
  { idx: 16, label: 'Aksi', width: '80px', orderable: false },
];

(function () {
  if (!window.location.pathname.includes('admisi/radiologi/pemeriksaan')) return;

  const init = { selector: 'table.tabel', columns: COLUMNS, pageLength: 25, logPrefix: LOG };

  // ponytail: poll flag like resumeTab — init.ts may not have set it yet (race condition)
  let polls = 0;
  const maxPolls = 20;
  (function pollFlag() {
    const flag = document.documentElement.getAttribute('data-ext-radio-datatables');
    if (flag !== '1') {
      if (polls++ < maxPolls) {
        setTimeout(pollFlag, 300);
        return;
      }
      console.log('[' + LOG + '] disabled');
      return;
    }
    console.log('[' + LOG + '] start');
    loadDataTablesDeps(LOG).then(() => scanTables(init));
  })();

  // MutationObserver for AJAX-loaded tables + PJAX tab switches
  let timer: ReturnType<typeof setTimeout> | null = null;
  const obs = new MutationObserver(() => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => scanTables(init), 600);
  });
  obs.observe(document.body, { childList: true, subtree: true });
})();
