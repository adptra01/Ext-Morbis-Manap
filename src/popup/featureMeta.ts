/** Metadata ringan untuk fitur di popup. Kunci = kunci fitur asli dari
 *  background.ts; daftar fitur tetap berasal dari config (bukan hardcode di UI). */

export const CATEGORY_IDS = ['all', 'mklaim', 'rmresep', 'labrad', 'antrian', 'lainnya'] as const;
export type CategoryId = (typeof CATEGORY_IDS)[number];

export const CATEGORY_LABELS: Record<CategoryId, string> = {
  all: 'Semua',
  mklaim: 'M-Klaim & Billing',
  rmresep: 'RM & Resep',
  labrad: 'Lab & Rad',
  antrian: 'Antrian & MJKN',
  lainnya: 'Lainnya',
};

/** Pill utama sesuai prototype. 'Lainnya' hanya muncul bila ada fitur tak dikenal. */
export const MAIN_CATEGORIES: readonly CategoryId[] = [
  'all',
  'mklaim',
  'rmresep',
  'labrad',
  'antrian',
];

export interface FeatureMeta {
  category: CategoryId;
  /** Pathname SIMRS (prefix) tempat fitur ini dipakai. Kosong = lintas halaman. */
  urlPatterns: string[];
}

const KLAIM_LIST = ['/v2/m-klaim'];
const KLAIM_DETAIL = ['/v2/m-klaim/detail'];
const RESEP = ['/admisi/pelaksanaan_pelayanan/resep', '/inventory/resep/penerimaan'];
const LAB = ['/laboratorium'];
const ANTRIAN = ['/antrian', '/view-antrian', '/admisi/pelaksanaan_pelayanan/antrian'];
const FARMASI = ['/antrian-farmasi', '/view-call-websocet', '/inventory/resep/penerimaan'];

const META: Record<string, FeatureMeta> = {
  // M-Klaim & Billing
  openDetailInNewTab: { category: 'mklaim', urlPatterns: KLAIM_LIST },
  shortcutButtons: {
    category: 'mklaim',
    urlPatterns: [...KLAIM_LIST, '/admisi/pelaksanaan_pelayanan', '/admisi/detail-rawat-inap'],
  },
  filterPersistence: { category: 'mklaim', urlPatterns: KLAIM_LIST },
  scrollButtons: { category: 'mklaim', urlPatterns: KLAIM_DETAIL },
  batchUpload: { category: 'mklaim', urlPatterns: KLAIM_DETAIL },
  batchDelete: { category: 'mklaim', urlPatterns: KLAIM_DETAIL },
  mKlaimBulkVerif: { category: 'mklaim', urlPatterns: KLAIM_LIST },
  mKlaimPrint: { category: 'mklaim', urlPatterns: KLAIM_DETAIL },
  mKlaimMarks: { category: 'mklaim', urlPatterns: KLAIM_LIST },
  mKlaimVerifLog: { category: 'mklaim', urlPatterns: KLAIM_DETAIL },
  laporanLinks: { category: 'mklaim', urlPatterns: KLAIM_LIST },
  billingFilterPersistence: {
    category: 'mklaim',
    urlPatterns: ['/billing/pembayaran-new/billing-verifikasi'],
  },
  billingAdjustment: { category: 'mklaim', urlPatterns: ['/billing'] },
  billingEditTools: { category: 'mklaim', urlPatterns: KLAIM_DETAIL },
  fetchWatchdog: { category: 'mklaim', urlPatterns: [] },

  // RM & Resep
  resumeValidator: { category: 'rmresep', urlPatterns: KLAIM_DETAIL },
  resumeHistory: { category: 'rmresep', urlPatterns: KLAIM_DETAIL },
  resumeModal: { category: 'rmresep', urlPatterns: KLAIM_DETAIL },
  resumeRanap: { category: 'rmresep', urlPatterns: KLAIM_DETAIL },
  resepTools: { category: 'rmresep', urlPatterns: RESEP },
  fixJasaPelayanan: { category: 'rmresep', urlPatterns: RESEP },
  consultationEnhancer: {
    category: 'rmresep',
    urlPatterns: ['/admisi/pengajuan_konsultasi/konsultasi'],
  },
  doctorFilterPersistence: {
    category: 'rmresep',
    urlPatterns: [
      '/admisi/pelaksanaan_pelayanan',
      '/admisi/pelaksanaan-operasi',
      '/admisi/detail-rawat-inap',
    ],
  },
  telaahResep: { category: 'rmresep', urlPatterns: RESEP },
  resepAsli: { category: 'rmresep', urlPatterns: RESEP },
  cpptReader: { category: 'rmresep', urlPatterns: RESEP },
  detailKunjungan: { category: 'rmresep', urlPatterns: RESEP },
  penerimaanExport: { category: 'rmresep', urlPatterns: RESEP },
  pindahOperasi: {
    category: 'rmresep',
    urlPatterns: ['/admisi/pelaksanaan-operasi', '/admisi/detail-rawat-inap'],
  },
  visiteKonsul: {
    category: 'rmresep',
    urlPatterns: ['/admisi/pelaksanaan_pelayanan/halaman-utama'],
  },

  // Lab & Radiologi
  paLabPrint: { category: 'labrad', urlPatterns: [...LAB, '/radiologi'] },
  labHistory: { category: 'labrad', urlPatterns: LAB },
  cancelBatal: { category: 'labrad', urlPatterns: [...LAB, '/radiologi'] },

  // Antrian & MJKN
  antrianTools: { category: 'antrian', urlPatterns: ANTRIAN },
  antrianFarmasi: { category: 'antrian', urlPatterns: FARMASI },
  antrolKirimOtomatis: { category: 'antrian', urlPatterns: FARMASI },
  ttsServer: { category: 'antrian', urlPatterns: [] },
};

/** Fitur baru belum terdaftar: tampil di "Semua", tidak ikut blok kontekstual
 *  sampai pola URL-nya ditambahkan di sini. */
export function getFeatureMeta(key: string): FeatureMeta {
  return Object.prototype.hasOwnProperty.call(META, key)
    ? META[key]
    : { category: 'all', urlPatterns: [] };
}

/** Cocokkan pathname apa adanya atau sebagai prefix segmen (/a tidak selaras /ab). */
export function matchesPathname(urlPatterns: string[], pathname: string): boolean {
  const path = pathname.replace(/\/+/g, '/').replace(/\/+$/, '') || '/';
  return urlPatterns.some((raw) => {
    const prefix = raw.replace(/\/+/g, '/').replace(/\/+$/, '') || '/';
    return path === prefix || path.startsWith(prefix + '/');
  });
}
