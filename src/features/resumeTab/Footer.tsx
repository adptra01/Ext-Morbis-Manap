import { Button } from '../../ui/components/button';

interface FooterProps {
  onCancel: () => void;
  onSave: () => void;
  saving?: boolean;
  hasErrors?: boolean;
  lastSaved?: string | null;
  onRefresh?: () => void;
}

export function Footer({ onCancel, onSave, saving, hasErrors, lastSaved, onRefresh }: FooterProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-border shrink-0 text-md-xs" style={{ background: '#f8fafc' }}>
      <div className="flex items-center gap-3">
        {hasErrors && (
          <span className="text-destructive flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-destructive" />
            Validasi gagal
          </span>
        )}
        {lastSaved && <span className="text-muted-foreground">Tersimpan pukul {lastSaved}</span>}
      </div>
      <div className="flex items-center gap-3">
        {onRefresh && (
          <Button variant="outline" size="xl" onClick={onRefresh} className="px-6 py-3">
            Refresh
          </Button>
        )}
        <Button variant="outline" size="xl" onClick={onCancel} className="px-6 py-3">
          Batal
        </Button>
        <Button variant="default" size="xl" onClick={onSave} disabled={saving || hasErrors} className="px-8 py-3"
          style={{ boxShadow: '0 4px 14px rgba(37,99,235,0.3)', padding: '0 32px' }}>
          {saving ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </div>
    </div>
  );
}
