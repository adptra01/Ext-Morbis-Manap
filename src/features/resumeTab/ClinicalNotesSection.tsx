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
    <div className="px-5 py-4 border-b border-border bg-background">
      <h3 className="text-md-sm font-semibold text-foreground mb-3">Data Klinis</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1.5 ml-1">
            Anamnesa
          </label>
          <textarea
            value={anamnesa}
            onChange={(e) => onChange('anamnesa', e.target.value)}
            className="w-full h-24 rounded-md border border-input bg-background px-3 py-2 text-md-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            placeholder="Keluhan pasien..."
          />
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1.5 ml-1">
            Pemeriksaan Fisik
          </label>
          <textarea
            value={pemeriksaan}
            onChange={(e) => onChange('pemeriksaan', e.target.value)}
            className="w-full h-24 rounded-md border border-input bg-background px-3 py-2 text-md-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            placeholder="Hasil pemeriksaan..."
          />
        </div>
      </div>
    </div>
  );
}
