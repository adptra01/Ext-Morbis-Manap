import { Label } from '../../ui/components/Label';
import { Input } from '../../ui/components/input';

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
      <h3 className="text-[18px] font-bold text-foreground mb-4 font-['Lexend',system-ui,sans-serif]">
        Tanda Vital
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {fields.map((f) => (
          <div key={f.key}>
            <Label>{f.label}</Label>
            <div className="relative">
              <Input
                value={vitals[f.key as keyof typeof vitals]}
                onChange={(e) => onChange(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="pr-14"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-muted-foreground pointer-events-none">
                {f.unit}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
