import { useState, useCallback, useRef } from 'react';
import type { ResumeData, ValidationError } from './types';
import { Textarea } from '../../ui/components/Textarea';
import { Label } from '../../ui/components/Label';
import { Card } from '../../ui/components/Card';
import { Header } from './Header';
import { ClinicalNotesSection } from './ClinicalNotesSection';
import { VitalSignsSection } from './VitalSignsSection';
import { DiagnosaSection } from './DiagnosaSection';
import { TindakanSection } from './TindakanSection';
import { ValidationPanel } from './ValidationPanel';
import { Footer } from './Footer';

interface AppProps {
  data: ResumeData;
  onSave: (data: ResumeData) => Promise<void>;
  onClose: () => void;
}

function validate(data: ResumeData): ValidationError[] {
  const errors: ValidationError[] = [];

  data.diagnosa.forEach((d, i) => {
    if (!d.kode10 && !d.namaDiagnosa) return;
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
    if (
      t.idicdTindakan?.trim() &&
      t.kode9?.trim() &&
      t.namaTindakan?.trim() &&
      !t.kategoriProsedur?.trim()
    ) {
      errors.push({ section: `Tindakan #${i + 1}`, message: 'Kategori Prosedur belum dipilih' });
    }
  });

  return errors;
}

export function App({ data: initialData, onSave, onClose }: AppProps) {
  const [data, setData] = useState<ResumeData>(initialData);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [saveAttempted, setSaveAttempted] = useState(false);
  const [warnings, setWarnings] = useState<ValidationError[]>([]);
  const [extraErrors, setExtraErrors] = useState<ValidationError[]>([]);

  const hadDiagnosaInitially = useRef(data.diagnosa.some((d) => d.idicd?.trim()));

  const validationErrors = saveAttempted ? validate(data) : [];
  const allErrors = [...validationErrors, ...extraErrors];
  const hasBlocking = validationErrors.length > 0;

  const handleSave = useCallback(async () => {
    setSaveAttempted(true);
    setWarnings([]);
    setExtraErrors([]);
    const v = validate(data);
    if (v.length > 0) return;
    const cleanD = data.diagnosa.filter(
      (d) => d.idicd?.trim() && d.kode10?.trim() && d.namaDiagnosa?.trim(),
    );
    if (hadDiagnosaInitially.current && cleanD.length === 0) {
      setWarnings([
        {
          section: 'Diagnosa',
          message:
            'Semua diagnosa telah dihapus. Sistem Morbis biasanya tidak menghapus ICD yang sudah tersimpan ketika daftar diagnosa dikosongkan.',
        },
      ]);
    }
    setSaving(true);
    try {
      await onSave(data);
      setLastSaved(new Date().toLocaleTimeString());
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setExtraErrors([{ section: 'Server', message: msg }]);
    } finally {
      setSaving(false);
    }
  }, [data, onSave]);

  const updateNotes = (field: string, value: string) =>
    setData({ ...data, clinicalNotes: { ...data.clinicalNotes, [field]: value } });

  return (
    <div className="resume-modal">
      <Header title="Resume Rawat Jalan" onClose={onClose} patientInfo={data.patientInfo} />

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        <Card title="Data Klinis">
          <ClinicalNotesSection
            anamnesa={data.clinicalNotes.anamnesa}
            pemeriksaan={data.clinicalNotes.pemeriksaan_fisik}
            onChange={(field, value) =>
              updateNotes(field === 'pemeriksaan' ? 'pemeriksaan_fisik' : field, value)
            }
          />
        </Card>

        <Card title="Tanda Vital">
          <VitalSignsSection
            vitals={data.vitalSigns}
            onChange={(key, value) =>
              setData({ ...data, vitalSigns: { ...data.vitalSigns, [key]: value } })
            }
          />
        </Card>

        <Card title="Catatan Medis">
          <div className="space-y-3">
            <div>
              <Label>Catatan Diagnosis</Label>
              <Textarea
                value={data.clinicalNotes.catatan}
                onChange={(e) => updateNotes('catatan', e.target.value)}
                placeholder="Catatan diagnosa..."
                rows={3}
              />
            </div>
            <div>
              <Label>Tindakan</Label>
              <Textarea
                value={data.clinicalNotes.tindakan}
                onChange={(e) => updateNotes('tindakan', e.target.value)}
                placeholder="Tindakan..."
                rows={3}
              />
            </div>
            <div>
              <Label>Terapi Pengobatan</Label>
              <Textarea
                value={data.clinicalNotes.terapi_pengobatan}
                onChange={(e) => updateNotes('terapi_pengobatan', e.target.value)}
                placeholder="Terapi pengobatan..."
                rows={3}
              />
            </div>
          </div>
        </Card>

        <Card
          title={`Diagnosis (ICD-10)${
            data.diagnosa.length > 0 ? ` (${data.diagnosa.length})` : ''
          }`}
        >
          <DiagnosaSection
            rows={data.diagnosa}
            onChange={(diagnosa) => setData({ ...data, diagnosa })}
          />
        </Card>

        <Card
          title={`Tindakan (ICD-9)${data.tindakan.length > 0 ? ` (${data.tindakan.length})` : ''}`}
        >
          <TindakanSection
            rows={data.tindakan}
            onChange={(tindakan) => setData({ ...data, tindakan })}
          />
        </Card>
      </div>

      <ValidationPanel errors={allErrors} warnings={warnings} />
      <Footer
        saving={saving}
        hasErrors={hasBlocking}
        lastSaved={lastSaved}
        onSave={handleSave}
        onCancel={onClose}
        onRefresh={() => location.reload()}
      />
    </div>
  );
}
