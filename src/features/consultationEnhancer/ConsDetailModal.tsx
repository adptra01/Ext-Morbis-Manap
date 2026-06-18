import React from "react";
import { createPortal } from "react-dom";

interface Props {
  data: Record<string, string>;
  onClose: () => void;
}

export default function ConsDetailModal({ data, onClose }: Props) {
  const fields = [
    { label: "No. RM / Nama", value: `${data.noRm ?? "-"} — ${data.nama ?? "-"}` },
    { label: "Unit Asal → Unit Tujuan", value: `${data.unitAsal ?? "-"} → ${data.unitTujuan ?? "-"}` },
    { label: "Dokter Pengaju → Konsultan", value: `${data.dokterMengajukan ?? "-"} → ${data.dokterKonsultasi ?? "-"}` },
    { label: "Tanggal Pengajuan", value: data.tanggal ?? "-" },
  ];
  if (data.permintaan !== undefined) fields.push({ label: "Permintaan Konsultasi", value: data.permintaan });
  if (data.kesan !== undefined) fields.push({ label: "Kesan", value: data.kesan || "-" });
  if (data.anjuran !== undefined) fields.push({ label: "Anjuran", value: data.anjuran || "-" });

  return createPortal(
    <div
      className="cons-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="cons-modal">
        <div className="cons-header">
          <h2>Detail Konsultasi</h2>
          <button className="cons-close" onClick={onClose}>&times;</button>
        </div>
        <div className="cons-body">
          {fields.map((f, i) => (
            <div key={i} className="cons-field">
              <span className="cons-label">{f.label}</span>
              <span className="cons-value">{f.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
