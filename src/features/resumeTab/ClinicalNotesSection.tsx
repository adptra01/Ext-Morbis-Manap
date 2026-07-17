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
      <h3 className="text-[18px] font-bold text-[#1a1d23] mb-4 font-['Lexend',system-ui,sans-serif]">
        Data Klinis
      </h3>
      <div className="space-y-5">
        <div>
          <label className="block text-[15px] font-semibold text-[#4a4e57] mb-2">Anamnesa</label>
          <textarea
            value={anamnesa}
            onChange={(e) => onChange('anamnesa', e.target.value)}
            className="w-full rounded-xl border-2 border-[#e2ddd7] bg-white px-4 py-3 text-[16px] leading-relaxed text-[#1a1d23] placeholder:text-[#a0988f] outline-none transition-colors focus:border-[#2b5f8a] focus:shadow-[0_0_0_3px_rgba(43,95,138,0.15)] resize-y"
            placeholder="Keluhan pasien..."
            rows={4}
          />
        </div>
        <div>
          <label className="block text-[15px] font-semibold text-[#4a4e57] mb-2">
            Pemeriksaan Fisik
          </label>
          <textarea
            value={pemeriksaan}
            onChange={(e) => onChange('pemeriksaan', e.target.value)}
            className="w-full rounded-xl border-2 border-[#e2ddd7] bg-white px-4 py-3 text-[16px] leading-relaxed text-[#1a1d23] placeholder:text-[#a0988f] outline-none transition-colors focus:border-[#2b5f8a] focus:shadow-[0_0_0_3px_rgba(43,95,138,0.15)] resize-y"
            placeholder="Hasil pemeriksaan..."
            rows={4}
          />
        </div>
      </div>
    </div>
  );
}
