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
    setHitPos({ top: r.bottom + 4, left: r.left, width: r.width });
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
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="default"
          size="lg"
          className="gap-2 px-5 py-3"
          onClick={() =>
            onChange([
              ...rows,
              { idicd: '', kode10: '', namaDiagnosa: '', kasus: '', komplikasi: '' },
            ])
          }
        >
          <Plus className="size-5" /> Tambah Diagnosa
        </Button>
      </div>

      {rows.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-xl py-12 text-center bg-background">
          <p className="text-lg text-muted-foreground mb-2">Belum ada diagnosa</p>
          <p className="text-base text-muted-foreground">
            Klik "Tambah Diagnosa" untuk menambahkan
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
                  <span className="text-sm font-semibold text-primary">Diagnosa #{no}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRow(i)}
                    className="h-11 w-11 text-destructive border-destructive/30 hover:bg-destructive hover:text-destructive-foreground"
                    aria-label={`Hapus diagnosa #{no}`}
                  >
                    <Trash2 className="size-5" />
                  </Button>
                </div>

                {/* Nama Diagnosa — full width */}
                <div className="space-y-2">
                  <Label>Nama Diagnosa</Label>
                  <div className="relative">
                    <Input
                      id={`rj-nama${no}`}
                      name="nama[]"
                      value={row.namaDiagnosa}
                      placeholder="Cari diagnosa atau ketik nama..."
                      autoComplete="off"
                      onChange={makeSearch(i)}
                      className="pr-12"
                      aria-describedby={`rj-nama-help-${no}`}
                    />
                    <Search
                      className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none"
                      aria-hidden="true"
                    />
                    <p id={`rj-nama-help-${no}`} className="sr-only">
                      Ketik minimal 3 karakter untuk mencari diagnosis ICD-10
                    </p>
                    <input type="hidden" id={`rj-idicd${no}`} name="idicd[]" value={row.idicd} />
                    {hits.length > 0 && hitRow === i && (
                      <div
                        className="fixed z-[2147483647] bg-background border-2 border-border rounded-xl shadow-lg max-h-[280px] overflow-auto"
                        style={{ top: hitPos.top, left: hitPos.left, width: hitPos.width }}
                        role="listbox"
                        aria-label="Hasil pencarian ICD-10"
                      >
                        {hits.map((item, ri) => (
                          <div
                            key={item.ID || ri}
                            onClick={() => pick(i, item)}
                            role="option"
                            className="px-4 py-3 cursor-pointer text-base border-b border-border hover:bg-accent transition-colors"
                          >
                            <div className="font-medium text-foreground">{item.NAMA}</div>
                            <div className="text-muted-foreground text-sm font-mono">
                              {item.KODE}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {errMsg && (
                      <div
                        className="fixed z-[2147483647] bg-destructive/10 border-2 border-destructive rounded-xl px-3 py-2.5 text-sm text-destructive"
                        style={{ top: hitPos.top, left: hitPos.left }}
                        role="alert"
                      >
                        {errMsg}
                      </div>
                    )}
                  </div>
                </div>

                {/* Kode + Kasus + Komplikasi — one row */}
                <div className="grid grid-cols-[1fr_140px_120px_50px] gap-4 items-end">
                  <div className="space-y-1.5">
                    <Label>Kode ICD-10</Label>
                    <Input
                      id={`rj-kode${no}`}
                      name="kode10[]"
                      value={row.kode10}
                      placeholder="Kode"
                      onChange={makeKodeChange(i)}
                      className="font-mono text-base"
                      aria-describedby={`rj-kode-help-${no}`}
                    />
                    <p id={`rj-kode-help-${no}`} className="sr-only">
                      Kode ICD-10 otomatis terisi saat memilih diagnosa, atau ketik manual
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Kasus</Label>
                    <Select value={row.kasus} onValueChange={(v) => updateRow(i, { kasus: v })}>
                      <SelectTrigger className="h-11 text-base">
                        <SelectValue placeholder="Pilih" />
                      </SelectTrigger>
                      <SelectContent className="z-[1050]">
                        <SelectItem value="BARU">Baru</SelectItem>
                        <SelectItem value="LAMA">Lama</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Komplikasi</Label>
                    <Select
                      value={row.komplikasi}
                      onValueChange={(v) => updateRow(i, { komplikasi: v })}
                    >
                      <SelectTrigger className="h-11 text-base">
                        <SelectValue placeholder="Pilih" />
                      </SelectTrigger>
                      <SelectContent className="z-[1050]">
                        <SelectItem value="YA">Ya</SelectItem>
                        <SelectItem value="TIDAK">Tidak</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="invisible">Hapus</Label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
