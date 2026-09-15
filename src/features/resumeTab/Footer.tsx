import { Button } from '../../ui/components/button';
import { Badge } from '../../ui/components/Badge';
import type { ResumeData } from './types';

interface FooterProps {
  onCancel: () => void;
  onSave: () => void;
  /** ponytail: onRefresh is the seam App.tsx uses (`() => location.reload()`). Keep it stable; confirmation is layered in App if needed. */
  onRefresh?: () => void;
  onReset?: () => void;
  onHistory?: () => void;
  saving?: boolean;
  hasErrors?: boolean;
  lastSaved?: string | null;
}

export function Footer({
  onCancel,
  onSave,
  onRefresh,
  onReset,
  onHistory,
  saving,
  hasErrors,
  lastSaved,
}: FooterProps) {
  const handleReset = onReset ?? onRefresh;
  return (
    <div className="flex items-center justify-between px-6 py-4 border-t-2 border-border bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 shrink-0 sticky bottom-0 z-[1]">
      <div className="flex items-center gap-3 min-w-0">
        {hasErrors && (
          <Badge variant="danger" icon>
            Validasi gagal
          </Badge>
        )}
        {lastSaved && (
          <span className="text-sm text-muted-foreground truncate">Tersimpan {lastSaved}</span>
        )}
        {saving && (
          <Badge variant="default" icon>
            Menyimpan...
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-3">
        {onHistory && (
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={onHistory}
            className="gap-2"
          >
            Riwayat
          </Button>
        )}
        {handleReset && (
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={handleReset}
            className="gap-2"
          >
            Reset Formulir
          </Button>
        )}
        <Button type="button" variant="secondary" size="default" onClick={onCancel}>
          Batal
        </Button>
        <Button
          type="button"
          variant="default"
          size="lg"
          onClick={onSave}
          disabled={saving || hasErrors}
          className="gap-2 px-7 min-h-11"
          aria-label="Simpan resume"
        >
          {saving ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </div>
    </div>
  );
}
