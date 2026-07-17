import { useState, useRef } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../../ui/components/button';
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
  const t = useRef<ReturnType<typeof setTimeout>>();
  const abortRef = useRef<AbortController>();
  const updateRow = (i: number, p: Partial<TindakanRow>) =>
    onChange(rows.map((r, idx) => (idx === i ? { ...r, ...p } : r)));
  const removeRow = (i: number) => onChange(rows.filter((_, idx) => idx !== i));

  const search = (q: string, rowIdx: number, el: HTMLInputElement) => {
    setErrMsg('');
    clearTimeout(t.current);
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
    <div className="px-5 py-4 border-b border-[#e2ddd7] bg-[#f8f6f3]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[18px] font-bold text-[#1a1d23] font-['Lexend',system-ui,sans-serif]">
          Tindakan (ICD-9){' '}
          {rows.length > 0 && <span className="font-normal text-[#a0988f]">({rows.length})</span>}
        </h3>
        <Button
          variant="default"
          size="lg"
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
          className="px-5 py-2.5 text-sm font-semibold"
        >
          <Plus className="size-4" /> Tambah Tindakan
        </Button>
      </div>

      {rows.length === 0 ? (
        <div className="border-2 border-dashed border-[#e2ddd7] rounded-xl py-8 text-center bg-white">
          <p className="text-[16px] text-[#a0988f]">Belum ada tindakan</p>
          <p className="text-[14px] text-[#a0988f] mt-1">
            Klik "Tambah Tindakan" untuk menambahkan
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((row, i) => {
            const no = i + 1;
            return (
              <div key={i} className="bg-white rounded-xl border-2 border-[#e2ddd7] p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Nama Tindakan */}
                  <div className="md:col-span-2">
                    <label className="block text-[14px] font-semibold text-[#4a4540] mb-1">
                      Nama Tindakan
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        id={`rj-tindakan${no}`}
                        name="namaTindakan[]"
                        value={row.namaTindakan}
                        placeholder="Cari tindakan..."
                        autoComplete="off"
                        onChange={makeSearch(i)}
                        style={{
                          height: 48,
                          fontSize: 16,
                          borderRadius: 10,
                          border: '2px solid #e2ddd7',
                          outline: 'none',
                          padding: '0 12px',
                          width: '100%',
                          color: '#1a1d23',
                          backgroundColor: '#fff',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#2b5f8a';
                          e.target.style.boxShadow = '0 0 0 3px rgba(43,95,138,0.15)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e2ddd7';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                      <input
                        type="hidden"
                        id={`rj-idicdTindakan${no}`}
                        name="idicdTindakan[]"
                        value={row.idicdTindakan}
                      />
                      {hits.length > 0 && hitRow === i && (
                        <div
                          style={{
                            position: 'fixed',
                            top: hitPos.top,
                            left: hitPos.left,
                            width: hitPos.width,
                            zIndex: 2147483647,
                            background: '#fff',
                            border: '2px solid #d1d5db',
                            borderRadius: '10px',
                            boxShadow: '0 8px 24px rgba(0,0,0,.15)',
                            maxHeight: '240px',
                            overflowY: 'auto',
                          }}
                        >
                          {hits.map((item, ri) => (
                            <div
                              key={item.ID || ri}
                              onClick={() => pick(i, item)}
                              style={{
                                padding: '10px 14px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                borderBottom: '1px solid #f3f4f6',
                              }}
                            >
                              <div style={{ fontWeight: 500, color: '#1f2937' }}>{item.NAMA}</div>
                              <div style={{ color: '#6b7280', fontSize: '12px' }}>{item.KODE}</div>
                            </div>
                          ))}
                        </div>
                      )}
                      {errMsg && (
                        <div
                          style={{
                            position: 'fixed',
                            top: hitPos.top,
                            left: hitPos.left,
                            zIndex: 2147483647,
                            background: '#fee2e2',
                            border: '2px solid #ef4444',
                            borderRadius: '10px',
                            padding: '10px',
                            fontSize: '14px',
                            color: '#b91c1c',
                          }}
                        >
                          {errMsg}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Kode ICD-9 */}
                  <div>
                    <label className="block text-[14px] font-semibold text-[#4a4540] mb-1">
                      Kode ICD-9
                    </label>
                    <input
                      type="text"
                      id={`rj-kode9${no}`}
                      name="kode9[]"
                      value={row.kode9}
                      placeholder="Kode"
                      onChange={makeKodeChange(i)}
                      style={{
                        height: 48,
                        fontSize: 16,
                        borderRadius: 10,
                        border: '2px solid #e2ddd7',
                        outline: 'none',
                        padding: '0 12px',
                        width: '100%',
                        color: '#1a1d23',
                        backgroundColor: '#fff',
                        fontFamily: "'Courier New',monospace",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#2b5f8a';
                        e.target.style.boxShadow = '0 0 0 3px rgba(43,95,138,0.15)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e2ddd7';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  {/* Jenis */}
                  <div>
                    <label className="block text-[14px] font-semibold text-[#4a4540] mb-1">
                      Jenis
                    </label>
                    <Select
                      value={row.komorbid}
                      onValueChange={(v) => updateRow(i, { komorbid: v })}
                    >
                      <SelectTrigger
                        style={{
                          height: 48,
                          borderRadius: 10,
                          border: '2px solid #e2ddd7',
                          backgroundColor: '#fff',
                          fontSize: 16,
                          paddingLeft: 12,
                          width: '100%',
                        }}
                      >
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
                    <label className="block text-[14px] font-semibold text-[#4a4540] mb-1">
                      Kategori Prosedur *
                    </label>
                    <Select
                      value={row.kategoriProsedur}
                      onValueChange={(v) => updateRow(i, { kategoriProsedur: v })}
                    >
                      <SelectTrigger
                        style={{
                          height: 48,
                          borderRadius: 10,
                          border: '2px solid #e2ddd7',
                          backgroundColor: '#fff',
                          fontSize: 16,
                          paddingLeft: 12,
                          width: '100%',
                        }}
                      >
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
                    style={{ height: 40, width: 40, color: '#a0988f', borderRadius: 8 }}
                    className="hover:text-[#dc2626]"
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
