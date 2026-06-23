import { useState, useCallback } from 'react';
import type { ResumeData, ValidationError } from './types';
import { Header } from './Header';
import { InfoBanner } from './InfoBanner';
import { ClinicalNotesSection } from './ClinicalNotesSection';
import { VitalSignsSection } from './VitalSignsSection';
import { DiagnosaSection } from './DiagnosaSection';
import { TindakanSection } from './TindakanSection';
import { ValidationPanel } from './ValidationPanel';
import { Footer } from './Footer';
import { Input } from '../../ui/components/input';

interface AppProps {
  data: ResumeData;
  onSave: (data: ResumeData) => Promise<void>;
  onClose: () => void;
}

function validate(data: ResumeData): ValidationError[] {
  const errors: ValidationError[] = [];

  if (data.diagnosa.length === 0) {
    errors.push({ section: 'Diagnosa', message: 'Minimal 1 ICD-10 harus dipilih' });
  }

  data.diagnosa.forEach((d, i) => {
    if (d.kode10 && !d.namaDiagnosa) {
      errors.push({ section: `Diagnosa #${i + 1}`, message: 'Nama diagnosa kosong' });
    }
    if (d.namaDiagnosa && !d.kode10) {
      errors.push({ section: `Diagnosa #${i + 1}`, message: 'Kode ICD-10 kosong' });
    }
  });

  data.tindakan.forEach((t, i) => {
    if (!t.kode9) return;
    if (!t.namaTindakan)
      errors.push({ section: `Tindakan #${i + 1}`, message: 'Nama tindakan kosong' });
  });

  return errors;
}

export function App({ data: initialData, onSave, onClose }: AppProps) {
  const [data, setData] = useState<ResumeData>(initialData);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const errors = validate(data);

  const handleSave = useCallback(async () => {
    console.log('[RJ-APP] save clicked, errors:', errors.length)
    if (errors.length > 0) return
    setSaving(true);
    try {
      await onSave(data);
      console.log('[RJ-APP] save completed')
      setLastSaved(new Date().toLocaleTimeString());
    } finally {
      setSaving(false);
    }
  }, [data, errors, onSave]);

  const updateNotes = (field: string, value: string) =>
    setData({ ...data, clinicalNotes: { ...data.clinicalNotes, [field]: value } });

  return (
    <div className="resume-modal">
      <Header title="Resume Rajal" onClose={onClose} />

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        <InfoBanner data={data.patientInfo} />
        <ClinicalNotesSection
          anamnesa={data.clinicalNotes.anamnesa}
          pemeriksaan={data.clinicalNotes.pemeriksaan_fisik}
          onChange={(field, value) => updateNotes(field, value)}
        />
        <div className="border-t border-border" />

        <div className="px-5 py-4 border-b border-border bg-background">
          <h3 className="text-md-sm font-semibold text-foreground mb-3">Catatan Diagnosa</h3>
          <textarea
            value={data.clinicalNotes.catatan}
            onChange={(e) => updateNotes('catatan', e.target.value)}
            className="w-full h-20 rounded-md border border-input bg-background px-3 py-2 text-md-xs resize-none"
            placeholder="Catatan diagnosa..."
          />
        </div>
        <div className="border-t border-border" />

        <div className="px-5 py-4 border-b border-border bg-background">
          <h3 className="text-md-sm font-semibold text-foreground mb-3">Tindakan</h3>
          <textarea
            value={data.clinicalNotes.tindakan}
            onChange={(e) => updateNotes('tindakan', e.target.value)}
            className="w-full h-20 rounded-md border border-input bg-background px-3 py-2 text-md-xs resize-none"
            placeholder="Tindakan..."
          />
        </div>
        <div className="border-t border-border" />

        <div className="px-5 py-4 border-b border-border bg-background">
          <h3 className="text-md-sm font-semibold text-foreground mb-3">Terapi Pengobatan</h3>
          <textarea
            value={data.clinicalNotes.terapi_pengobatan}
            onChange={(e) => updateNotes('terapi_pengobatan', e.target.value)}
            className="w-full h-20 rounded-md border border-input bg-background px-3 py-2 text-md-xs resize-none"
            placeholder="Terapi pengobatan..."
          />
        </div>
        <div className="border-t border-border" />

        <VitalSignsSection
          vitals={data.vitalSigns}
          onChange={(key, value) => setData({ ...data, vitalSigns: { ...data.vitalSigns, [key]: value } })}
        />
        <div className="border-t border-border" />
        <DiagnosaSection
          rows={data.diagnosa}
          onChange={(diagnosa) => setData({ ...data, diagnosa })}
        />
        <div className="border-t border-border" />
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
  );
}
