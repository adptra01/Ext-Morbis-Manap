import { AlertTriangle } from 'lucide-react';

interface ValidationError {
  section: string;
  message: string;
}

interface ValidationPanelProps {
  errors: ValidationError[];
}

export function ValidationPanel({ errors }: ValidationPanelProps) {
  if (errors.length === 0) return null;

  return (
    <div className="px-5 py-3 bg-destructive/10 border-t border-destructive/20" role="alert">
      <div className="flex items-start gap-2">
        <AlertTriangle className="size-4 text-destructive shrink-0 mt-0.5" />
        <div>
          <p className="text-md-xs font-semibold text-destructive mb-1">
            Terdapat {errors.length} kesalahan
          </p>
          <ul className="space-y-0.5">
            {errors.map((err, i) => (
              <li key={i} className="text-md-xs text-destructive/80">
                {err.section}: {err.message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
