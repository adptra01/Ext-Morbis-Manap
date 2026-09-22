import { useState, useCallback, useRef, useEffect, type FormEvent } from 'react';
import type { RanapFormData, IcdItem, SelectOption } from './types';
import { openHistoryModal } from '../shared/resumeHistory.js';
import { snapToRanapForm } from './snap.js';
import { Input } from '../../ui/components/input';
import { Textarea } from '../../ui/components/Textarea';
import { Label } from '../../ui/components/Label';
import { Card } from '../../ui/components/Card';
import { Grid, Full } from '../../ui/components/Grid';
import { SelectNative } from '../../ui/components/SelectNative';
import { Button } from '../../ui/components/button';
import { Badge } from '../../ui/components/Badge';

interface Props {
  data: RanapFormData;
  onSave: (d: RanapFormData) => Promise<void>;
  onClose: () => void;
}

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

interface Hitt {
  ID: string;
  KODE: string;
  NAMA: string;
}

// ponytail: ICD autocomplete stays local to Ranap App — shared extraction would force a new seam across the Rajal/Ranap mounts for little gain. Deduplicate only when a third consumer appears.
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
  const activeRef = useRef<HTMLDivElement>(null);
  const [hitPos, setHitPos] = useState({ top: 0, left: 0, width: 0 });

  // Keep the highlighted option in view while navigating with arrow keys.
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

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
        if (containerRef.current) {
          const r = containerRef.current.getBoundingClientRect();
          setHitPos({ top: r.top, left: r.left, width: r.width });
        }
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
    // Shadow DOM retargets e.target to the host for document-level listeners,
    // so containerRef.contains() is always false inside the modal → list closes
    // on mousedown before the option's click. Listen on the shadow root instead
    // (real targets, no retargeting); keep document listener for outside clicks.
    const root = containerRef.current?.getRootNode?.() ?? document;
    const handleInside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShow(false);
      }
    };
    // ponytail: getRootNode may be Document when modal falls back to light DOM —
    // fine, same behavior, no retargeting there.
    root.addEventListener('mousedown', handleInside as EventListener);
    const handleOutside = (e: MouseEvent) => {
      const host = document.getElementById('morbis-manap-root');
      if (host && (e.target === host || host.contains(e.target as Node))) return;
      setShow(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => {
      root.removeEventListener('mousedown', handleInside as EventListener);
      document.removeEventListener('mousedown', handleOutside);
    };
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
    <div ref={containerRef} className="relative flex-1 min-w-0">
      <div className="flex gap-2">
        <div className="flex-1 min-w-0">
          <Input
            value={namaInput}
            onChange={(e) => setNamaInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Nama"
            className="text-base font-medium"
            aria-label="Nama diagnosis"
          />
        </div>
        <div className="w-28 shrink-0">
          <Input
            value={kodeInput}
            onChange={(e) => handleKodeChange(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Kode"
            className="text-base font-mono font-semibold"
            aria-label="Kode ICD"
          />
        </div>
      </div>
      {show && suggestions.length > 0 && (
        <div
          className="fixed z-[2147483647] bg-popover border-2 border-border rounded-xl max-h-[280px] overflow-auto shadow-xl"
          style={{ top: hitPos.top, left: hitPos.left, width: hitPos.width }}
          role="listbox"
        >
          {suggestions.map((hit, i) => {
            const active = i === activeIdx;
            return (
              <div
                key={hit.ID}
                ref={active ? activeRef : undefined}
                onClick={() => pick(hit)}
                onMouseEnter={() => setActiveIdx(i)}
                role="option"
                aria-selected={active}
                className={`px-4 py-3 text-base cursor-pointer border-b last:border-b-0 border-border transition-colors ${
                  active ? 'bg-primary text-primary-foreground' : 'bg-popover hover:bg-accent'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`font-mono text-base font-bold ${active ? 'text-primary-foreground' : 'text-primary'}`}
                  >
                    {hit.KODE}
                  </span>
                  {active && (
                    <span className="text-primary-foreground font-bold" aria-hidden="true">
                      ✓
                    </span>
                  )}
                </div>
                <div
                  className={`${active ? 'text-primary-foreground' : 'text-foreground'} text-base font-medium leading-snug mt-1`}
                >
                  {hit.NAMA}
                </div>
              </div>
            );
          })}
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
    <div className={items.length ? 'mb-3' : ''}>
      <div className="flex items-center gap-2.5 mb-2">
        <span className="text-base font-bold text-foreground tracking-tight">{label}</span>
        <span className="text-base text-muted-foreground">({items.length} item)</span>
        <Button variant="default" size="default" type="button" onClick={onAdd} className="ml-auto">
          ＋{' '}
          {label.includes('Sekunder')
            ? 'Diagnosa'
            : label.includes('Tindakan')
              ? 'Tindakan'
              : 'Item'}
        </Button>
      </div>
      {items.length > 0 ? (
        <>
          <div className="flex gap-2 text-base font-bold text-muted-foreground px-1 mb-1">
            <span className="flex-1">Nama</span>
            <span className="w-28">Kode ICD</span>
            <span className="w-[76px] text-right">Aksi</span>
          </div>
          <div className="flex flex-col gap-2">
            {items.map((item, i) => (
              <div key={i} className="flex gap-2 items-center">
                <IcdAutocomplete
                  kode={item.kode}
                  nama={item.nama}
                  icdType={icdType}
                  onPick={(kode, nama, id) => onChange(i, { ...item, kode, nama, id })}
                />
                <Button
                  variant="destructive"
                  size="default"
                  type="button"
                  onClick={() => onRemove(i)}
                  aria-label={`Hapus ${label} ${i + 1}`}
                  className="w-[76px] shrink-0"
                >
                  Hapus
                </Button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <span className="text-base text-muted-foreground">{emptyText}</span>
      )}
    </div>
  );
}

// Label lengkap tanda vital + kondisi pulang (aksesibilitas lansia:
// singkatan medis seperti TD/N/RR/KU membingungkan — tampilkan nama
// lengkap dengan singkatan dalam kurung).
const VITAL_LABELS: Record<string, string> = {
  tensi: 'Tekanan Darah (TD)',
  nadi: 'Nadi (N)',
  suhu: 'Suhu Tubuh (S)',
  spo2: 'Saturasi Oksigen (SpO2)',
  nafas: 'Laju Napas (RR)',
  gcs_e: 'GCS Mata (E)',
  gcs_m: 'GCS Motorik (M)',
  gcs_v: 'GCS Verbal (V)',
};

const PULANG_LABELS: Record<string, string> = {
  ku: 'Keadaan Umum (KU)',
  kes: 'Kesadaran',
  td_pulang: 'Tekanan Darah (TD)',
  nadi_pulang: 'Nadi (N)',
  suhu_pulang: 'Suhu Tubuh (S)',
  rr_pulang: 'Laju Napas (RR)',
  spo2_pulang: 'Saturasi Oksigen (SpO2)',
};

export function App({ data, onSave, onClose }: Props) {
  const [d, setD] = useState(() => structuredClone(data));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const p = (part: Partial<RanapFormData>) => setD((prev) => ({ ...prev, ...part }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave(d);
      // Tanpa modal konfirmasi — langsung tampilkan teks berhasil,
      // lalu reload supaya data server tampil.
      setSavedAt(new Date().toLocaleTimeString());
      window.setTimeout(() => window.location.reload(), 900);
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

  const openHistory = () => {
    openHistoryModal({
      idVisit: d.id_visit,
      tipe: 'ranap',
      title: 'Riwayat Resume Rawat Inap',
      zIndex: 2147483647, // di atas modal React
      onApply: (snap) => setD(snapToRanapForm(snap, d)),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="ri-modal font-['Inter',system-ui,sans-serif]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-4 bg-primary text-white shrink-0">
        <div className="flex items-center gap-3 min-w-0">
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
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          <div>
            <span className="text-2xl font-bold leading-tight">Resume Rawat Inap</span>
            <p className="text-base text-white/80">Lengkapi ringkasan dan ICD rawat inap</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="bg-white/15 hover:bg-white/25 border-none text-white w-12 h-12 rounded-lg text-xl flex items-center justify-center cursor-pointer transition-colors flex-shrink-0"
          aria-label="Tutup modal"
        >
          ✕
        </button>
      </div>

      {/* CONTENT */}
      <div className="overflow-auto p-5 flex-1 bg-muted">
        {/* Patient banner */}
        <div className="flex gap-4 flex-wrap items-center mb-4 p-3 px-4 bg-card border border-border rounded-lg text-base shadow-sm">
          <span className="text-base text-muted-foreground">Field bertanda (*) wajib diisi.</span>
          {[
            { label: 'RM', value: d.norm },
            { label: 'Pasien', value: d.pasien },
            { label: 'Reg', value: d.noreg },
            { label: 'Unit', value: d.unit },
          ].map((item) => (
            <span key={item.label} className="flex items-center gap-1.5">
              <span className="font-bold text-primary text-base uppercase tracking-wide">
                {item.label}
              </span>
              <span className="text-foreground text-base">{item.value || '—'}</span>
            </span>
          ))}
        </div>
        <p className="text-base text-muted-foreground mb-4 text-center md:text-left">
          Diagnosa utama dan ICD menunjukkan ringkasan utama. Gunakan Riwayat jika ingin memulihkan
          log terakhir.
        </p>

        {/* Ringkasan */}
        <Card title="Ringkasan">
          <Grid cols={2}>
            <div>
              <Label>Dokter Rawat Bersama</Label>
              <Textarea
                value={d.dokter_bersama}
                onChange={(v) => p({ dokter_bersama: v.target.value })}
                rows={2}
              />
            </div>
            <div>
              <Label>Alasan / Indikasi Rawat</Label>
              <Textarea
                value={d.alasan_rawat}
                onChange={(v) => p({ alasan_rawat: v.target.value })}
                rows={2}
              />
            </div>
            <Full>
              <Label>Anamnesa</Label>
              <Textarea
                value={d.anamnesa}
                onChange={(v) => p({ anamnesa: v.target.value })}
                rows={4}
              />
            </Full>
            <Full>
              <Label>Riwayat Penyakit</Label>
              <Textarea
                value={d.riwayat_penyakit}
                onChange={(v) => p({ riwayat_penyakit: v.target.value })}
                rows={3}
              />
            </Full>
          </Grid>
        </Card>

        {/* Vital Sign */}
        <Card title="Vital Sign">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2.5">
            {(['tensi', 'nadi', 'suhu', 'spo2', 'nafas'] as const).map((k) => (
              <div key={k}>
                <Label>{VITAL_LABELS[k]}</Label>
                <Input
                  value={d[k]}
                  onChange={(e) => p({ [k]: e.target.value })}
                  className="text-lg font-semibold"
                />
              </div>
            ))}
            {(['gcs_e', 'gcs_m', 'gcs_v'] as const).map((k) => (
              <div key={k}>
                <Label>{VITAL_LABELS[k]}</Label>
                <Input
                  value={d[k]}
                  onChange={(e) => p({ [k]: e.target.value })}
                  className="text-lg font-semibold"
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Pemeriksaan & Diagnosa */}
        <Card title="Pemeriksaan & Diagnosa">
          <Grid cols={2}>
            <Full>
              <Label>Pemeriksaan Fisik</Label>
              <Textarea
                value={d.fisik_text}
                onChange={(v) => p({ fisik_text: v.target.value })}
                rows={5}
              />
            </Full>
            <Full>
              <Label>Hasil Pemeriksaan Diagnostik (Lab, Rontgen, dll)</Label>
              <Textarea
                value={d.laborat}
                onChange={(v) => p({ laborat: v.target.value })}
                rows={4}
              />
            </Full>
            <div>
              <Label required>Diagnosa Utama</Label>
              <Textarea
                value={d.diagnosa_primary}
                onChange={(v) => p({ diagnosa_primary: v.target.value })}
                rows={2}
              />
            </div>
            <div>
              <Label>Diagnosa Sekunder</Label>
              <Textarea
                value={d.diagnosa_skunder}
                onChange={(v) => p({ diagnosa_skunder: v.target.value })}
                rows={2}
              />
            </div>
            <div>
              <Label>Diagnosa Tindakan</Label>
              <Textarea
                value={d.diagnosa_tindakan}
                onChange={(v) => p({ diagnosa_tindakan: v.target.value })}
                rows={2}
              />
            </div>
            <div>
              <Label>Prosedur / Operasi</Label>
              <Textarea
                value={d.tindakan}
                onChange={(v) => p({ tindakan: v.target.value })}
                rows={2}
              />
            </div>
            <Full>
              <Label>Pengobatan</Label>
              <Textarea
                value={d.terapi_pengobatan}
                onChange={(v) => p({ terapi_pengobatan: v.target.value })}
                rows={4}
              />
            </Full>
            <Full>
              <Label>Obat Pulang</Label>
              <Textarea
                value={d.obat_plg}
                onChange={(v) => p({ obat_plg: v.target.value })}
                rows={3}
              />
            </Full>
            <Full>
              <Label>Tindakan</Label>
              <Textarea
                value={d.tindakan_dua}
                onChange={(v) => p({ tindakan_dua: v.target.value })}
                rows={4}
              />
            </Full>
            <div>
              <Label>Jenis Kasus</Label>
              <SelectNative
                value={d.jenis_kasus}
                onChange={(e) => p({ jenis_kasus: e.target.value })}
                options={JENIS_KASUS}
              />
            </div>
          </Grid>
        </Card>

        {/* ICD */}
        <Card title="ICD">
          <div className="mb-3">
            <Label required>Diagnosa Utama</Label>
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

        {/* Kondisi Pulang — 7 value → 2 baris + catatan (hindari scroll panjang) */}
        <Card title="Kondisi Pulang">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                <Label>{PULANG_LABELS[k]}</Label>
                <Input
                  value={d[k]}
                  onChange={(e) => p({ [k]: e.target.value })}
                  className="text-lg font-semibold"
                />
              </div>
            ))}
          </div>
          <div className="mt-3">
            <Label>Catatan Kondisi Pulang</Label>
            <Textarea
              value={d.catatan_keluar}
              onChange={(v) => p({ catatan_keluar: v.target.value })}
              rows={2}
            />
          </div>
        </Card>

        {/* Keluar */}
        <Card title="Keluar">
          <Grid cols={2}>
            <div>
              <Label>Keadaan Keluar</Label>
              <SelectNative
                value={d.keadaan_keluar}
                onChange={(e) => p({ keadaan_keluar: e.target.value })}
                options={KEADAAN_KELUAR}
              />
            </div>
            <div>
              <Label>Cara Pulang</Label>
              <SelectNative
                value={d.cara_keluar}
                onChange={(e) => p({ cara_keluar: e.target.value })}
                options={CARA_KELUAR}
              />
            </div>
            <div>
              <Label>Tanggal Keluar</Label>
              <Input value={d.tgl_keluar} onChange={(e) => p({ tgl_keluar: e.target.value })} />
            </div>
            <div>
              <Label>Pemeriksaan Lanjutan</Label>
              <SelectNative
                value={d.pemeriksaan_lanjut}
                onChange={(e) => p({ pemeriksaan_lanjut: e.target.value })}
                options={PEMERIKSAAN_LANJUT}
              />
            </div>
            <div>
              <Label>Jadwal Kontrol</Label>
              <Input
                value={d.jadwal_kontrol}
                onChange={(e) => p({ jadwal_kontrol: e.target.value })}
              />
            </div>
            <div>
              <Label>Kelas</Label>
              <Input value={d.kelas} onChange={(e) => p({ kelas: e.target.value })} />
            </div>
            <Full>
              <Label>Instruksi Pulang</Label>
              <Textarea
                value={d.instruksi_pulang}
                onChange={(v) => p({ instruksi_pulang: v.target.value })}
                rows={3}
              />
            </Full>
            <Full>
              <Label>Penyebab Kematian</Label>
              <Textarea
                value={d.penyebab_kematian}
                onChange={(v) => p({ penyebab_kematian: v.target.value })}
                rows={2}
              />
            </Full>
          </Grid>
        </Card>
      </div>

      {/* FOOTER — sticky, thumb-reachable; Simpan is primary; Riwayat/Reset/Batal secondary */}
      <div className="flex justify-end gap-2.5 py-3.5 px-5 border-t-2 border-border items-center shrink-0 bg-card sticky bottom-0 z-10 rounded-b-2xl">
        {error && (
          <Badge variant="danger" icon className="mr-auto text-base">
            {error}
          </Badge>
        )}
        {savedAt && !error && (
          <Badge variant="success" icon className="mr-auto text-base">
            Berhasil tersimpan {savedAt}
          </Badge>
        )}
        <Button
          type="button"
          variant="success"
          onClick={openHistory}
          disabled={saving}
          size="default"
        >
          Riwayat
        </Button>
        <Button type="button" variant="dark" onClick={onClose} disabled={saving} size="default">
          Batal
        </Button>
        <Button type="submit" variant="default" disabled={saving} size="lg" className="px-7">
          {' '}
          {saving ? 'Menyimpan...' : 'Simpan'}{' '}
        </Button>
      </div>
    </form>
  );
}
