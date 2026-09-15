import { useState, useRef } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import { Button } from '../../ui/components/button';
import { Input } from '../../ui/components/input';
import { Label } from '../../ui/components/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/components/select';
import type { TindakanRow } from './types';

interface Props {
  rows: TindakanRow[];
  onChange: (r: TindakanRow[]) => void;
}

const ICD9_URL = '/rekam-medik/search?opsi=clauseDiagnose_icd9&q=';

const JENIS_OPTIONS = [
  { value: 'Primer', label: 'Utama (Primer)' },
  { value: 'Sekunder', label: 'Tambahan (Sekunder)' },
];

const KATEGORI_OPTIONS = [
  { value: '', label: 'Pilih Kategori Prosedur' },
  { value: '24642003', label: 'Layanan Psikiatri' },
  { value: '409063005', label: 'Konseling' },
  { value: '409073007', label: 'Edukasi' },
  { value: '387713003', label: 'Tindakan Bedah' },
  { value: '103693007', label: 'Pemeriksaan Diagnostik' },
  { value: '46947000', label: 'Manipulasi Terapi' },
  { value: '410606002', label: 'Pelayanan Sosial' },
  { value: '277132007', label: 'Tindakan Terapeutik' },
];

interface Hit {
  ID: string;
  KODE: string;
  NAMA: string;
}

export function TindakanSection({ rows, onChange }: Props) {
  const [hits, setHits] = useState<Hit[]>([]);
  const [hitRow, setHitRow] = useState(-1);
  const [hitPos, setHitPos] = useState({ top: 0, left: 0, width: 0 });
  const [errMsg, setErrMsg] = useState('');
  const t = useRef<ReturnType<typeof setTimeout>>(null);
  const abortRef = useRef<AbortController>(null);
  const updateRow = (i: number, p: Partial<TindakanRow>) =>
    onChange(rows.map((r, idx) => (idx === i ? { ...r, ...p } : r)));
  const removeRow = (i: number) => onChange(rows.filter((_, idx) => idx !== i));

  const search = (q: string, rowIdx: number, el: HTMLInputElement) => {
    setErrMsg('');
    clearTimeout(t.current ?? undefined);
    abortRef.current?.abort();
    if (q.length < 3) {
      setHits([]);
      setHitRow(-1);
      return;
    }
    const r = el.getBoundingClientRect();
    setHitPos({ top: r.bottom + 4, left: r.left, width: r.width });
    t.current = setTimeout(async () => {
      const ac = new AbortController();
      abortRef.current = ac;
      try {
        const resp = await fetch(`${ICD9_URL}${encodeURIComponent(q)}`, { signal: ac.signal });
        if (!resp.ok) {
          setErrMsg('HTTP ' + resp.status);
          return;
        }
        const raw = await resp.text();
        if (!raw || raw === '[]') {
          setErrMsg('Data tidak ditemukan');
          return;
        }

        let d: Hit[];
        try {
          d = JSON.parse(raw);
          if (!Array.isArray(d)) throw new Error('not array');
        } catch {
          d = raw
            .split('\n')
            .filter((line) => line.includes('|'))
            .map((line) => {
              const [NAMA, KODE, ID] = line.split('|');
              return { NAMA: NAMA.trim(), KODE: KODE.trim(), ID: ID.trim() };
            })
            .filter((item) => item.KODE);
        }

        if (d.length > 0) {
          setHits(d.slice(0, 15));
          setHitRow(rowIdx);
        } else setErrMsg('Data tidak ditemukan');
      } catch (e) {
        setErrMsg(String(e));
      }
    }, 300);
  };

  const pick = (i: number, item: Hit) => {
    updateRow(i, { idicdTindakan: item.ID, kode9: item.KODE, namaTindakan: item.NAMA });
    setHits([]);
    setHitRow(-1);
  };

  const makeSearch = (i: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    updateRow(i, { namaTindakan: e.target.value });
    search(e.target.value, i, e.currentTarget);
  };
  const makeKodeChange = (i: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    updateRow(i, { kode9: e.target.value });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="default"
          size="lg"
          className="gap-2 px-5 py-3"
          onClick={() =>
            onChange([
              ...rows,
              {
                idicdTindakan: '',
                kode9: '',
                namaTindakan: '',
                komorbid: '',
                kategoriProsedur: '',
                snomedProsedur: '',
                codeProsedur: '',
              } as TindakanRow,
            ])
          }
        >
          <Plus className="size-5" /> Tambah Tindakan
        </Button>
      </div>

      {rows.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-xl py-12 text-center bg-background">
          <p className="text-lg text-muted-foreground mb-2">Belum ada tindakan</p>
          <p className="text-base text-muted-foreground">
            Klik "Tambah Tindakan" untuk menambahkan
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {rows.map((row, i) => {
            const no = i + 1;
            return (
              <div
                key={i}
                className="bg-background border-2 border-border rounded-xl p-4 space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-primary">Tindakan #{no}</span>
                  <Button
                    variant="ghost"
                    onClick={() => removeRow(i)}
                    className="h-11 px-4 text-destructive border-destructive/30 hover:bg-destructive hover:text-destructive-foreground gap-2"
                    aria-label={`Hapus tindakan #${no}`}
                  >
                    <Trash2 className="size-5" /> Hapus
                  </Button>
                </div>

                {/* Nama Tindakan */}
                <div className="space-y-2">
                  <Label>Nama Tindakan</Label>
                  <div className="relative">
                    <Input
                      id={`rj-nama-tindakan${no}`}
                      name="nama_tindakan[]"
                      value={row.namaTindakan}
                      placeholder="Cari tindakan atau ketik nama..."
                      autoComplete="off"
                      onChange={makeSearch(i)}
                      className="pr-12"
                      aria-describedby={`rj-tindakan-help-${no}`}
                    />
                    <Search
                      className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none"
                      aria-hidden="true"
                    />
                    <p id={`rj-tindakan-help-${no}`} className="sr-only">
                      Ketik minimal 3 karakter untuk mencari tindakan ICD-9
                    </p>
                    <input
                      type="hidden"
                      id={`rj-idicd-tindakan${no}`}
                      name="idicd_tindakan[]"
                      value={row.idicdTindakan}
                      autoComplete="off"
                    />
                    {hits.length > 0 && hitRow === i && (
                      <div
                        className="fixed z-[2147483647] bg-background border-2 border-border rounded-xl shadow-lg max-h-[280px] overflow-auto"
                        style={{ top: hitPos.top, left: hitPos.left, width: hitPos.width }}
                        role="listbox"
                        aria-label="Hasil pencarian ICD-9"
                      >
                        {hits.map((item, ri) => (
                          <div
                            key={item.ID || ri}
                            onClick={() => pick(i, item)}
                            role="option"
                            className="px-4 py-3 cursor-pointer text-base border-b border-border hover:bg-accent transition-colors"
                          >
                            <div className="font-medium text-foreground">{item.NAMA}</div>
                            <div className="text-muted-foreground text-base font-mono">
                              {item.KODE}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {errMsg && (
                      <div
                        className="fixed z-[2147483647] bg-destructive/10 border-2 border-destructive rounded-xl px-3 py-2.5 text-base text-destructive"
                        style={{ top: hitPos.top, left: hitPos.left }}
                        role="alert"
                      >
                        {errMsg}
                      </div>
                    )}
                  </div>
                </div>

                {/* Kode ICD-9 + Jenis */}
                <div className="grid grid-cols-[1fr_1fr] gap-4">
                  <div className="space-y-1.5">
                    <Label>Kode ICD-9</Label>
                    <Input
                      id={`rj-kode9${no}`}
                      name="kode9[]"
                      value={row.kode9}
                      placeholder="Kode"
                      onChange={makeKodeChange(i)}
                      className="font-mono text-base"
                      aria-describedby={`rj-kode9-help-${no}`}
                    />
                    <p id={`rj-kode9-help-${no}`} className="sr-only">
                      Kode ICD-9 otomatis terisi saat memilih tindakan, atau ketik manual
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Jenis</Label>
                    <Select
                      value={row.jenis || 'Primer'}
                      onValueChange={(v) => updateRow(i, { jenis: v })}
                    >
                      <SelectTrigger className="h-11 text-base">
                        <SelectValue placeholder="Pilih" />
                      </SelectTrigger>
                      <SelectContent className="z-[1050]">
                        {JENIS_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Kategori Prosedur */}
                <div className="space-y-1.5">
                  <Label>Kategori Prosedur</Label>
                  <Select
                    value={row.kategoriProsedur || ''}
                    onValueChange={(v) => updateRow(i, { kategoriProsedur: v })}
                  >
                    <SelectTrigger className="h-11 text-base">
                      <SelectValue placeholder="Pilih Kategori Prosedur" />
                    </SelectTrigger>
                    <SelectContent className="z-[1050]">
                      {KATEGORI_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
