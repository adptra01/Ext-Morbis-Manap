import { Button } from '../../ui/components/button';
import { Badge } from '../../ui/components/Badge';

interface FooterProps {
  onCancel: () => void;
  onSave: () => void;
  saving?: boolean;
  hasErrors?: boolean;
  lastSaved?: string | null;
  onRefresh?: () => void;
  onHistory?: () => void;
}

export function Footer({
  onCancel,
  onSave,
  saving,
  hasErrors,
  lastSaved,
  onRefresh,
  onHistory,
}: FooterProps) {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-border shrink-0 bg-card">
      <div className="flex items-center gap-3">
        {hasErrors && (
          <Badge variant="danger" icon>
            Validasi gagal
          </Badge>
        )}
        {lastSaved && <span className="text-muted-foreground text-xs">Tersimpan {lastSaved}</span>}
        {saving && (
          <Badge variant="default" icon>
            Menyimpan...
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-2">
        {onHistory && (
          <Button type="button" variant="outline" size="default" onClick={onHistory}>
            Riwayat
          </Button>
        )}
        {onRefresh && (
          <Button type="button" variant="outline" size="default" onClick={onRefresh}>
            Reset
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
        >
          {saving ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </div>
    </div>
  );
}
