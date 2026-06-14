import type { TindakanRow } from './types'

interface TindakanSectionProps {
  rows: TindakanRow[]
  onChange: (rows: TindakanRow[]) => void
}

export function TindakanSection({ rows, onChange }: TindakanSectionProps) {
  const updateRow = (i: number, partial: Partial<TindakanRow>) => {
    const next = rows.map((r, idx) => (idx === i ? { ...r, ...partial } : r))
    onChange(next)
  }

  const removeRow = (i: number) => {
    onChange(rows.filter((_, idx) => idx !== i))
  }

  const komorbidOptions = ['Tidak', 'DM', 'HT', 'Jantung', 'Ginjal', 'Lainnya']

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-md-sm font-semibold text-[var(--md-gray-700)]">
          Tindakan (ICD-9) <span className="text-[var(--md-gray-400)] font-normal">{rows.length > 0 ? `(${rows.length})` : ''}</span>
        </h3>
        <button
          onClick={() => onChange([...rows, { idicdTindakan: '', kode9: '', namaTindakan: '', komorbid: '', kategoriProsedur: '', snomedProsedur: '', codeProsedur: '' }])}
          className="inline-flex items-center gap-1 px-2.5 h-7 rounded-md text-md-xs font-medium
            bg-[#2469f0] text-white hover:bg-[#1d58cc] transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Tambah Tindakan
        </button>
      </div>

      {rows.length === 0 ? (
        <div className="border border-dashed border-[var(--md-gray-200)] rounded-md py-6 text-center">
          <p className="text-md-sm text-[var(--md-gray-400)]">Belum ada tindakan</p>
          <p className="text-md-xs text-[var(--md-gray-400)] mt-1">Klik "Tambah Tindakan" untuk menambahkan</p>
        </div>
      ) : (
        <div className="border border-[var(--md-gray-200)] rounded-md overflow-hidden">
          <table className="md-table">
            <thead>
              <tr>
                <th className="pl-3" style={{ width: '30%' }}>Nama Tindakan</th>
                <th style={{ width: '12%' }}>Kode ICD-9</th>
                <th style={{ width: '12%' }}>Komorbid</th>
                <th style={{ width: '15%' }}>Kategori</th>
                <th className="pr-3" style={{ width: '8%' }}></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td className="pl-3">
                    <input
                      type="text"
                      value={row.namaTindakan}
                      onChange={(e) => updateRow(i, { namaTindakan: e.target.value })}
                      placeholder="Cari tindakan..."
                      className="w-full border-0 bg-transparent text-md-sm text-[var(--md-gray-800)] outline-none"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.kode9}
                      onChange={(e) => updateRow(i, { kode9: e.target.value })}
                      placeholder="Kode"
                      className="w-full border-0 bg-transparent font-mono text-md-xs text-[var(--md-gray-700)] outline-none"
                    />
                  </td>
                  <td>
                    <select
                      value={row.komorbid}
                      onChange={(e) => updateRow(i, { komorbid: e.target.value })}
                      className="w-full h-7 rounded border border-[var(--md-gray-200)] bg-white px-2 text-md-xs text-[var(--md-gray-700)] outline-none focus:border-[#2469f0]"
                    >
                      <option value="">Pilih</option>
                      {komorbidOptions.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      value={row.kategoriProsedur}
                      onChange={(e) => updateRow(i, { kategoriProsedur: e.target.value })}
                      className="w-full h-7 rounded border border-[var(--md-gray-200)] bg-white px-2 text-md-xs text-[var(--md-gray-700)] outline-none focus:border-[#2469f0]"
                    >
                      <option value="">Pilih</option>
                      <option value="Utama">Utama</option>
                      <option value="Tambahan">Tambahan</option>
                    </select>
                  </td>
                  <td className="pr-3">
                    <button
                      onClick={() => removeRow(i)}
                      className="w-6 h-6 flex items-center justify-center rounded text-[var(--md-gray-400)] hover:text-[#cc3340] hover:bg-[var(--md-red-50)] transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
