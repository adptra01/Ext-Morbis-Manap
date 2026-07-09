import { useState, type FormEvent } from 'react';
import type { RanapFormData } from './types';

interface Props {
  data: RanapFormData;
  onSave: (d: RanapFormData) => Promise<void>;
  onClose: () => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '4px 6px',
  border: '1px solid #d1d5db',
  borderRadius: 6,
  fontSize: 12,
  boxSizing: 'border-box',
};
const taStyle: React.CSSProperties = {
  ...inputStyle,
  fontFamily: 'monospace',
  resize: 'vertical',
  minHeight: 50,
};
const L = ({ c }: { c: string }) => (
  <label
    style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 1 }}
  >
    {c}
  </label>
);
const In = ({ v, onChange }: { v: string; onChange: (v: string) => void }) => (
  <input value={v} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
);
const Ta = ({
  v,
  onChange,
  rows = 3,
}: {
  v: string;
  onChange: (v: string) => void;
  rows?: number;
}) => <textarea value={v} onChange={(e) => onChange(e.target.value)} rows={rows} style={taStyle} />;
const Fs = ({ lbl, children }: { lbl: string; children: React.ReactNode }) => (
  <fieldset
    style={{ border: '1px solid #e5e7eb', borderRadius: 8, marginBottom: 10, padding: '6px 10px' }}
  >
    <legend style={{ fontSize: 12, fontWeight: 700, color: '#059669', padding: '0 6px' }}>
      {lbl}
    </legend>
    {children}
  </fieldset>
);

const JENIS_KASUS = [
  'Pilih jenis kasus',
  'Jantung',
  'Bedah Onkologi',
  'Fisioterapi',
  'Okupasi',
  'Gigi',
  'Jiwa',
  'Mata',
  'Paru',
  'Syaraf',
  'Urologi',
  'Rehab Medis',
  'Kulit Kelamin',
  'Bedah Syaraf',
  'Geriatri',
  'Paru - Paru',
  'Psikiatri',
  'Non Bedah',
  'Bedah',
  'Orthopedi',
  'Psikologi',
  'Tht',
  'Anak',
  'Kebidanan dan Kandungan',
  'Penyakit Dalam',
];
const KEADAAN_KELUAR = [
  'Pilih keadaan keluar',
  'Aps / Atas Permintaan Sendiri',
  'Batal Rawat Inap',
  'Belum Sembuh',
  'Dirujuk Lebih Tinggi',
  'Melarikan Diri',
  'Meninggal < 48 Jam',
  'Meninggal > 8 Jam',
  'Meninggal >= 48 jam',
  'Pulang Hidup',
];
const CARA_KELUAR = [
  'Pilih cara keluar',
  'APS/Paksa',
  'Atas Permintaan Sendiri',
  'Atas Persetujuan Dokter',
  'Batal Rawat Inap',
  'Di Rujuk',
  'Diijinkan Pulang',
  'Dirujuk',
  'Dirujuk Lebih Rendah',
  'Dirujuk Puskesmas',
  'Dirujuk ke Dokter',
  'Dirujuk ke Panti',
  'Ke Rumah Sakit',
  'Lain-lain',
  'Masih Menginap',
  'Masuk Rawat Inap',
  'Melarikan Diri',
  'Meninggal',
  'Meninggal Kurang 48 Jam',
  'Meninggal Lebih 48 Jam',
  'Pulang Hidup',
];
const PEMERIKSAAN_LANJUT = [
  'Pilih pemeriksaan lanjut',
  'Bangsal',
  'Kontrol',
  'Lainnya',
  'Poliklinik RS',
  'Puskesmas',
  'RS Lain',
  'Tidak Ada',
];

function Sel({ v, onChange, opts }: { v: string; onChange: (v: string) => void; opts: string[] }) {
  return (
    <select value={v} onChange={(e) => onChange(e.target.value)} style={inputStyle}>
      {opts.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

export function App({ data, onSave, onClose }: Props) {
  const [d, setD] = useState(() => structuredClone(data));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const p = (part: Partial<RanapFormData>) => setD((prev) => ({ ...prev, ...part }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave(d);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="ri-modal" onClick={(e) => e.stopPropagation()}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 20px',
          borderBottom: '1px solid #e5e7eb',
          background: '#059669',
          color: '#fff',
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 700 }}>Resume Rawat Inap</span>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: 20,
            cursor: 'pointer',
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ overflow: 'auto', padding: '12px 16px', flex: 1 }}>
        {/* Patient info */}
        <div
          style={{
            display: 'flex',
            gap: 14,
            flexWrap: 'wrap',
            marginBottom: 10,
            fontSize: 12,
            background: '#f0fdf4',
            padding: '6px 12px',
            borderRadius: 8,
          }}
        >
          <span>
            <b>RM:</b> {d.norm}
          </span>
          <span>
            <b>Pasien:</b> {d.pasien}
          </span>
          <span>
            <b>Reg:</b> {d.noreg}
          </span>
          <span>
            <b>Unit:</b> {d.unit}
          </span>
        </div>

        {/* Ringkasan */}
        <Fs lbl="Ringkasan">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div>
              <L c="Dokter Rawat Bersama" />
              <In v={d.dokter_bersama} onChange={(v) => p({ dokter_bersama: v })} />
            </div>
            <div>
              <L c="Alasan / Indikasi Rawat" />
              <In v={d.alasan_rawat} onChange={(v) => p({ alasan_rawat: v })} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <L c="Anamnesa" />
              <Ta v={d.anamnesa} onChange={(v) => p({ anamnesa: v })} rows={4} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <L c="Riwayat Penyakit" />
              <Ta v={d.riwayat_penyakit} onChange={(v) => p({ riwayat_penyakit: v })} rows={3} />
            </div>
          </div>
        </Fs>

        {/* Vital Sign */}
        <Fs lbl="Vital Sign">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
              gap: 6,
            }}
          >
            {(['tensi', 'nadi', 'suhu', 'spo2', 'nafas'] as const).map((k) => (
              <div key={k}>
                <L c={k.toUpperCase()} />
                <In v={d[k]} onChange={(v) => p({ [k]: v })} />
              </div>
            ))}
            {(['gcs_e', 'gcs_m', 'gcs_v'] as const).map((k) => (
              <div key={k}>
                <L c={k.toUpperCase().replace('_', ' ')} />
                <In v={d[k]} onChange={(v) => p({ [k]: v })} />
              </div>
            ))}
          </div>
        </Fs>

        {/* Pemeriksaan & Diagnosa */}
        <Fs lbl="Pemeriksaan & Diagnosa">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <L c="Pemeriksaan Fisik" />
              <Ta v={d.fisik_text} onChange={(v) => p({ fisik_text: v })} rows={5} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <L c="Hasil Pemeriksaan Diagnostik (Lab, Rontgen, dll)" />
              <Ta v={d.laborat} onChange={(v) => p({ laborat: v })} rows={4} />
            </div>
            <div>
              <L c="Diagnosa Utama" />
              <Ta v={d.diagnosa_primary} onChange={(v) => p({ diagnosa_primary: v })} rows={2} />
            </div>
            <div>
              <L c="Diagnosa Sekunder" />
              <Ta v={d.diagnosa_skunder} onChange={(v) => p({ diagnosa_skunder: v })} rows={2} />
            </div>
            <div>
              <L c="Diagnosa Tindakan" />
              <Ta v={d.diagnosa_tindakan} onChange={(v) => p({ diagnosa_tindakan: v })} rows={2} />
            </div>
            <div>
              <L c="Prosedur / Operasi" />
              <Ta v={d.tindakan} onChange={(v) => p({ tindakan: v })} rows={2} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <L c="Pengobatan" />
              <Ta v={d.terapi_pengobatan} onChange={(v) => p({ terapi_pengobatan: v })} rows={4} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <L c="Obat Pulang" />
              <Ta v={d.obat_plg} onChange={(v) => p({ obat_plg: v })} rows={3} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <L c="Tindakan" />
              <Ta v={d.tindakan_dua} onChange={(v) => p({ tindakan_dua: v })} rows={4} />
            </div>
            <div>
              <L c="Jenis Kasus" />
              <Sel v={d.jenis_kasus} onChange={(v) => p({ jenis_kasus: v })} opts={JENIS_KASUS} />
            </div>
          </div>
        </Fs>

        {/* Kondisi Pulang */}
        <Fs lbl="Kondisi Pulang">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
              gap: 6,
            }}
          >
            {(
              [
                'ku',
                'kes',
                'td_pulang',
                'nadi_pulang',
                'suhu_pulang',
                'rr_pulang',
                'spo2_pulang',
              ] as const
            ).map((k) => (
              <div key={k}>
                <L c={k.replace('_', ' ').toUpperCase()} />
                <In v={d[k]} onChange={(v) => p({ [k]: v })} />
              </div>
            ))}
            <div style={{ gridColumn: '1 / -1' }}>
              <L c="Catatan Kondisi Pulang" />
              <Ta v={d.catatan_keluar} onChange={(v) => p({ catatan_keluar: v })} rows={2} />
            </div>
          </div>
        </Fs>

        {/* Keluar */}
        <Fs lbl="Keluar">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div>
              <L c="Keadaan Keluar" />
              <Sel
                v={d.keadaan_keluar}
                onChange={(v) => p({ keadaan_keluar: v })}
                opts={KEADAAN_KELUAR}
              />
            </div>
            <div>
              <L c="Cara Pulang" />
              <Sel v={d.cara_keluar} onChange={(v) => p({ cara_keluar: v })} opts={CARA_KELUAR} />
            </div>
            <div>
              <L c="Tanggal Keluar" />
              <In v={d.tgl_keluar} onChange={(v) => p({ tgl_keluar: v })} />
            </div>
            <div>
              <L c="Pemeriksaan Lanjutan" />
              <Sel
                v={d.pemeriksaan_lanjut}
                onChange={(v) => p({ pemeriksaan_lanjut: v })}
                opts={PEMERIKSAAN_LANJUT}
              />
            </div>
            <div>
              <L c="Jadwal Kontrol" />
              <In v={d.jadwal_kontrol} onChange={(v) => p({ jadwal_kontrol: v })} />
            </div>
            <div>
              <L c="Kelas" />
              <In v={d.kelas} onChange={(v) => p({ kelas: v })} />
            </div>
            <div>
              <L c="Penyebab Kematian" />
              <Ta v={d.penyebab_kematian} onChange={(v) => p({ penyebab_kematian: v })} rows={2} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <L c="Instruksi Pulang" />
              <Ta v={d.instruksi_pulang} onChange={(v) => p({ instruksi_pulang: v })} rows={3} />
            </div>
          </div>
        </Fs>
      </div>

      {/* footer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 8,
          padding: '8px 16px',
          borderTop: '1px solid #e5e7eb',
          alignItems: 'center',
        }}
      >
        {error && (
          <span style={{ color: '#dc2626', fontSize: 12, marginRight: 'auto' }}>{error}</span>
        )}
        <button
          type="button"
          onClick={onClose}
          style={{
            padding: '6px 16px',
            borderRadius: 6,
            border: '1px solid #d1d5db',
            background: '#fff',
            fontSize: 12,
            cursor: 'pointer',
            fontWeight: 600,
          }}
          disabled={saving}
        >
          Batal
        </button>
        <button
          type="submit"
          style={{
            padding: '6px 16px',
            borderRadius: 6,
            border: '1px solid #059669',
            background: '#059669',
            color: '#fff',
            fontSize: 12,
            cursor: 'pointer',
            fontWeight: 600,
          }}
          disabled={saving}
        >
          {saving ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </form>
  );
}
