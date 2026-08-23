import { useState, useRef } from 'react';
import { Plus, Trash2 } from 'lucide-react';
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
    setHitPos({ top: r.bottom + 2, left: r.left, width: r.width });
    t.current = setTimeout(async () => {
      const ac = new AbortController();
      abortRef.current = ac;
      try {
        const resp = await fetch(`${ICD9_URL}${encodeURIComponent(q)}&limit=10`, {
          signal: ac.signal,
        });
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
    <div>
      <div className="flex justify-end mb-3">
        <Button
          variant="default"
          size="sm"
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
              },
            ])
          }
        >
          <Plus className="size-4" /> Tambah Tindakan
        </Button>
      </div>

      {rows.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-xl py-8 text-center bg-card">
          <p className="text-[16px] text-muted-foreground">Belum ada tindakan</p>
          <p className="text-[14px] text-muted-foreground mt-1">
            Klik &quot;Tambah Tindakan&quot; untuk menambahkan
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((row, i) => {
            const no = i + 1;
            return (
              <div key={i} className="bg-card rounded-xl border-2 border-border p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Nama Tindakan */}
                  <div className="md:col-span-2">
                    <Label>Nama Tindakan</Label>
                    <div className="relative">
                      <Input
                        id={`rj-tindakan${no}`}
                        name="namaTindakan[]"
                        value={row.namaTindakan}
                        placeholder="Cari tindakan..."
                        autoComplete="off"
                        onChange={makeSearch(i)}
                      />
                      <input
                        type="hidden"
                        id={`rj-idicdTindakan${no}`}
                        name="idicdTindakan[]"
                        value={row.idicdTindakan}
                      />
                      {hits.length > 0 && hitRow === i && (
                        <div
                          className="fixed z-[2147483647] bg-card border-2 border-border rounded-xl shadow-lg max-h-[240px] overflow-auto"
                          style={{ top: hitPos.top, left: hitPos.left, width: hitPos.width }}
                        >
                          {hits.map((item, ri) => (
                            <div
                              key={item.ID || ri}
                              onClick={() => pick(i, item)}
                              className="px-3.5 py-2.5 cursor-pointer text-sm border-b border-border hover:bg-muted/50 transition-colors"
                            >
                              <div className="font-medium text-foreground">{item.NAMA}</div>
                              <div className="text-muted-foreground text-xs">{item.KODE}</div>
                            </div>
                          ))}
                        </div>
                      )}
                      {errMsg && (
                        <div
                          className="fixed z-[2147483647] bg-destructive/10 border-2 border-destructive rounded-xl px-2.5 py-2 text-sm text-destructive"
                          style={{ top: hitPos.top, left: hitPos.left }}
                        >
                          {errMsg}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Kode ICD-9 */}
                  <div>
                    <Label>Kode ICD-9</Label>
                    <Input
                      id={`rj-kode9${no}`}
                      name="kode9[]"
                      value={row.kode9}
                      placeholder="Kode"
                      onChange={makeKodeChange(i)}
                      className="font-mono"
                    />
                  </div>

                  {/* Jenis */}
                  <div>
                    <Label>Jenis</Label>
                    <Select
                      value={row.komorbid}
                      onValueChange={(v) => updateRow(i, { komorbid: v })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Pilih Jenis" />
                      </SelectTrigger>
                      <SelectContent className="z-[1050]">
                        {JENIS_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Kategori Prosedur */}
                  <div>
                    <Label required>Kategori Prosedur</Label>
                    <Select
                      value={row.kategoriProsedur}
                      onValueChange={(v) => updateRow(i, { kategoriProsedur: v })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Pilih Kategori" />
                      </SelectTrigger>
                      <SelectContent className="z-[1050]">
                        {KATEGORI_OPTIONS.map((o) => (
                          <SelectItem key={o.value || 'empty'} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end mt-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRow(i)}
                    className="h-10 w-10 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
