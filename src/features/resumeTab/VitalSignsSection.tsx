interface VitalSignsSectionProps {
  vitals: {
    tensi: string;
    nadi: string;
    suhu: string;
    nafas: string;
    berat: string;
    tinggi: string;
  };
  onChange: (field: string, value: string) => void;
}

export function VitalSignsSection({ vitals, onChange }: VitalSignsSectionProps) {
  const fields = [
    { key: 'tensi', label: 'Tensi', unit: 'mmHg', placeholder: '120/80' },
    { key: 'nadi', label: 'Nadi', unit: 'x/mnt', placeholder: '80' },
    { key: 'suhu', label: 'Suhu', unit: '°C', placeholder: '36.5' },
    { key: 'nafas', label: 'Nafas', unit: 'x/mnt', placeholder: '20' },
    { key: 'berat', label: 'Berat', unit: 'kg', placeholder: '60' },
    { key: 'tinggi', label: 'Tinggi', unit: 'cm', placeholder: '165' },
  ];

  return (
    <div>
      <h3 className="text-[18px] font-bold text-[#1a1d23] mb-4 font-['Lexend',system-ui,sans-serif]">
        Tanda Vital
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="block text-[14px] font-semibold text-[#4a4e57] mb-1.5 ml-1">
              {f.label}
            </label>
            <div className="relative">
              <input
                value={vitals[f.key as keyof typeof vitals]}
                onChange={(e) => onChange(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="w-full h-12 rounded-xl border-2 border-[#e2ddd7] bg-white px-4 pr-14 text-[16px] text-[#1a1d23] placeholder:text-[#a0988f] outline-none transition-colors focus:border-[#2b5f8a] focus:shadow-[0_0_0_3px_rgba(43,95,138,0.15)]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-[#a0988f] pointer-events-none">
                {f.unit}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
