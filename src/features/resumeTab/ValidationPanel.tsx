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
        <div
          className="px-6 py-4 border-t-2 border-border bg-yellow-50 dark:bg-yellow-950/30"
          role="alert"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-[15px] font-bold text-yellow-800 dark:text-yellow-300 mb-1">
                Perhatian
              </p>
              <ul className="space-y-1">
                {warnings.map((w, i) => (
                  <li key={i} className="text-[14px] text-yellow-700 dark:text-yellow-400">
                    {w.section}: {w.message}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      {errors.length > 0 && (
        <div className="px-6 py-4 border-t-2 border-border bg-destructive/5" role="alert">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-[15px] font-bold text-destructive mb-1">
                Terdapat {errors.length} kesalahan
              </p>
              <ul className="space-y-1">
                {errors.map((err, i) => (
                  <li key={i} className="text-[14px] text-destructive/80">
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
