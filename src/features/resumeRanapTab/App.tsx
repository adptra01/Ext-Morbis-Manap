import { useState, useCallback, useRef, useEffect, type FormEvent } from 'react';
import type { RanapFormData, IcdItem, SelectOption } from './types';

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
const In = ({
  v,
  onChange,
  ...rest
}: {
  v: string;
  onChange: (v: string) => void;
  [k: string]: unknown;
}) => <input value={v} onChange={(e) => onChange(e.target.value)} style={inputStyle} {...rest} />;
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

const JENIS_KASUS: SelectOption[] = [
  { value: '', label: 'Pilih jenis kasus' },
  { value: '203', label: 'Jantung' },
  { value: '209', label: 'Bedah Onkologi' },
  { value: '215', label: 'Fisioterapi' },
  { value: '220', label: 'Okupasi' },
  { value: '204', label: 'Gigi' },
  { value: '206', label: 'Jiwa' },
  { value: '207', label: 'Mata' },
  { value: '211', label: 'Paru' },
  { value: '212', label: 'Syaraf' },
  { value: '214', label: 'Urologi' },
  { value: '223', label: 'Rehab Medis' },
  { value: '226', label: 'Kulit Kelamin' },
  { value: '216', label: 'Bedah Syaraf' },
  { value: '219', label: 'Geriatri' },
  { value: '221', label: 'Paru - Paru' },
  { value: '217', label: 'Psikiatri' },
  { value: '181', label: 'Kulit Kelamin' },
  { value: '205', label: 'Non Bedah' },
  { value: '208', label: 'Bedah' },
  { value: '218', label: 'Orthopedi' },
  { value: '224', label: 'Psikologi' },
  { value: '225', label: 'Tht' },
  { value: '210', label: 'Anak' },
  { value: '213', label: 'Kebidanan dan Kandungan' },
  { value: '222', label: 'Penyakit Dalam' },
  { value: '228', label: 'Gigi' },
];
const KEADAAN_KELUAR: SelectOption[] = [
  { value: '', label: 'Pilih keadaan keluar' },
  { value: '31', label: 'Aps / Atas Permintaan Sendiri' },
  { value: '73', label: 'Batal Rawat Inap' },
  { value: '30', label: 'Belum Sembuh' },
  { value: '121', label: 'Dirujuk Lebih Tinggi' },
  { value: '181', label: 'Melarikan Diri' },
  { value: '32', label: 'Meninggal < 48 Jam' },
  { value: '74', label: 'Meninggal > 8 Jam' },
  { value: '33', label: 'Meninggal >= 48 jam' },
  { value: '87', label: 'Pulang Hidup' },
];
const CARA_KELUAR: SelectOption[] = [
  { value: '', label: 'Pilih cara keluar' },
  { value: '167', label: 'APS/Paksa' },
  { value: '35', label: 'Atas Permintaan Sendiri' },
  { value: '142', label: 'Atas Persetujuan Dokter' },
  { value: '201', label: 'Batal Rawat Inap' },
  { value: '141', label: 'Di Rujuk' },
  { value: '51', label: 'Diijinkan Pulang' },
  { value: '163', label: 'Dirujuk' },
  { value: '164', label: 'Dirujuk Lebih Rendah' },
  { value: '165', label: 'Dirujuk Puskesmas' },
  { value: '162', label: 'Dirujuk ke Dokter' },
  { value: '166', label: 'Dirujuk ke Panti' },
  { value: '168', label: 'Ke Rumah Sakit' },
  { value: '72', label: 'Lain-lain' },
  { value: '169', label: 'Masih Menginap' },
  { value: '57', label: 'Masuk Rawat Inap' },
  { value: '58', label: 'Melarikan Diri' },
  { value: '143', label: 'Meninggal' },
  { value: '170', label: 'Meninggal Kurang 48 Jam' },
  { value: '171', label: 'Meninggal Lebih 48 Jam' },
  { value: '161', label: 'Pulang Hidup' },
];
const PEMERIKSAAN_LANJUT: SelectOption[] = [
  { value: '', label: 'Pilih pemeriksaan lanjut' },
  { value: '52', label: 'Bangsal' },
  { value: '88', label: 'Kontrol' },
  { value: '11', label: 'Lainnya' },
  { value: '8', label: 'Poliklinik RS' },
  { value: '10', label: 'Puskesmas' },
  { value: '9', label: 'RS Lain' },
  { value: '49', label: 'Tidak Ada' },
];

function Sel({
  v,
  onChange,
  opts,
}: {
  v: string;
  onChange: (v: string) => void;
  opts: SelectOption[];
}) {
  const match = opts.find((o) => o.value === v);
  return (
    <select value={match ? v : ''} onChange={(e) => onChange(e.target.value)} style={inputStyle}>
      {opts.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
      {!match && v ? (
        <option value={v} disabled>
          {v}
        </option>
      ) : null}
    </select>
  );
}

const thStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  color: '#374151',
  padding: '2px 4px',
  borderBottom: '1px solid #d1d5db',
  textAlign: 'left',
};
const tdStyle: React.CSSProperties = { padding: '2px 2px' };
const smallBtn: React.CSSProperties = {
  padding: '2px 8px',
  fontSize: 10,
  borderRadius: 4,
  border: '1px solid #d1d5db',
  background: '#fff',
  cursor: 'pointer',
};

interface IcdAutocompleteProps {
  kode: string;
  nama: string;
  icdType: 'icd10' | 'icd9';
  onPick: (kode: string, nama: string, id: string) => void;
}

interface Hit {
  ID: string;
  KODE: string;
  NAMA: string;
}

function IcdAutocomplete({ kode, nama, icdType, onPick }: IcdAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Hit[]>([]);
  const [show, setShow] = useState(false);
  const [kodeInput, setKodeInput] = useState(kode);
  const [namaInput, setNamaInput] = useState(nama);
  const [activeIdx, setActiveIdx] = useState(-1);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);

  const search = useCallback(
    async (q: string) => {
      if (q.length < 3) {
        setSuggestions([]);
        setShow(false);
        return;
      }
      const opsi = icdType === 'icd9' ? 'clauseDiagnose_icd9' : 'kodeicd10';
      const url = `/rekam-medik/search?opsi=${opsi}&q=${encodeURIComponent(q)}${icdType === 'icd9' ? '&limit=10' : ''}`;
      try {
        const res = await fetch(url, { credentials: 'same-origin' });
        const text = await res.text();
        let hits: Hit[];
        try {
          hits = JSON.parse(text);
        } catch {
          hits = text
            .split('\n')
            .filter(Boolean)
            .map((line) => {
              const parts = line.split('|');
              return { ID: parts[2] || '', KODE: parts[1] || '', NAMA: parts[0] || '' };
            });
        }
        setSuggestions(hits);
        setShow(hits.length > 0);
        setActiveIdx(-1);
      } catch {
        /* ignore */
      }
    },
    [icdType],
  );

  const handleKodeChange = (val: string) => {
    setKodeInput(val);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => search(val), 300);
  };

  const pick = (hit: Hit) => {
    setKodeInput(hit.KODE);
    setNamaInput(hit.NAMA);
    setShow(false);
    onPick(hit.KODE, hit.NAMA, hit.ID);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setShow(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleKey = (e: React.KeyboardEvent) => {
    if (!show) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    }
    if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      pick(suggestions[activeIdx]);
    }
    if (e.key === 'Escape') setShow(false);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <div style={{ display: 'flex', gap: 4 }}>
        <input
          value={kodeInput}
          onChange={(e) => handleKodeChange(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Kode"
          style={{ ...inputStyle, width: '40%', fontSize: 11 }}
        />
        <input
          value={namaInput}
          onChange={(e) => setNamaInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Nama"
          style={{ ...inputStyle, width: '60%', fontSize: 11 }}
        />
      </div>
      {show && suggestions.length > 0 ? (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 100,
            background: '#fff',
            border: '1px solid #d1d5db',
            borderRadius: 4,
            maxHeight: 160,
            overflow: 'auto',
            boxShadow: '0 4px 12px rgba(0,0,0,.15)',
          }}
        >
          {suggestions.map((hit, i) => (
            <div
              key={hit.ID}
              onClick={() => pick(hit)}
              style={{
                padding: '3px 6px',
                fontSize: 11,
                cursor: 'pointer',
                background: i === activeIdx ? '#f0fdf4' : '#fff',
                borderBottom: '1px solid #f3f4f6',
              }}
            >
              <span style={{ fontWeight: 600 }}>{hit.KODE}</span> — {hit.NAMA}
            </div>
          ))}
        </div>
      ) : null}
    </div>
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

  const updateSekunder = (i: number, item: IcdItem) => {
    const arr = [...d.icd_sekunder];
    arr[i] = item;
    p({ icd_sekunder: arr });
  };
  const addSekunder = () =>
    p({ icd_sekunder: [...d.icd_sekunder, { id: '', kode: '', nama: '' }] });
  const removeSekunder = (i: number) =>
    p({ icd_sekunder: d.icd_sekunder.filter((_, idx) => idx !== i) });

  const updateTindakan = (i: number, item: IcdItem) => {
    const arr = [...d.icd_tindakan];
    arr[i] = item;
    p({ icd_tindakan: arr });
  };
  const addTindakan = () =>
    p({ icd_tindakan: [...d.icd_tindakan, { id: '', kode: '', nama: '' }] });
  const removeTindakan = (i: number) =>
    p({ icd_tindakan: d.icd_tindakan.filter((_, idx) => idx !== i) });

  const updateNosokomial = (i: number, item: IcdItem) => {
    const arr = [...d.icd_nosokomial];
    arr[i] = item;
    p({ icd_nosokomial: arr });
  };
  const addNosokomial = () =>
    p({ icd_nosokomial: [...d.icd_nosokomial, { id: '', kode: '', nama: '' }] });
  const removeNosokomial = (i: number) =>
    p({ icd_nosokomial: d.icd_nosokomial.filter((_, idx) => idx !== i) });

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
              <Ta v={d.dokter_bersama} onChange={(v) => p({ dokter_bersama: v })} rows={2} />
            </div>
            <div>
              <L c="Alasan / Indikasi Rawat" />
              <Ta v={d.alasan_rawat} onChange={(v) => p({ alasan_rawat: v })} rows={2} />
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

        {/* ICD */}
        <Fs lbl="ICD">
          {/* Diagnosa Utama */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#374151', width: 120 }}>
                Diagnosa Utama *
              </span>
            </div>
            <IcdAutocomplete
              kode={d.kode_diagnosa_utama}
              nama={d.diagnosa_utama_nama}
              icdType="icd10"
              onPick={(kode, nama, id) =>
                p({ kode_diagnosa_utama: kode, diagnosa_utama_nama: nama, id_diagnosa_utama: id })
              }
            />
          </div>

          {/* Diagnosa Sekunder */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#374151' }}>
                Diagnosa Sekunder
              </span>
              <button type="button" onClick={addSekunder} style={smallBtn}>
                + Tambah
              </button>
            </div>
            {d.icd_sekunder.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Kode</th>
                    <th style={thStyle}>Nama</th>
                    <th style={{ ...thStyle, width: 40 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {d.icd_sekunder.map((item, i) => (
                    <tr key={i}>
                      <td style={tdStyle}>
                        <IcdAutocomplete
                          kode={item.kode}
                          nama={item.nama}
                          icdType="icd10"
                          onPick={(kode, nama, id) =>
                            updateSekunder(i, { ...item, kode, nama, id })
                          }
                        />
                      </td>
                      <td style={tdStyle}>
                        <button type="button" onClick={() => removeSekunder(i)} style={smallBtn}>
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <span style={{ fontSize: 11, color: '#9ca3af' }}>Belum ada diagnosa sekunder</span>
            )}
          </div>

          {/* Tindakan */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#374151' }}>Tindakan</span>
              <button type="button" onClick={addTindakan} style={smallBtn}>
                + Tambah
              </button>
            </div>
            {d.icd_tindakan.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Kode</th>
                    <th style={thStyle}>Nama</th>
                    <th style={{ ...thStyle, width: 40 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {d.icd_tindakan.map((item, i) => (
                    <tr key={i}>
                      <td style={tdStyle}>
                        <IcdAutocomplete
                          kode={item.kode}
                          nama={item.nama}
                          icdType="icd9"
                          onPick={(kode, nama, id) =>
                            updateTindakan(i, { ...item, kode, nama, id })
                          }
                        />
                      </td>
                      <td style={tdStyle}>
                        <button type="button" onClick={() => removeTindakan(i)} style={smallBtn}>
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <span style={{ fontSize: 11, color: '#9ca3af' }}>Belum ada tindakan</span>
            )}
          </div>

          {/* Nosokomial */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#374151' }}>Nosokomial</span>
              <button type="button" onClick={addNosokomial} style={smallBtn}>
                + Tambah
              </button>
            </div>
            {d.icd_nosokomial.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Kode</th>
                    <th style={thStyle}>Nama</th>
                    <th style={{ ...thStyle, width: 40 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {d.icd_nosokomial.map((item, i) => (
                    <tr key={i}>
                      <td style={tdStyle}>
                        <IcdAutocomplete
                          kode={item.kode}
                          nama={item.nama}
                          icdType="icd10"
                          onPick={(kode, nama, id) =>
                            updateNosokomial(i, { ...item, kode, nama, id })
                          }
                        />
                      </td>
                      <td style={tdStyle}>
                        <button type="button" onClick={() => removeNosokomial(i)} style={smallBtn}>
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <span style={{ fontSize: 11, color: '#9ca3af' }}>Belum ada nosokomial</span>
            )}
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
