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
    <div className="px-5 py-4 border-b border-border bg-background">
      <h3 className="text-md-sm font-semibold text-foreground mb-3">Tanda Vital</h3>
      <div className="grid grid-cols-6 gap-3">
        {fields.map((f) => (
          <div key={f.key} className="space-y-1.5">
            <label className="text-[10px] font-semibold text-muted-foreground uppercase ml-1">
              {f.label}
            </label>
            <div className="relative">
              <Input
                value={vitals[f.key as keyof typeof vitals]}
                onChange={(e) => onChange(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="pr-10 text-md-xs h-9"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-medium text-muted-foreground/60 pointer-events-none">
                {f.unit}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
