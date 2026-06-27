import type { PageType } from '../shared/types.js'

const PAGE_PATTERNS: [string, PageType][] = [
  ['/admisi/pelaksanaan-operasi/detail_operasi', 'SOURCE'],
  ['/admisi/pelaksanaan-operasi/cppt', 'CHILD_CPPT'],
  ['/admisi/pelaksanaan-operasi/cek-list-kesiapan-anastesi', 'CHILD_CEKLIST_ANASTESI'],
  ['/admisi/pelaksanaan-operasi/cek-list-keselamatan', 'CHILD_CEKLIST_KESELAMATAN'],
  ['/admisi/pelaksanaan-operasi/cek-list', 'CHILD_CEKLIST_PRE'],
  ['/admisi/pelaksanaan-operasi/laporan_operasi', 'CHILD_LAPORAN'],
  ['/admisi/pelaksanaan-operasi/bhp', 'CHILD_BHP'],
  ['/admisi/pelaksanaan-operasi/riwayat-penunjang-medis-v2', 'CHILD_PENUNJANG'],
  ['/admisi/pelaksanaan-operasi/penunjang-medis', 'CHILD_PENUNJANG'],
  ['/admisi/pelaksanaan-operasi/surat-persetujuan-operasi', 'CHILD_SURAT_PERSETUJUAN'],
  ['/admisi/pelaksanaan-operasi/informasi-kedokteran', 'CHILD_INFORMASI_KEDOKTERAN'],
  ['/admisi/pelaksanaan-operasi/resume_ri', 'CHILD_RESUME'],
  ['/admisi/detail-rawat-inap/pengajuan-operasi', 'SOURCE_AWAL_RANAP'],
  ['/admisi/pelaksanaan_pelayanan/input-tindakan-oprasi', 'SOURCE_AWAL_RAJAL'],
  ['/admisi/informasi/data-kunjungan', 'TARGET_LIST'],
  ['/admisi/edit-kunjungan', 'EDIT_KUNJUNGAN'],
  ['/billing/billing', 'BILLING_SOURCE'],
  ['/admisi/detail-rawat-inap/new-pemeriksaan-lab', 'CHILD_LAB'],
  ['/admisi/detail-rawat-inap/radiologi', 'CHILD_LAB'],
]

export function normalizePath(path: string): string {
  const n = path.replace(/\/+/g, '/').replace(/\/+$/, '')
  return n.startsWith('/') ? n : '/' + n
}

export function detectPageType(): PageType {
  const path = normalizePath(window.location.pathname)
  for (const [prefix, type] of PAGE_PATTERNS) {
    if (path.startsWith(prefix)) return type
  }
  return 'UNKNOWN'
}

export function getPageTypeLabel(type: PageType): string {
  const labels: Record<PageType, string> = {
    SOURCE: 'Detail Operasi',
    SOURCE_AWAL_RANAP: 'Pengajuan Operasi Ranap',
    SOURCE_AWAL_RAJAL: 'Input Tindakan Operasi Rajal',
    TARGET_LIST: 'Data Kunjungan',
    BILLING_SOURCE: 'Billing',
    EDIT_KUNJUNGAN: 'Edit Kunjungan',
    CHILD_CPPT: 'CPPT',
    CHILD_CEKLIST_PRE: 'Cek List Pre Operasi',
    CHILD_CEKLIST_ANASTESI: 'Cek List Anastesi',
    CHILD_CEKLIST_KESELAMATAN: 'Cek List Keselamatan',
    CHILD_PENUNJANG: 'Penunjang Medis',
    CHILD_LAB: 'Laboratorium',
    CHILD_RESUME: 'Resume Operasi',
    CHILD_SURAT_PERSETUJUAN: 'Surat Persetujuan',
    CHILD_INFORMASI_KEDOKTERAN: 'Informasi Kedokteran',
    CHILD_BHP: 'BHP',
    CHILD_LAPORAN: 'Laporan Operasi',
    UNKNOWN: 'Tidak Diketahui',
  }
  return labels[type]
}
