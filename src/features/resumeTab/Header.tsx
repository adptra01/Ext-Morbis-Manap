interface HeaderProps {
  title: string;
  onClose: () => void;
  patientInfo?: { norm: string; pasien: string; nama_dokter: string };
}

export function Header({ title, onClose, patientInfo }: HeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-br from-primary to-primary/80 text-white shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/15">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
        <div>
          <h2 className="text-[15px] font-bold tracking-tight">{title}</h2>
          {patientInfo && (
            <div className="text-[11px] text-white/70 mt-0.5">
              RM {patientInfo.norm || '—'} · {patientInfo.pasien || '—'} ·{' '}
              {patientInfo.nama_dokter || '—'}
            </div>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="bg-white/15 hover:bg-white/25 border-none text-white w-[28px] h-[28px] rounded-md text-sm flex items-center justify-center cursor-pointer transition-colors"
        aria-label="Tutup"
      >
        ✕
      </button>
    </div>
  );
}
