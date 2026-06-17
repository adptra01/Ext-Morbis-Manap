import { Button } from '../../ui/components/button';

interface FooterProps {
  onClose: () => void;
  onSave: () => void;
  saving?: boolean;
}

export function Footer({ onClose, onSave, saving }: FooterProps) {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-border shrink-0 bg-background">
      <div />
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onClose}>
          Batal
        </Button>
        <Button variant="default" size="sm" onClick={onSave} disabled={saving}>
          {saving ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </div>
    </div>
  );
}
