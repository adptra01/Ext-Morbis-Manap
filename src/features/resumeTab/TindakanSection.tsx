import { useState, useRef } from 'react';
import { Button } from '../../ui/components/button';
import { Input } from '../../ui/components/input';
import type { TindakanRow } from './types';

interface Props {
  rows: TindakanRow[];
  onChange: (r: TindakanRow[]) => void;
}

const ICD9_URL = '/rekam-medik/search?opsi=clauseDiagnose_icd9&q=';

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
    <div className="space-y-2">
      {rows.length > 0 && (
        <div className="flex gap-2 text-base font-bold text-muted-foreground px-1">
          <span className="flex-1">Nama Tindakan</span>
          <span className="w-28">Kode ICD</span>
          <span className="w-[76px] text-right">Aksi</span>
        </div>
      )}

      {rows.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-xl py-6 text-center bg-background">
          <p className="text-base text-muted-foreground">Belum ada tindakan</p>
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map((row, i) => {
            const no = i + 1;
            return (
              <div key={i} className="flex gap-2 items-center">
                <div className="flex-1 min-w-0 relative">
                  <Input
                    id={`rj-nama-tindakan${no}`}
                    name="nama_tindakan[]"
                    value={row.namaTindakan}
                    placeholder="Cari tindakan..."
                    autoComplete="off"
                    onChange={makeSearch(i)}
                    aria-label={`Nama tindakan ${no}`}
                    aria-describedby={`rj-tindakan-help-${no}`}
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
                  {errMsg && hitRow === i && (
                    <div
                      className="fixed z-[2147483647] bg-destructive/10 border-2 border-destructive rounded-xl px-3 py-2.5 text-base text-destructive"
                      style={{ top: hitPos.top, left: hitPos.left }}
                      role="alert"
                    >
                      {errMsg}
                    </div>
                  )}
                </div>

                <div className="w-28 shrink-0">
                  <Input
                    id={`rj-kode9${no}`}
                    name="kode9[]"
                    value={row.kode9}
                    placeholder="Kode"
                    onChange={makeKodeChange(i)}
                    className="font-mono text-base"
                    aria-label={`Kode ICD-9 ${no}`}
                  />
                  <input type="hidden" name="jenis[]" value={row.jenis || 'Primer'} />
                  <input type="hidden" name="kategoriProsedur[]" value={row.kategoriProsedur} />
                </div>

                <Button
                  variant="destructive"
                  size="default"
                  onClick={() => removeRow(i)}
                  className="w-[76px] shrink-0"
                  aria-label={`Hapus tindakan ${no}`}
                >
                  Hapus
                </Button>
              </div>
            );
          })}
        </div>
      )}

      <Button
        variant="outline"
        size="default"
        className="gap-2 w-full"
        onClick={() =>
          onChange([
            ...rows,
            {
              idicdTindakan: '',
              kode9: '',
              namaTindakan: '',
              jenis: rows.length === 0 ? 'Primer' : 'Sekunder',
              komorbid: '',
              kategoriProsedur: '410606002',
              snomedProsedur: '',
              codeProsedur: '',
            } as TindakanRow,
          ])
        }
      >
        ＋ Tambah Tindakan
      </Button>
    </div>
  );
}
