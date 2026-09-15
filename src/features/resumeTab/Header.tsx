import { X } from 'lucide-react';
import type { PatientInfo } from './types';

// ponytail: title stays required; subtitle kept optional so the existing
// "Reservasi rawat jalan" / "Header" usage doesn't diverge — remove it when
// there's only one entry point naming the modal.
interface HeaderProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  patientInfo?: PatientInfo;
}

export function Header({ title, subtitle, onClose, patientInfo }: HeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-4 bg-primary text-white shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/15 flex-shrink-0">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
        <div className="min-w-0">
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
          {subtitle ? <p className="text-base text-white/80 mt-0.5">{subtitle}</p> : null}
          {patientInfo && (patientInfo.norm || patientInfo.pasien || patientInfo.nama_dokter) && (
            <div className="text-base text-white/70 mt-1">
              RM {patientInfo.norm || '—'} · {patientInfo.pasien || '—'} ·{' '}
              {patientInfo.nama_dokter || '—'}
            </div>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="bg-white/15 hover:bg-white/25 border-none text-white w-12 h-12 rounded-lg text-xl flex items-center justify-center cursor-pointer transition-colors flex-shrink-0"
        aria-label="Tutup modal"
      >
        <X className="size-6" />
      </button>
    </div>
  );
}
