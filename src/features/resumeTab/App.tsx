import { useState, useCallback, useRef } from 'react';
import type { ResumeData, ValidationError } from './types';
import { Header } from './Header';
import { InfoBanner } from './InfoBanner';
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
      <Header title="Resume Rawat Jalan" onClose={onClose} />

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        <InfoBanner data={data.patientInfo} />

        <ClinicalNotesSection
          anamnesa={data.clinicalNotes.anamnesa}
          pemeriksaan={data.clinicalNotes.pemeriksaan_fisik}
          onChange={(field, value) =>
            updateNotes(field === 'pemeriksaan' ? 'pemeriksaan_fisik' : field, value)
          }
        />

        <hr className="border-t-2 border-[#e2ddd7]" />

        <div>
          <h3 className="text-[18px] font-bold text-[#1a1d23] mb-4 font-['Lexend',system-ui,sans-serif]">
            Catatan Diagnosa
          </h3>
          <textarea
            value={data.clinicalNotes.catatan}
            onChange={(e) => updateNotes('catatan', e.target.value)}
            className="w-full rounded-xl border-2 border-[#e2ddd7] bg-white px-4 py-3 text-[16px] leading-relaxed text-[#1a1d23] placeholder:text-[#a0988f] outline-none transition-colors focus:border-[#2b5f8a] focus:shadow-[0_0_0_3px_rgba(43,95,138,0.15)] resize-y"
            placeholder="Catatan diagnosa..."
            rows={3}
          />
        </div>

        <hr className="border-t-2 border-[#e2ddd7]" />

        <div>
          <h3 className="text-[18px] font-bold text-[#1a1d23] mb-4 font-['Lexend',system-ui,sans-serif]">
            Tindakan
          </h3>
          <textarea
            value={data.clinicalNotes.tindakan}
            onChange={(e) => updateNotes('tindakan', e.target.value)}
            className="w-full rounded-xl border-2 border-[#e2ddd7] bg-white px-4 py-3 text-[16px] leading-relaxed text-[#1a1d23] placeholder:text-[#a0988f] outline-none transition-colors focus:border-[#2b5f8a] focus:shadow-[0_0_0_3px_rgba(43,95,138,0.15)] resize-y"
            placeholder="Tindakan..."
            rows={3}
          />
        </div>

        <hr className="border-t-2 border-[#e2ddd7]" />

        <div>
          <h3 className="text-[18px] font-bold text-[#1a1d23] mb-4 font-['Lexend',system-ui,sans-serif]">
            Terapi Pengobatan
          </h3>
          <textarea
            value={data.clinicalNotes.terapi_pengobatan}
            onChange={(e) => updateNotes('terapi_pengobatan', e.target.value)}
            className="w-full rounded-xl border-2 border-[#e2ddd7] bg-white px-4 py-3 text-[16px] leading-relaxed text-[#1a1d23] placeholder:text-[#a0988f] outline-none transition-colors focus:border-[#2b5f8a] focus:shadow-[0_0_0_3px_rgba(43,95,138,0.15)] resize-y"
            placeholder="Terapi pengobatan..."
            rows={3}
          />
        </div>

        <hr className="border-t-2 border-[#e2ddd7]" />

        <VitalSignsSection
          vitals={data.vitalSigns}
          onChange={(key, value) =>
            setData({ ...data, vitalSigns: { ...data.vitalSigns, [key]: value } })
          }
        />

        <hr className="border-t-2 border-[#e2ddd7]" />

        <DiagnosaSection
          rows={data.diagnosa}
          onChange={(diagnosa) => setData({ ...data, diagnosa })}
        />

        <hr className="border-t-2 border-[#e2ddd7]" />

        <TindakanSection
          rows={data.tindakan}
          onChange={(tindakan) => setData({ ...data, tindakan })}
        />
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
