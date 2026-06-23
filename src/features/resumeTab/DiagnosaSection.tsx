import { useState, useRef } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Input } from '../../ui/components/input'
import { Button } from '../../ui/components/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/components/select'
import type { DiagnosaRow } from './types'

interface Props { rows: DiagnosaRow[]; onChange: (r: DiagnosaRow[]) => void }

const ICD10_URL = '/rekam-medik/search?opsi=clauseDiagnose_icd10&q='

interface Hit { ID: string; KODE: string; NAMA: string }

export function DiagnosaSection({ rows, onChange }: Props) {
  const [hits, setHits] = useState<Hit[]>([])
  const [hitRow, setHitRow] = useState(-1)
  const t = useRef<ReturnType<typeof setTimeout>>()

  const search = (q: string, rowIdx: number) => {
    console.log('[RJ-DIAG] search:', q, 'row:', rowIdx)
    clearTimeout(t.current)
    if (q.length < 2) { setHits([]); setHitRow(-1); return }
    t.current = setTimeout(async () => {
      try {
        const r = await fetch(`${ICD10_URL}${encodeURIComponent(q)}`)
        console.log('[RJ-DIAG] fetch status:', r.status)
        if (!r.ok) return
        const d = await r.json()
        console.log('[RJ-DIAG] results:', d?.length || 0)
        if (Array.isArray(d)) { setHits(d.slice(0, 10)); setHitRow(rowIdx) }
      } catch (e) { console.error('[RJ-DIAG] fetch error:', e) }
    }, 300)
  }

  const pick = (i: number, item: Hit) => {
    console.log('[RJ-DIAG] picked:', item.NAMA, item.KODE)
    const next = rows.map((r, idx) => idx === i ? { ...r, kode10: item.KODE, namaDiagnosa: item.NAMA } : r)
    onChange(next)
    setHits([])
    setHitRow(-1)
  }

  return (
    <div className="px-5 py-4 border-b border-border bg-background">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-md-sm font-semibold text-foreground">
          Diagnosa (ICD-10) {rows.length > 0 && <span className="text-muted-foreground font-normal">({rows.length})</span>}
        </h3>
        <Button variant="default" size="sm" onClick={() => onChange([...rows, { idicd: '', kode10: '', namaDiagnosa: '', kasus: '', komplikasi: '' }])}>
          <Plus className="size-3.5" /> Tambah Diagnosa
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
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-accent/50">
                <td className="px-3 py-1.5" style={{ position: 'relative' }}>
                  <Input type="text" value={row.namaDiagnosa}
                    onChange={e => { updateRow(i, { namaDiagnosa: e.target.value }); search(e.target.value, i) }}
                    placeholder="Cari diagnosa..."
                    className="border-0 bg-transparent px-0 h-7 text-md-sm shadow-none focus-visible:ring-0" />
                  {hits.length > 0 && hitRow === i && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, background: '#fff', border: '1px solid #d1d5db', borderRadius: '6px', boxShadow: '0 4px 12px rgba(0,0,0,.15)', maxHeight: '200px', overflowY: 'auto' }}>
                      {hits.map((item, ri) => (
                        <div key={item.ID || ri} onClick={() => pick(i, item)}
                          style={{ padding: '6px 10px', cursor: 'pointer', fontSize: '12px', borderBottom: '1px solid #f3f4f6' }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#f3f4f6')}
                          onMouseLeave={e => (e.currentTarget.style.background = '')}>
                          <div style={{ fontWeight: 500, color: '#1f2937' }}>{item.NAMA}</div>
                          <div style={{ color: '#6b7280', fontSize: '11px' }}>{item.KODE}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-3 py-1.5">
                  <Input type="text" value={row.kode10}
                    onChange={e => updateRow(i, { kode10: e.target.value })}
                    placeholder="Kode"
                    className="border-0 bg-transparent px-0 h-7 text-md-xs font-mono shadow-none focus-visible:ring-0" />
                </td>
                <td className="px-3 py-1.5">
                  <Select value={row.kasus} onValueChange={v => updateRow(i, { kasus: v })}>
                    <SelectTrigger className="h-7 w-full border-border text-md-xs">
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
                    <SelectTrigger className="h-7 w-full border-border text-md-xs">
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  function updateRow(i: number, p: Partial<DiagnosaRow>) { onChange(rows.map((r, idx) => idx === i ? { ...r, ...p } : r)) }
  function removeRow(i: number) { onChange(rows.filter((_, idx) => idx !== i)) }
}
