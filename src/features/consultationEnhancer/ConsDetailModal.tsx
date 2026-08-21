import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { ExtModal } from '../../ui/web';

interface Props {
  data: Record<string, string>;
  onClose: () => void;
}

export default function ConsDetailModal({ data, onClose }: Props) {
  const modalRef = useRef<ExtModal>(null);

  const fields = [
    { label: 'No. RM / Nama', value: `${data.noRm ?? '-'} — ${data.nama ?? '-'}` },
    {
      label: 'Unit Asal → Unit Tujuan',
      value: `${data.unitAsal ?? '-'} → ${data.unitTujuan ?? '-'}`,
    },
    {
      label: 'Dokter Pengaju → Konsultan',
      value: `${data.dokterMengajukan ?? '-'} → ${data.dokterKonsultasi ?? '-'}`,
    },
    { label: 'Tanggal Pengajuan', value: data.tanggal ?? '-' },
  ];
  if (data.permintaan !== undefined)
    fields.push({ label: 'Permintaan Konsultasi', value: data.permintaan });
  if (data.kesan !== undefined) fields.push({ label: 'Kesan', value: data.kesan || '-' });
  if (data.anjuran !== undefined) fields.push({ label: 'Anjuran', value: data.anjuran || '-' });

  // ext-modal: buka saat mount, tutup via X/Esc/overlay (ext-cancel)
  useEffect(() => {
    modalRef.current?.open();
    const el = modalRef.current;
    const onCancel = () => onClose();
    el?.addEventListener('ext-cancel', onCancel);
    return () => el?.removeEventListener('ext-cancel', onCancel);
  }, []);

  return createPortal(
    <ext-modal ref={modalRef} variant="info">
      <h3 slot="title">Detail Konsultasi</h3>
      <div className="cons-body">
        {fields.map((f, i) => (
          <div key={i} className="cons-field">
            <span className="cons-label">{f.label}</span>
            <span className="cons-value">{f.value}</span>
          </div>
        ))}
      </div>
      <div slot="footer" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <ext-btn variant="secondary" onClick={onClose}>
          Tutup
        </ext-btn>
      </div>
    </ext-modal>,
    document.body,
  );
}
