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
    <div className="space-y-5">
      <div>
        <Label>Anamnesa</Label>
        <Textarea
          value={anamnesa}
          onChange={(e) => onChange('anamnesa', e.target.value)}
          placeholder="Keluhan pasien..."
          rows={5}
          aria-describedby="anamnesa-help"
        />
        <p id="anamnesa-help" className="text-base text-muted-foreground mt-1">
          Tuliskan keluhan utama, riwayat penyakit sekarang, dan riwayat penyakit dahulu
        </p>
      </div>
      <div>
        <Label>Pemeriksaan Fisik</Label>
        <Textarea
          value={pemeriksaan}
          onChange={(e) => onChange('pemeriksaan', e.target.value)}
          placeholder="Hasil pemeriksaan fisik..."
          rows={5}
          aria-describedby="pemeriksaan-help"
        />
        <p id="pemeriksaan-help" className="text-base text-muted-foreground mt-1">
          Catat hasil pemeriksaan umum dan sistemik
        </p>
      </div>
    </div>
  );
}
