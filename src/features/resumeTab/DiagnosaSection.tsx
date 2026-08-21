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
import type { DiagnosaRow } from './types';

interface Props {
  rows: DiagnosaRow[];
  onChange: (r: DiagnosaRow[]) => void;
}

const ICD10_URL = '/rekam-medik/search?opsi=kodeicd10&q=';

interface Hit {
  ID: string;
  KODE: string;
  NAMA: string;
}

export function DiagnosaSection({ rows, onChange }: Props) {
  const [hits, setHits] = useState<Hit[]>([]);
  const [hitRow, setHitRow] = useState(-1);
  const [hitPos, setHitPos] = useState({ top: 0, left: 0, width: 0 });
  const [errMsg, setErrMsg] = useState('');
  const t = useRef<ReturnType<typeof setTimeout>>(null);
  const abortRef = useRef<AbortController>(null);
  const updateRow = (i: number, p: Partial<DiagnosaRow>) =>
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
        const resp = await fetch(`${ICD10_URL}${encodeURIComponent(q)}`, { signal: ac.signal });
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
    updateRow(i, { idicd: item.ID, kode10: item.KODE, namaDiagnosa: item.NAMA });
    setHits([]);
    setHitRow(-1);
  };

  const makeSearch = (i: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    updateRow(i, { namaDiagnosa: e.target.value });
    search(e.target.value, i, e.currentTarget);
  };
  const makeKodeChange = (i: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    updateRow(i, { kode10: e.target.value });
  };

  return (
    <div className="px-5 py-4 border-b border-border bg-muted/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[18px] font-bold text-foreground font-['Lexend',system-ui,sans-serif]">
          Diagnosa (ICD-10){' '}
          {rows.length > 0 && (
            <span className="font-normal text-muted-foreground">({rows.length})</span>
          )}
        </h3>
        <Button
          variant="default"
          size="lg"
          onClick={() =>
            onChange([
              ...rows,
              { idicd: '', kode10: '', namaDiagnosa: '', kasus: '', komplikasi: '' },
            ])
          }
          className="px-5 py-2.5 text-sm font-semibold"
        >
          <Plus className="size-4" /> Tambah Diagnosa
        </Button>
      </div>

      {rows.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-xl py-8 text-center bg-card">
          <p className="text-[16px] text-muted-foreground">Belum ada diagnosa</p>
          <p className="text-[14px] text-muted-foreground mt-1">
            Klik &quot;Tambah Diagnosa&quot; untuk menambahkan
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((row, i) => {
            const no = i + 1;
            return (
              <div key={i} className="bg-card rounded-xl border-2 border-border p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Nama Diagnosa */}
                  <div className="md:col-span-2">
                    <Label>Nama Diagnosa</Label>
                    <div className="relative">
                      <Input
                        id={`rj-nama${no}`}
                        name="nama[]"
                        value={row.namaDiagnosa}
                        placeholder="Cari diagnosa..."
                        autoComplete="off"
                        onChange={makeSearch(i)}
                      />
                      <input type="hidden" id={`rj-idicd${no}`} name="idicd[]" value={row.idicd} />
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

                  {/* Kode ICD-10 */}
                  <div>
                    <Label>Kode ICD-10</Label>
                    <Input
                      id={`rj-kode${no}`}
                      name="kode10[]"
                      value={row.kode10}
                      placeholder="Kode"
                      onChange={makeKodeChange(i)}
                      className="font-mono"
                    />
                  </div>

                  {/* Kasus */}
                  <div>
                    <Label>Kasus</Label>
                    <Select value={row.kasus} onValueChange={(v) => updateRow(i, { kasus: v })}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Pilih Kasus" />
                      </SelectTrigger>
                      <SelectContent className="z-[1050]">
                        <SelectItem value="BARU">Baru</SelectItem>
                        <SelectItem value="LAMA">Lama</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Komplikasi */}
                  <div>
                    <Label>Komplikasi</Label>
                    <Select
                      value={row.komplikasi}
                      onValueChange={(v) => updateRow(i, { komplikasi: v })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Pilih" />
                      </SelectTrigger>
                      <SelectContent className="z-[1050]">
                        <SelectItem value="YA">Ya</SelectItem>
                        <SelectItem value="TIDAK">Tidak</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Delete button */}
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
