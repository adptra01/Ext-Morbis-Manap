import { useState, useCallback } from 'react'
import type { ResumeData, ValidationError } from './types'
import { Header } from './Header'
import { InfoBanner } from './InfoBanner'
import { ClinicalNotesSection } from './ClinicalNotesSection'
import { VitalSignsSection } from './VitalSignsSection'
import { DiagnosaSection } from './DiagnosaSection'
import { TindakanSection } from './TindakanSection'
import { ValidationPanel } from './ValidationPanel'
import { Footer } from './Footer'

interface AppProps {
  data: ResumeData
  onSave: (data: ResumeData) => Promise<void>
  onClose: () => void
}

function validate(data: ResumeData): ValidationError[] {
  const errors: ValidationError[] = []

  if (data.diagnosa.length === 0) {
    errors.push({ section: 'Diagnosa', message: 'Minimal 1 ICD-10 harus dipilih' })
  }

  data.diagnosa.forEach((d, i) => {
    if (d.kode10 && !d.namaDiagnosa) {
      errors.push({ section: `Diagnosa #${i + 1}`, message: 'Nama diagnosa kosong' })
    }
    if (d.namaDiagnosa && !d.kode10) {
      errors.push({ section: `Diagnosa #${i + 1}`, message: 'Kode ICD-10 kosong' })
    }
  })

  data.tindakan.forEach((t, i) => {
    if (!t.kode9) return
    if (!t.namaTindakan) errors.push({ section: `Tindakan #${i + 1}`, message: 'Nama tindakan kosong' })

  })

  return errors
}

export function App({ data: initialData, onSave, onClose }: AppProps) {
  const [data, setData] = useState<ResumeData>(initialData)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<string | null>(null)

  const errors = validate(data)

  const handleSave = useCallback(async () => {
    if (errors.length > 0) return
    setSaving(true)
    try {
      await onSave(data)
      setLastSaved(new Date().toLocaleTimeString())
    } finally {
      setSaving(false)
    }
  }, [data, errors, onSave])

  return (
    <div className="flex flex-col h-full bg-white rounded-md-lg shadow-md-panel overflow-hidden animate-zoom-in">
      <Header title="Resume Rajal" onClose={onClose} />

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        <InfoBanner data={data.patientInfo} />
        <ClinicalNotesSection
          data={data.clinicalNotes}
          onChange={(clinicalNotes) => setData({ ...data, clinicalNotes })}
        />
        <div className="md-divider" />
        <VitalSignsSection
          data={data.vitalSigns}
          onChange={(vitalSigns) => setData({ ...data, vitalSigns })}
        />
        <div className="md-divider" />
        <DiagnosaSection
          rows={data.diagnosa}
          onChange={(diagnosa) => setData({ ...data, diagnosa })}
        />
        <div className="md-divider" />
        <TindakanSection
          rows={data.tindakan}
          onChange={(tindakan) => setData({ ...data, tindakan })}
        />
      </div>

      <ValidationPanel errors={errors} />
      <Footer
        saving={saving}
        hasErrors={errors.length > 0}
        lastSaved={lastSaved}
        onSave={handleSave}
        onCancel={onClose}
      />
    </div>
  )
}
