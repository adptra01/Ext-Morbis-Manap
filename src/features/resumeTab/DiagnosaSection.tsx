import { useState, useRef } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '../../ui/components/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/components/select'
import type { DiagnosaRow } from './types'

interface Props { rows: DiagnosaRow[]; onChange: (r: DiagnosaRow[]) => void }

const ICD10_URL = '/rekam-medik/search?opsi=kodeicd10&q='

interface Hit { ID: string; KODE: string; NAMA: string }

export function DiagnosaSection({ rows, onChange }: Props) {
  const [hits, setHits] = useState<Hit[]>([])
  const [hitRow, setHitRow] = useState(-1)
  const [hitPos, setHitPos] = useState({ top: 0, left: 0, width: 0 })
  const [errMsg, setErrMsg] = useState('')
  const t = useRef<ReturnType<typeof setTimeout>>()
  const abortRef = useRef<AbortController>()
  const updateRow = (i: number, p: Partial<DiagnosaRow>) => onChange(rows.map((r, idx) => idx === i ? { ...r, ...p } : r))
  const removeRow = (i: number) => onChange(rows.filter((_, idx) => idx !== i))

  const search = (q: string, rowIdx: number, el: HTMLInputElement) => {
    setErrMsg('')
    clearTimeout(t.current)
    abortRef.current?.abort()
    if (q.length < 3) { setHits([]); setHitRow(-1); return }
    const r = el.getBoundingClientRect()
    setHitPos({ top: r.bottom + 2, left: r.left, width: r.width })
    t.current = setTimeout(async () => {
      const ac = new AbortController()
      abortRef.current = ac
      try {
        const resp = await fetch(`${ICD10_URL}${encodeURIComponent(q)}`, { signal: ac.signal })
        if (!resp.ok) { setErrMsg('HTTP ' + resp.status); return }
        const raw = await resp.text()
        if (!raw || raw === '[]') { setErrMsg('Data tidak ditemukan'); return }

        let d: Hit[]
        try {
          d = JSON.parse(raw)
          if (!Array.isArray(d)) throw new Error('not array')
        } catch {
          d = raw.split('\n')
            .filter(line => line.includes('|'))
            .map(line => {
              const [NAMA, KODE, ID] = line.split('|')
              return { NAMA: NAMA.trim(), KODE: KODE.trim(), ID: ID.trim() }
            })
            .filter(item => item.KODE)
        }

        if (d.length > 0) { setHits(d.slice(0, 15)); setHitRow(rowIdx) }
        else setErrMsg('Data tidak ditemukan')
      } catch (e) { setErrMsg(String(e)) }
    }, 300)
  }

  const pick = (i: number, item: Hit) => {
    updateRow(i, { idicd: item.ID, kode10: item.KODE, namaDiagnosa: item.NAMA })
    setHits([]); setHitRow(-1)
  }

  const makeSearch = (i: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    updateRow(i, { namaDiagnosa: e.target.value })
    search(e.target.value, i, e.currentTarget)
  }
  const makeKodeChange = (i: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    updateRow(i, { kode10: e.target.value })
  }

  return (
    <div className="px-5 py-4 border-b border-border bg-background">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-md-sm font-semibold text-foreground">
          Diagnosa (ICD-10) {rows.length > 0 && <span className="text-muted-foreground font-normal">({rows.length})</span>}
        </h3>
        <Button variant="default" size="lg" onClick={() => onChange([...rows, { idicd: '', kode10: '', namaDiagnosa: '', kasus: '', komplikasi: '' }])} className="px-5 py-2.5 text-sm font-semibold">
          <Plus className="size-4" /> Tambah Diagnosa
        </Button>
      </div>
      <div className="border border-border rounded-md overflow-hidden">
        <table className="w-full text-md-xs">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left font-semibold text-muted-foreground px-3 py-2" style={{ width: '35%' }}>Nama Diagnosa</th>
              <th className="text-left font-semibold text-muted-foreground px-3 py-2" style={{ width: '14%' }}>Kode ICD-10</th>
              <th className="text-left font-semibold text-muted-foreground px-3 py-2" style={{ width: '15%' }}>Kasus</th>
              <th className="text-left font-semibold text-muted-foreground px-3 py-2" style={{ width: '15%' }}>Komplikasi</th>
              <th className="pr-3 py-2" style={{ width: '8%' }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const no = i + 1
              return (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-accent/50">
                <td className="px-3 py-1.5">
                    <input type="text" id={`rj-nama${no}`} name="nama[]" defaultValue={row.namaDiagnosa}
                      placeholder="Cari diagnosa..."
                      autoComplete="off"
                      onChange={makeSearch(i)}
                      className="flex w-full rounded-md border-input py-2 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-1 border-0 bg-transparent px-0 h-10 text-base shadow-none focus-visible:ring-0" />
                  <input type="hidden" id={`rj-idicd${no}`} name="idicd[]" defaultValue={row.idicd} />
                  {hits.length > 0 && hitRow === i && (
                    <div style={{ position: 'fixed', top: hitPos.top, left: hitPos.left, width: hitPos.width, zIndex: 2147483647, background: '#fff', border: '1px solid #d1d5db', borderRadius: '6px', boxShadow: '0 4px 12px rgba(0,0,0,.15)', maxHeight: '200px', overflowY: 'auto' }}>
                      {hits.map((item, ri) => (
                        <div key={item.ID || ri} onClick={() => pick(i, item)}
                          style={{ padding: '6px 10px', cursor: 'pointer', fontSize: '12px', borderBottom: '1px solid #f3f4f6' }}>
                          <div style={{ fontWeight: 500, color: '#1f2937' }}>{item.NAMA}</div>
                          <div style={{ color: '#6b7280', fontSize: '11px' }}>{item.KODE}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {errMsg && <div style={{ position: 'fixed', top: hitPos.top, left: hitPos.left, zIndex: 2147483647, background: '#fee2e2', border: '1px solid #ef4444', borderRadius: '6px', padding: '8px', fontSize: '12px', color: '#b91c1c' }}>{errMsg}</div>}
                </td>
                <td className="px-3 py-1.5">
                    <input type="text" id={`rj-kode${no}`} name="kode10[]" defaultValue={row.kode10}
                      placeholder="Kode"
                      onChange={makeKodeChange(i)}
                      className="flex w-full rounded-md border-input py-2 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-1 border-0 bg-transparent px-0 h-10 text-sm font-mono shadow-none focus-visible:ring-0" />
                </td>
                <td className="px-3 py-1.5">
                  <Select value={row.kasus} onValueChange={v => updateRow(i, { kasus: v })}>
                    <SelectTrigger className="h-10 w-full border-border text-sm">
                      <SelectValue placeholder="Pilih Kasus" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BARU">Baru</SelectItem>
                      <SelectItem value="LAMA">Lama</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-3 py-1.5">
                  <Select value={row.komplikasi} onValueChange={v => updateRow(i, { komplikasi: v })}>
                    <SelectTrigger className="h-10 w-full border-border text-sm">
                      <SelectValue placeholder="Pilih" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="YA">Ya</SelectItem>
                      <SelectItem value="TIDAK">Tidak</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="pr-3 py-1.5">
                  <Button variant="ghost" size="icon" onClick={() => removeRow(i)}
                    className="h-7 w-7 text-muted-foreground hover:text-destructive">
                    <Trash2 className="size-3.5" />
                  </Button>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  )
}
