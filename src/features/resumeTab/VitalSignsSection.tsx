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
    { key: 'tensi', label: 'Tekanan Darah', unit: 'mmHg', placeholder: '120/80' },
    { key: 'nadi', label: 'Nadi', unit: 'x/menit', placeholder: '80' },
    { key: 'suhu', label: 'Suhu Tubuh', unit: '°C', placeholder: '36.5' },
    { key: 'nafas', label: 'Respirasi', unit: 'x/menit', placeholder: '20' },
    { key: 'berat', label: 'Berat Badan', unit: 'kg', placeholder: '60' },
    { key: 'tinggi', label: 'Tinggi Badan', unit: 'cm', placeholder: '165' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {fields.map((f) => (
        <div key={f.key} className="space-y-1.5">
          <Label>{f.label}</Label>
          <div className="relative">
            <Input
              value={vitals[f.key as keyof typeof vitals]}
              onChange={(e) => onChange(f.key, e.target.value)}
              placeholder={f.placeholder}
              className="pr-20 font-mono text-base"
              aria-label={f.label}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground pointer-events-none">
              {f.unit}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
