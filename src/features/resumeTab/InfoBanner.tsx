import type { PatientInfo } from './types'

interface InfoBannerProps {
  data: PatientInfo
}

export function InfoBanner({ data }: InfoBannerProps) {
  return (
    <div className="md-card p-3 flex flex-wrap gap-x-6 gap-y-1">
      <div>
        <span className="md-label">No. RM</span>
        <span className="text-md-sm font-mono font-medium text-[var(--md-gray-800)]">{data.norm}</span>
      </div>
      <div className="min-w-[200px] flex-1">
        <span className="md-label">Nama Pasien</span>
        <span className="text-md-sm font-medium text-[var(--md-gray-800)]">{data.pasien}</span>
      </div>
      <div className="min-w-[200px] flex-1">
        <span className="md-label">Dokter DPJP</span>
        <span className="text-md-sm font-medium text-[var(--md-gray-800)]">{data.nama_dokter}</span>
      </div>
    </div>
  )
}
