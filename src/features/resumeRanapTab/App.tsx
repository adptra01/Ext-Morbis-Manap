import { useState, useCallback, useRef, useEffect, type FormEvent } from 'react';
import type { RanapFormData, IcdItem, SelectOption } from './types';

interface Props {
  data: RanapFormData;
  onSave: (d: RanapFormData) => Promise<void>;
  onClose: () => void;
}

const theme = {
  primary: '#0d9488',
  primaryDark: '#0f766e',
  primaryLight: '#f0fdf4',
  primaryBorder: '#99f6e4',
  text: '#1e293b',
  textMuted: '#64748b',
  border: '#e2e8f0',
  bg: '#f8fafc',
  cardBg: '#ffffff',
  radius: 8,
  font: "'Inter','Segoe UI',system-ui,-apple-system,sans-serif",
  shadow: '0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)',
};

const inputBase: React.CSSProperties = {
  width: '100%',
  padding: '7px 10px',
  border: `1px solid ${theme.border}`,
  borderRadius: theme.radius,
  fontSize: 13,
  fontFamily: theme.font,
  color: theme.text,
  background: theme.cardBg,
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'border-color .15s, box-shadow .15s',
};

function inputFocus(
  e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
) {
  e.target.style.borderColor = theme.primary;
  e.target.style.boxShadow = `0 0 0 3px ${theme.primaryBorder}`;
}
function inputBlur(
  e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
) {
  e.target.style.borderColor = theme.border;
  e.target.style.boxShadow = 'none';
}

function L({ c, req }: { c: string; req?: boolean }) {
  return (
    <label
      style={{
        display: 'block',
        fontSize: 11,
        fontWeight: 600,
        color: theme.textMuted,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        marginBottom: 3,
      }}
    >
      {c}
      {req && <span style={{ color: '#dc2626', marginLeft: 2 }}>*</span>}
    </label>
  );
}

function In({
  v,
  onChange,
  type,
  ...rest
}: {
  v: string;
  onChange: (v: string) => void;
  type?: string;
  [k: string]: unknown;
}) {
  return (
    <input
      value={v}
      onChange={(e) => onChange(e.target.value)}
      onFocus={inputFocus}
      onBlur={inputBlur}
      type={type || 'text'}
      style={inputBase}
      {...rest}
    />
  );
}

function Ta({
  v,
  onChange,
  rows = 3,
}: {
  v: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.max(el.scrollHeight, rows * 20) + 'px';
    }
  }, [v, rows]);
  return (
    <textarea
      ref={ref}
      value={v}
      onChange={(e) => {
        onChange(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
      }}
      onFocus={inputFocus}
      onBlur={inputBlur}
      rows={rows}
      style={{
        ...inputBase,
        fontFamily: theme.font,
        resize: 'vertical',
        minHeight: 50,
        lineHeight: 1.5,
      }}
    />
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: theme.radius,
        marginBottom: 12,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '8px 14px',
          background: theme.primaryLight,
          borderBottom: `1px solid ${theme.primaryBorder}`,
          fontSize: 13,
          fontWeight: 700,
          color: theme.primaryDark,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <span style={{ fontSize: 16 }}>●</span>
        {title}
      </div>
      <div style={{ padding: '12px 14px' }}>{children}</div>
    </div>
  );
}

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
    <select
      value={match ? v : ''}
      onChange={(e) => onChange(e.target.value)}
      onFocus={inputFocus}
      onBlur={inputBlur}
      style={inputBase}
    >
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

const Grid2 = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>{children}</div>
);
const Grid3 = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>{children}</div>
);
const GridAuto = ({ children, min = '100px' }: { children: React.ReactNode; min?: string }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fill, minmax(${min}, 1fr))`,
      gap: 10,
    }}
  >
    {children}
  </div>
);
const Full = ({ children }: { children: React.ReactNode }) => (
  <div style={{ gridColumn: '1 / -1' }}>{children}</div>
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

const smallBtn: React.CSSProperties = {
  padding: '4px 10px',
  fontSize: 11,
  fontWeight: 600,
  borderRadius: 6,
  border: `1px solid ${theme.border}`,
  background: theme.cardBg,
  color: theme.text,
  cursor: 'pointer',
  transition: 'background .15s',
};

const dangerBtn: React.CSSProperties = {
  ...smallBtn,
  border: '1px solid #fecaca',
  color: '#dc2626',
  background: '#fef2f2',
  padding: '2px 8px',
  fontSize: 11,
};

interface Hitt {
  ID: string;
  KODE: string;
  NAMA: string;
}

function IcdAutocomplete({
  kode,
  nama,
  icdType,
  onPick,
}: {
  kode: string;
  nama: string;
  icdType: 'icd10' | 'icd9';
  onPick: (kode: string, nama: string, id: string) => void;
}) {
  const [suggestions, setSuggestions] = useState<Hitt[]>([]);
  const [show, setShow] = useState(false);
  const [kodeInput, setKodeInput] = useState(kode);
  const [namaInput, setNamaInput] = useState(nama);
  const [activeIdx, setActiveIdx] = useState(-1);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
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
        let hits: Hitt[];
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

  const pick = (hit: Hitt) => {
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
        <div style={{ flex: '0 0 35%' }}>
          <input
            value={kodeInput}
            onChange={(e) => handleKodeChange(e.target.value)}
            onKeyDown={handleKey}
            onFocus={inputFocus}
            onBlur={inputBlur}
            placeholder="Kode"
            style={{ ...inputBase, fontSize: 12, fontFamily: 'ui-monospace, monospace' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <input
            value={namaInput}
            onChange={(e) => setNamaInput(e.target.value)}
            onKeyDown={handleKey}
            onFocus={inputFocus}
            onBlur={inputBlur}
            placeholder="Nama diagnosis"
            style={{ ...inputBase, fontSize: 12 }}
          />
        </div>
      </div>
      {show && suggestions.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 100,
            background: theme.cardBg,
            border: `1px solid ${theme.border}`,
            borderRadius: theme.radius,
            maxHeight: 180,
            overflow: 'auto',
            boxShadow: '0 8px 24px rgba(0,0,0,.12)',
            marginTop: 2,
          }}
        >
          {suggestions.map((hit, i) => (
            <div
              key={hit.ID}
              onClick={() => pick(hit)}
              onMouseEnter={() => setActiveIdx(i)}
              style={{
                padding: '5px 10px',
                fontSize: 12,
                cursor: 'pointer',
                background: i === activeIdx ? theme.primaryLight : theme.cardBg,
                borderBottom: `1px solid ${theme.border}`,
                transition: 'background .1s',
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  color: theme.primaryDark,
                  fontFamily: 'ui-monospace, monospace',
                }}
              >
                {hit.KODE}
              </span>
              <span style={{ color: theme.textMuted, marginLeft: 6 }}>{hit.NAMA}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function IcdList({
  items,
  icdType,
  onChange,
  onAdd,
  onRemove,
  label,
  emptyText,
}: {
  items: IcdItem[];
  icdType: 'icd10' | 'icd9';
  onChange: (i: number, item: IcdItem) => void;
  onAdd: () => void;
  onRemove: (i: number) => void;
  label: string;
  emptyText: string;
}) {
  return (
    <div style={{ marginBottom: items.length ? 10 : 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: theme.textMuted,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          {label}
        </span>
        <button type="button" onClick={onAdd} style={smallBtn}>
          + Tambah
        </button>
      </div>
      {items.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <IcdAutocomplete
                  kode={item.kode}
                  nama={item.nama}
                  icdType={icdType}
                  onPick={(kode, nama, id) => onChange(i, { ...item, kode, nama, id })}
                />
              </div>
              <button
                type="button"
                onClick={() => onRemove(i)}
                style={{ ...dangerBtn, marginTop: 1 }}
              >
                Hapus
              </button>
            </div>
          ))}
        </div>
      ) : (
        <span style={{ fontSize: 12, color: theme.textMuted }}>{emptyText}</span>
      )}
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
    <form
      onSubmit={handleSubmit}
      className="ri-modal"
      onClick={(e) => e.stopPropagation()}
      style={{ fontFamily: theme.font }}
    >
      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`,
          color: '#fff',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.01em' }}>
            Resume Rawat Inap
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,.15)',
            border: 'none',
            color: '#fff',
            width: 30,
            height: 30,
            borderRadius: 6,
            fontSize: 16,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background .15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,.25)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,.15)')}
        >
          ✕
        </button>
      </div>

      {/* CONTENT */}
      <div style={{ overflow: 'auto', padding: '14px 18px', flex: 1, background: theme.bg }}>
        {/* Patient banner */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
            alignItems: 'center',
            marginBottom: 14,
            padding: '10px 14px',
            background: theme.cardBg,
            border: `1px solid ${theme.border}`,
            borderRadius: theme.radius,
            fontSize: 12,
            boxShadow: theme.shadow,
          }}
        >
          {[
            { label: 'RM', value: d.norm },
            { label: 'Pasien', value: d.pasien },
            { label: 'Reg', value: d.noreg },
            { label: 'Unit', value: d.unit },
          ].map((item) => (
            <span key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span
                style={{
                  fontWeight: 700,
                  color: theme.primaryDark,
                  fontSize: 11,
                  textTransform: 'uppercase',
                }}
              >
                {item.label}
              </span>
              <span style={{ color: theme.text }}>{item.value}</span>
            </span>
          ))}
        </div>

        {/* Ringkasan */}
        <Card title="Ringkasan">
          <Grid2>
            <div>
              <L c="Dokter Rawat Bersama" />
              <Ta v={d.dokter_bersama} onChange={(v) => p({ dokter_bersama: v })} rows={2} />
            </div>
            <div>
              <L c="Alasan / Indikasi Rawat" />
              <Ta v={d.alasan_rawat} onChange={(v) => p({ alasan_rawat: v })} rows={2} />
            </div>
            <Full>
              <L c="Anamnesa" />
              <Ta v={d.anamnesa} onChange={(v) => p({ anamnesa: v })} rows={4} />
            </Full>
            <Full>
              <L c="Riwayat Penyakit" />
              <Ta v={d.riwayat_penyakit} onChange={(v) => p({ riwayat_penyakit: v })} rows={3} />
            </Full>
          </Grid2>
        </Card>

        {/* Vital Sign */}
        <Card title="Vital Sign">
          <GridAuto min="90px">
            {(['tensi', 'nadi', 'suhu', 'spo2', 'nafas'] as const).map((k) => (
              <div key={k}>
                <L c={k.toUpperCase()} />
                <In v={d[k]} onChange={(v) => p({ [k]: v })} />
              </div>
            ))}
            {(['gcs_e', 'gcs_m', 'gcs_v'] as const).map((k) => (
              <div key={k}>
                <L c={k.replace('_', ' ').toUpperCase()} />
                <In v={d[k]} onChange={(v) => p({ [k]: v })} />
              </div>
            ))}
          </GridAuto>
        </Card>

        {/* Pemeriksaan & Diagnosa */}
        <Card title="Pemeriksaan & Diagnosa">
          <Grid2>
            <Full>
              <L c="Pemeriksaan Fisik" />
              <Ta v={d.fisik_text} onChange={(v) => p({ fisik_text: v })} rows={5} />
            </Full>
            <Full>
              <L c="Hasil Pemeriksaan Diagnostik (Lab, Rontgen, dll)" />
              <Ta v={d.laborat} onChange={(v) => p({ laborat: v })} rows={4} />
            </Full>
            <div>
              <L c="Diagnosa Utama" req />
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
            <Full>
              <L c="Pengobatan" />
              <Ta v={d.terapi_pengobatan} onChange={(v) => p({ terapi_pengobatan: v })} rows={4} />
            </Full>
            <Full>
              <L c="Obat Pulang" />
              <Ta v={d.obat_plg} onChange={(v) => p({ obat_plg: v })} rows={3} />
            </Full>
            <Full>
              <L c="Tindakan" />
              <Ta v={d.tindakan_dua} onChange={(v) => p({ tindakan_dua: v })} rows={4} />
            </Full>
            <div>
              <L c="Jenis Kasus" />
              <Sel v={d.jenis_kasus} onChange={(v) => p({ jenis_kasus: v })} opts={JENIS_KASUS} />
            </div>
          </Grid2>
        </Card>

        {/* ICD */}
        <Card title="ICD">
          <div style={{ marginBottom: 12 }}>
            <L c="Diagnosa Utama" req />
            <IcdAutocomplete
              kode={d.kode_diagnosa_utama}
              nama={d.diagnosa_utama_nama}
              icdType="icd10"
              onPick={(kode, nama, id) =>
                p({ kode_diagnosa_utama: kode, diagnosa_utama_nama: nama, id_diagnosa_utama: id })
              }
            />
          </div>

          <IcdList
            items={d.icd_sekunder}
            icdType="icd10"
            onChange={updateSekunder}
            onAdd={addSekunder}
            onRemove={removeSekunder}
            label="Diagnosa Sekunder"
            emptyText="Belum ada diagnosa sekunder"
          />

          <IcdList
            items={d.icd_tindakan}
            icdType="icd9"
            onChange={updateTindakan}
            onAdd={addTindakan}
            onRemove={removeTindakan}
            label="Tindakan"
            emptyText="Belum ada tindakan"
          />

          <IcdList
            items={d.icd_nosokomial}
            icdType="icd10"
            onChange={updateNosokomial}
            onAdd={addNosokomial}
            onRemove={removeNosokomial}
            label="Infeksi Nosokomial"
            emptyText="Belum ada nosokomial"
          />
        </Card>

        {/* Kondisi Pulang */}
        <Card title="Kondisi Pulang">
          <GridAuto min="100px">
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
            <Full>
              <L c="Catatan Kondisi Pulang" />
              <Ta v={d.catatan_keluar} onChange={(v) => p({ catatan_keluar: v })} rows={2} />
            </Full>
          </GridAuto>
        </Card>

        {/* Keluar */}
        <Card title="Keluar">
          <Grid2>
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
            <Full>
              <L c="Instruksi Pulang" />
              <Ta v={d.instruksi_pulang} onChange={(v) => p({ instruksi_pulang: v })} rows={3} />
            </Full>
            <Full>
              <L c="Penyebab Kematian" />
              <Ta v={d.penyebab_kematian} onChange={(v) => p({ penyebab_kematian: v })} rows={2} />
            </Full>
          </Grid2>
        </Card>
      </div>

      {/* FOOTER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 8,
          padding: '10px 18px',
          borderTop: `1px solid ${theme.border}`,
          alignItems: 'center',
          flexShrink: 0,
          background: theme.cardBg,
        }}
      >
        {error && (
          <div
            style={{
              color: '#dc2626',
              fontSize: 12,
              marginRight: 'auto',
              background: '#fef2f2',
              padding: '4px 10px',
              borderRadius: 6,
              border: '1px solid #fecaca',
            }}
          >
            {error}
          </div>
        )}
        <button
          type="button"
          onClick={onClose}
          style={{
            padding: '7px 18px',
            borderRadius: theme.radius,
            border: `1px solid ${theme.border}`,
            background: theme.cardBg,
            fontSize: 12,
            fontWeight: 600,
            color: theme.text,
            cursor: 'pointer',
            transition: 'background .15s',
          }}
          disabled={saving}
          onMouseEnter={(e) => (e.currentTarget.style.background = theme.bg)}
          onMouseLeave={(e) => (e.currentTarget.style.background = theme.cardBg)}
        >
          Batal
        </button>
        <button
          type="submit"
          style={{
            padding: '7px 22px',
            borderRadius: theme.radius,
            border: 'none',
            background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`,
            color: '#fff',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'opacity .15s',
            opacity: saving ? 0.6 : 1,
          }}
          disabled={saving}
        >
          {saving ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </form>
  );
}
