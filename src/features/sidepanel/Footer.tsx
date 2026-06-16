import { RefreshCw, RotateCcw } from 'lucide-react';
import { Button } from '../../ui/components/button';

interface FooterProps {
  onReload: () => void;
  onReset: () => void;
}

export function Footer({ onReload, onReset }: FooterProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-border">
      <Button variant="ghost" size="sm" onClick={onReload}>
        <RefreshCw className="size-3.5" />
        Reload Halaman
      </Button>
      <Button variant="ghost" size="sm" onClick={onReset}>
        <RotateCcw className="size-3.5" />
        Reset Default
      </Button>
    </div>
  );
}
