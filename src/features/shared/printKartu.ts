import { confirmLegacy } from './batchUtils.js';

/**
 * printKartuAntrian — buka popup kartu antrian format kita (bukan kartu MORBIS
 * UT-xxx). Dipakai oleh penerimaanAntrolCetak (list) & farmasiAntrolShift (detail).
 *
 * Format (sesuai contoh kartu):
 *   RSUD H. Abdul Manap
 *   Antrian Farmasi
 *   [T-01]   ← nomor publik, besar
 *   [NAMA PASIEN]
 *   [Jenis Resep · Unit]
 *   Silakan menunggu panggilan
 */
export interface KartuAntrian {
  nomorResep: string;
  nama: string;
  jenis: string; // "Racikan" | "Non Racikan" | ''
  unit: string; // poliklinik / unit tujuan depo
  tanggal: string;
  code: string;
}

export function printKartuAntrian(data: KartuAntrian): boolean {
  const win = window.open('', '_blank', 'width=400,height=560');
  if (!win) {
    void confirmLegacy({
      title: 'Popup Diblokir',
      message: 'Izinkan popup untuk mencetak.',
      variant: 'warning',
      okLabel: 'OK',
      hideCancel: true,
    });
    return false;
  }
  const jenisLine =
    data.jenis || data.unit
      ? `<div style="font-size:16px;margin-top:2px;">${[data.jenis, data.unit].filter(Boolean).join(' · ')}</div>`
      : '';
  win.document.write(
    '<html><head><title>Antrian Farmasi</title></head>' +
      '<body style="width:320px;padding-top:10px;font-family:Arial,Helvetica,sans-serif;text-align:center;">' +
      '<div style="font-size:16px;font-weight:bold;text-transform:uppercase;">RSUD H. Abdul Manap</div>' +
      '<div style="font-size:14px;margin-top:2px;">Antrian Farmasi</div>' +
      '<div style="margin-top:14px;">' +
      `<div style="font-size:110px;font-weight:900;letter-spacing:-2px;line-height:1;">${data.code}</div>` +
      '</div>' +
      `<div style="font-size:20px;font-weight:bold;margin-top:10px;">${data.nama}</div>` +
      jenisLine +
      `<div style="font-size:11px;margin-top:10px;color:#333;">${data.tanggal}</div>` +
      '<div style="font-size:13px;margin-top:14px;color:#555;">Silakan menunggu panggilan</div>' +
      '</body></html>',
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
  return true;
}
