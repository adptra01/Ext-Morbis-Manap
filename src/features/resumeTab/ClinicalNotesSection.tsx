import { Label } from '../../ui/components/Label';
import { Textarea } from '../../ui/components/Textarea';

interface ClinicalNotesSectionProps {
  anamnesa: string;
  pemeriksaan: string;
  onChange: (field: 'anamnesa' | 'pemeriksaan', value: string) => void;
}

export function ClinicalNotesSection({
  anamnesa,
  pemeriksaan,
  onChange,
}: ClinicalNotesSectionProps) {
  return (
    <div className="py-5">
      <h3 className="text-[18px] font-bold text-foreground mb-4 font-['Lexend',system-ui,sans-serif]">
        Data Klinis
      </h3>
      <div className="space-y-5">
        <div>
          <Label>Anamnesa</Label>
          <Textarea
            value={anamnesa}
            onChange={(e) => onChange('anamnesa', e.target.value)}
            placeholder="Keluhan pasien..."
            rows={4}
          />
        </div>
        <div>
          <Label>Pemeriksaan Fisik</Label>
          <Textarea
            value={pemeriksaan}
            onChange={(e) => onChange('pemeriksaan', e.target.value)}
            placeholder="Hasil pemeriksaan..."
            rows={4}
          />
        </div>
      </div>
    </div>
  );
}
