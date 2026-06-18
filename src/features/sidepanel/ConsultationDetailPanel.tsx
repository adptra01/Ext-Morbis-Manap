interface Props {
  data: Record<string, string>;
}

export function ConsultationDetailPanel({ data }: Props) {
  const fields = [
    { label: "No. RM / Nama", value: `${data.noRm ?? ""} — ${data.nama ?? ""}` },
    { label: "Unit Asal → Unit Tujuan", value: `${data.unitAsal ?? "-"} → ${data.unitTujuan ?? "-"}` },
    { label: "Dokter", value: `${data.dokterMengajukan ?? "-"} → ${data.dokterKonsultasi ?? "-"}` },
    { label: "Tanggal Pengajuan", value: data.tanggal ?? "-" },
  ];
  if (data.permintaan) fields.push({ label: "Permintaan Konsultasi", value: data.permintaan });
  if (data.kesan) fields.push({ label: "Kesan", value: data.kesan });
  if (data.anjuran) fields.push({ label: "Anjuran", value: data.anjuran });

  return (
    <div className="space-y-3">
      <h3 className="text-md-sm font-semibold text-foreground">Detail Konsultasi</h3>
      {fields.map((f, i) => (
        <div key={i}>
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{f.label}</label>
          <div className="mt-0.5 text-md-sm text-foreground bg-accent/50 rounded-md px-3 py-2 leading-relaxed whitespace-pre-wrap break-words">
            {f.value}
          </div>
        </div>
      ))}
    </div>
  );
}
