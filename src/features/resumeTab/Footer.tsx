import { Button } from '../../ui/components/button';

interface FooterProps {
  onCancel: () => void;
  onSave: () => void;
  saving?: boolean;
  hasErrors?: boolean;
  lastSaved?: string | null;
}

export function Footer({ onCancel, onSave, saving, hasErrors, lastSaved }: FooterProps) {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-border shrink-0 bg-background text-md-xs">
      <div className="flex items-center gap-3">
        {hasErrors && (
          <span className="text-destructive flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-destructive" />
            Validasi gagal
          </span>
        )}
        {lastSaved && <span className="text-muted-foreground">Tersimpan pukul {lastSaved}</span>}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Batal
        </Button>
        <Button variant="default" size="sm" onClick={onSave} disabled={saving || hasErrors}>
          {saving ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </div>
    </div>
  );
}
