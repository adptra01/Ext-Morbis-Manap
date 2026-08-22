/**
 * labDataTables — DataTables for /laboratorium/input-hasil/view-lab
 * Columns: NO, AKSI, NO RM, No Visit, NAMA, TANGGAL PERMINTAAN, STATUS,
 *          UNIT ASAL, DOKTER PENGIRIM, DIAGNOSA, PEMERIKSAAN, PENJAMIN,
 *          PEGAWAI INPUT, Invoice, Dokumen Pasien
 *
 * ponytail: CDN pattern inherited from original labDataTables.
 */
import { loadDataTablesDeps, scanTables } from './shared/dataTablesLoader';

const LOG = 'LabDT';

const COLUMNS = [
  { idx: 0, label: 'NO', width: '30px', orderable: false },
  { idx: 1, label: 'AKSI', width: '110px', orderable: false },
  { idx: 2, label: 'NO RM', width: '80px' },
  { idx: 3, label: 'No Visit', width: '80px' },
  { idx: 4, label: 'NAMA', width: '160px', truncate: 30 },
  { idx: 5, label: 'TANGGAL PERMINTAAN', width: '120px' },
  { idx: 6, label: 'STATUS', width: '90px' },
  { idx: 7, label: 'UNIT ASAL', width: '110px' },
  { idx: 8, label: 'DOKTER PENGIRIM', width: '130px', truncate: 25 },
  { idx: 9, label: 'DIAGNOSA', truncate: 35 },
  { idx: 10, label: 'PEMERIKSAAN', truncate: 35 },
  { idx: 11, label: 'PENJAMIN', width: '100px' },
  { idx: 12, label: 'PEGAWAI INPUT', width: '110px', truncate: 20 },
  { idx: 13, label: 'Invoice', width: '60px', orderable: false },
  { idx: 14, label: 'Dokumen Pasien', width: '90px', orderable: false },
];

(function () {
  if (!window.location.pathname.includes('laboratorium/input-hasil/view-lab')) return;

  const flag = document.documentElement.getAttribute('data-ext-lab-datatables');
  if (flag !== '1') {
    console.log(`[${LOG}] disabled`);
    return;
  }
  console.log(`[${LOG}] start`);

  const init = { selector: 'table.tabel', columns: COLUMNS, pageLength: 25, logPrefix: LOG };

  loadDataTablesDeps(LOG).then(() => scanTables(init));

  // MutationObserver for PJAX tab switches
  let timer: ReturnType<typeof setTimeout> | null = null;
  const obs = new MutationObserver(() => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => scanTables(init), 600);
  });
  obs.observe(document.body, { childList: true, subtree: true });
})();
