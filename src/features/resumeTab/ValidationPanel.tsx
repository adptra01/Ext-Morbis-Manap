import { AlertTriangle } from 'lucide-react';

interface ValidationError {
  section: string;
  message: string;
}

interface ValidationPanelProps {
  errors: ValidationError[];
  warnings?: ValidationError[];
}

export function ValidationPanel({ errors, warnings = [] }: ValidationPanelProps) {
  const hasAny = errors.length > 0 || warnings.length > 0;
  if (!hasAny) return null;

  return (
    <>
      {warnings.length > 0 && (
        <div className="px-6 py-4 border-t-2 border-[#e2ddd7] bg-[#fefce8]" role="alert">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-5 text-[#b45309] shrink-0 mt-0.5" />
            <div>
              <p className="text-[15px] font-bold text-[#92400e] mb-1">Perhatian</p>
              <ul className="space-y-1">
                {warnings.map((w, i) => (
                  <li key={i} className="text-[14px] text-[#a16207]">
                    {w.section}: {w.message}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      {errors.length > 0 && (
        <div className="px-6 py-4 border-t-2 border-[#e2ddd7] bg-[#fef2f2]" role="alert">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-5 text-[#b91c1c] shrink-0 mt-0.5" />
            <div>
              <p className="text-[15px] font-bold text-[#991b1b] mb-1">
                Terdapat {errors.length} kesalahan
              </p>
              <ul className="space-y-1">
                {errors.map((err, i) => (
                  <li key={i} className="text-[14px] text-[#b91c1c]/80">
                    {err.section}: {err.message}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
