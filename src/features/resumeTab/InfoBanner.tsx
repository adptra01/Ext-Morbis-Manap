interface InfoBannerProps {
  data: {
    norm: string;
    pasien: string;
    nama_dokter: string;
  };
}

export function InfoBanner({ data }: InfoBannerProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3 bg-muted/50 border-b border-border text-md-xs shrink-0">
      <div className="flex flex-col">
        <span className="text-muted-foreground uppercase tracking-wider font-semibold text-[9px]">
          No. RM
        </span>
        <span className="text-md-sm font-mono font-medium text-foreground">{data.norm}</span>
      </div>
      <div className="flex flex-col border-l border-border pl-6">
        <span className="text-muted-foreground uppercase tracking-wider font-semibold text-[9px]">
          Nama Pasien
        </span>
        <span className="text-md-sm font-medium text-foreground">{data.pasien}</span>
      </div>
      <div className="flex flex-col border-l border-border pl-6">
        <span className="text-muted-foreground uppercase tracking-wider font-semibold text-[9px]">
          Dokter
        </span>
        <span className="text-md-sm font-medium text-foreground">{data.nama_dokter}</span>
      </div>
    </div>
  );
}
