import type { ClinicalNotes } from './types'

interface ClinicalNotesSectionProps {
  data: ClinicalNotes
  onChange: (data: ClinicalNotes) => void
}

const fields: { key: keyof ClinicalNotes; label: string; wide: boolean }[] = [
  { key: 'anamnesa', label: 'Anamnesa', wide: false },
  { key: 'pemeriksaan_fisik', label: 'Pemeriksaan Fisik', wide: false },
  { key: 'catatan', label: 'Catatan', wide: false },
  { key: 'tindakan', label: 'Tindakan', wide: false },
  { key: 'terapi_pengobatan', label: 'Terapi Pengobatan', wide: true },
]

export function ClinicalNotesSection({ data, onChange }: ClinicalNotesSectionProps) {
  return (
    <div>
      <h3 className="text-md-sm font-semibold text-[var(--md-gray-700)] mb-2">Data Klinis</h3>
      <div className="grid grid-cols-2 gap-3">
        {fields.map((f) => (
          <div key={f.key} className={f.wide ? 'col-span-2' : ''}>
            <label className="md-label">{f.label}</label>
            <textarea
              value={data[f.key]}
              onChange={(e) => onChange({ ...data, [f.key]: e.target.value })}
              className="md-input min-h-[60px] resize-y"
              rows={2}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
