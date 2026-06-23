import { useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '../../ui/components/button'
import type { TindakanRow } from './types'

interface Props { rows: TindakanRow[]; onChange: (r: TindakanRow[]) => void }

export function TindakanSection({ rows, onChange }: Props) {
  const updateRow = (i: number, p: Partial<TindakanRow>) => onChange(rows.map((r, idx) => idx === i ? { ...r, ...p } : r))
  const removeRow = (i: number) => onChange(rows.filter((_, idx) => idx !== i))

  useEffect(() => {
    rows.forEach((_, i) => {
      const no = i + 1
      const nama = document.getElementById(`rj-tindakan${no}`)
      if (nama) nama.addEventListener('input', () => updateRow(i, { namaTindakan: (nama as HTMLInputElement).value }))
      const kode = document.getElementById(`rj-kode9${no}`)
      if (kode) kode.addEventListener('input', () => updateRow(i, { kode9: (kode as HTMLInputElement).value }))
      const w = window as unknown as Record<string, unknown>
      if (typeof w.initAutocompletes === 'function') setTimeout(() => w.initAutocompletes(no), 100)
    })
  }, [rows.length])

  return (
    <div className="px-5 py-4 border-b border-border bg-background">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-md-sm font-semibold text-foreground">
          Tindakan (ICD-9) {rows.length > 0 && <span className="text-muted-foreground font-normal">({rows.length})</span>}
        </h3>
        <Button variant="default" size="lg" onClick={() => onChange([...rows, { idicd: '', kode9: '', namaTindakan: '' }])} className="px-5 py-2.5 text-sm font-semibold">
          <Plus className="size-4" /> Tambah Tindakan
        </Button>
      </div>
      {rows.length === 0 ? (
        <div className="border border-dashed border-border rounded-md py-6 text-center">
          <p className="text-md-sm text-muted-foreground">Belum ada tindakan</p>
          <p className="text-md-xs text-muted-foreground mt-1">Klik "Tambah Tindakan" untuk menambahkan</p>
        </div>
      ) : (
        <div className="border border-border rounded-md overflow-hidden">
          <table className="w-full text-md-xs">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left font-semibold text-muted-foreground px-3 py-2" style={{ width: '55%' }}>Nama Tindakan</th>
                <th className="text-left font-semibold text-muted-foreground px-3 py-2" style={{ width: '20%' }}>Kode ICD-9</th>
                <th className="pr-3 py-2" style={{ width: '8%' }}></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const no = i + 1
                return (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-accent/50">
                  <td className="px-3 py-1.5">
                    <input type="text" id={`rj-tindakan${no}`} name="namaTindakan[]" defaultValue={row.namaTindakan}
                      placeholder="Cari tindakan..."
                      className="flex w-full rounded-md border-input py-2 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 border-0 bg-transparent px-0 h-10 text-base shadow-none focus-visible:ring-0" />
                    <input type="hidden" id={`rj-idicdTindakan${no}`} name="idicdTindakan[]" defaultValue={row.idicd} />
                  </td>
                  <td className="px-3 py-1.5">
                    <input type="text" id={`rj-kode9${no}`} name="kode9[]" defaultValue={row.kode9}
                      placeholder="Kode"
                      className="flex w-full rounded-md border-input py-2 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 border-0 bg-transparent px-0 h-10 text-sm font-mono shadow-none focus-visible:ring-0" />
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
      )}
    </div>
  )
}
