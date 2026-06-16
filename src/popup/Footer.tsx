import { RefreshCw, RotateCcw } from 'lucide-react';
import { Button } from '../ui/components/button';

interface FooterProps {
  onReload: () => void;
  onReset: () => void;
}

export function Footer({ onReload, onReset }: FooterProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 border-t border-border">
      <Button variant="default" size="sm" className="flex-1" onClick={onReload}>
        <RefreshCw className="size-3.5" />
        Reload Halaman
      </Button>
      <Button variant="secondary" size="sm" className="flex-1" onClick={onReset}>
        <RotateCcw className="size-3.5" />
        Reset Default
      </Button>
    </div>
  );
}
