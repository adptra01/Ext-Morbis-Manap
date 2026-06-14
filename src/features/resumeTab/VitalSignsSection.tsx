import type { VitalSigns } from './types'

interface VitalSignsSectionProps {
  data: VitalSigns
  onChange: (data: VitalSigns) => void
}

const fields: { key: keyof VitalSigns; label: string; unit?: string }[] = [
  { key: 'tensi', label: 'Tensi', unit: 'mmHg' },
  { key: 'nadi', label: 'Nadi', unit: '/menit' },
  { key: 'suhu', label: 'Suhu', unit: '°C' },
  { key: 'nafas', label: 'Nafas', unit: '/menit' },
  { key: 'tinggi', label: 'Tinggi', unit: 'cm' },
  { key: 'berat', label: 'Berat', unit: 'kg' },
]

export function VitalSignsSection({ data, onChange }: VitalSignsSectionProps) {
  return (
    <div>
      <h3 className="text-md-sm font-semibold text-[var(--md-gray-700)] mb-2">Tanda Vital</h3>
      <div className="grid grid-cols-6 gap-2">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="md-label">{f.label}</label>
            <div className="relative">
              <input
                type="text"
                value={data[f.key]}
                onChange={(e) => onChange({ ...data, [f.key]: e.target.value })}
                className="md-input pr-6"
              />
              {f.unit && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-md-xs text-[var(--md-gray-400)] pointer-events-none">
                  {f.unit}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
