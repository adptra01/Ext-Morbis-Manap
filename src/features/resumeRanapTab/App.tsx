import { useState, useCallback, useRef, useEffect, type FormEvent } from 'react';
import type { RanapFormData, IcdItem, SelectOption } from './types';
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
    <div ref={containerRef} className="relative">
      <div className="flex gap-1">
        <div className="w-[35%]">
          <Input
            value={kodeInput}
            onChange={(e) => handleKodeChange(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Kode"
            className="text-xs font-mono"
          />
        </div>
        <div className="flex-1">
          <Input
            value={namaInput}
            onChange={(e) => setNamaInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Nama diagnosis"
            className="text-xs"
          />
        </div>
      </div>
      {show && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 bg-card border border-border rounded-lg max-h-[180px] overflow-auto shadow-md mt-0.5">
          {suggestions.map((hit, i) => (
            <div
              key={hit.ID}
              onClick={() => pick(hit)}
              onMouseEnter={() => setActiveIdx(i)}
              className={`px-2.5 py-1.5 text-xs cursor-pointer border-b border-border transition-colors ${
                i === activeIdx ? 'bg-primary/5' : 'bg-card'
              }`}
            >
              <span className="font-bold text-primary font-mono">{hit.KODE}</span>
              <span className="text-muted-foreground ml-1.5">{hit.NAMA}</span>
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
    <div className={items.length ? 'mb-2.5' : ''}>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
        <Button variant="outline" size="sm" type="button" onClick={onAdd}>
          + Tambah
        </Button>
      </div>
      {items.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          {items.map((item, i) => (
            <div key={i} className="flex gap-1.5 items-start">
              <div className="flex-1">
                <IcdAutocomplete
                  kode={item.kode}
                  nama={item.nama}
                  icdType={icdType}
                  onPick={(kode, nama, id) => onChange(i, { ...item, kode, nama, id })}
                />
              </div>
              <Button
                variant="destructive"
                size="sm"
                type="button"
                onClick={() => onRemove(i)}
                className="mt-px"
              >
                Hapus
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <span className="text-xs text-muted-foreground">{emptyText}</span>
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
      className="ri-modal font-['Inter',system-ui,sans-serif]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-br from-primary to-primary/80 text-white shrink-0">
        <div className="flex items-center gap-2.5">
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
          <span className="text-[15px] font-bold tracking-tight">Resume Rawat Inap</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="bg-white/15 hover:bg-white/25 border-none text-white w-[30px] h-[30px] rounded-md text-base flex items-center justify-center cursor-pointer transition-colors"
        >
          ✕
        </button>
      </div>

      {/* CONTENT */}
      <div className="overflow-auto p-3.5 flex-1 bg-background">
        {/* Patient banner */}
        <div className="flex gap-4 flex-wrap items-center mb-3.5 p-2.5 px-3.5 bg-card border border-border rounded-lg text-xs shadow-sm">
          {[
            { label: 'RM', value: d.norm },
            { label: 'Pasien', value: d.pasien },
            { label: 'Reg', value: d.noreg },
            { label: 'Unit', value: d.unit },
          ].map((item) => (
            <span key={item.label} className="flex items-center gap-1">
              <span className="font-bold text-primary text-[11px] uppercase">{item.label}</span>
              <span className="text-foreground">{item.value}</span>
            </span>
          ))}
        </div>

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
          <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-2.5">
            {(['tensi', 'nadi', 'suhu', 'spo2', 'nafas'] as const).map((k) => (
              <div key={k}>
                <Label>{k.toUpperCase()}</Label>
                <Input value={d[k]} onChange={(e) => p({ [k]: e.target.value })} />
              </div>
            ))}
            {(['gcs_e', 'gcs_m', 'gcs_v'] as const).map((k) => (
              <div key={k}>
                <Label>{k.replace('_', ' ').toUpperCase()}</Label>
                <Input value={d[k]} onChange={(e) => p({ [k]: e.target.value })} />
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

        {/* Kondisi Pulang */}
        <Card title="Kondisi Pulang">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2.5">
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
                <Label>{k.replace('_', ' ').toUpperCase()}</Label>
                <Input value={d[k]} onChange={(e) => p({ [k]: e.target.value })} />
              </div>
            ))}
            <Full>
              <Label>Catatan Kondisi Pulang</Label>
              <Textarea
                value={d.catatan_keluar}
                onChange={(v) => p({ catatan_keluar: v.target.value })}
                rows={2}
              />
            </Full>
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

      {/* FOOTER */}
      <div className="flex justify-end gap-2 py-2.5 px-4 border-t border-border items-center shrink-0 bg-card">
        {error && (
          <Badge variant="danger" icon className="mr-auto">
            {error}
          </Badge>
        )}
        <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
          Batal
        </Button>
        <Button type="submit" variant="default" disabled={saving}>
          {saving ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </div>
    </form>
  );
}
