interface InfoBannerProps {
  data: {
    norm: string;
    pasien: string;
    nama_dokter: string;
  };
}

export function InfoBanner({ data }: InfoBannerProps) {
  return (
    <div
      className="rounded-xl p-5 flex flex-wrap items-center gap-x-8 gap-y-3"
      style={{
        background: 'linear-gradient(135deg, #f0ebe4 0%, #f8f6f3 100%)',
        border: '1px solid #e2ddd7',
      }}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#2b5f8a]/10">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#2b5f8a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <div>
          <div className="text-[11px] font-bold text-[#8a7f72] uppercase tracking-wider">RM</div>
          <div className="text-[18px] font-bold text-[#1a1d23] font-mono">{data.norm || '—'}</div>
        </div>
      </div>
      <div className="w-px h-10 bg-[#e2ddd7]" />
      <div>
        <div className="text-[11px] font-bold text-[#8a7f72] uppercase tracking-wider">Pasien</div>
        <div className="text-[18px] font-bold text-[#1a1d23]">{data.pasien || '—'}</div>
      </div>
      <div className="w-px h-10 bg-[#e2ddd7]" />
      <div>
        <div className="text-[11px] font-bold text-[#8a7f72] uppercase tracking-wider">Dokter</div>
        <div className="text-[18px] font-bold text-[#1a1d23]">{data.nama_dokter || '—'}</div>
      </div>
    </div>
  );
}
