import { X } from 'lucide-react';
import { Button } from '../../ui/components/button';

interface HeaderProps {
  title: string;
  onClose: () => void;
}

export function Header({ title, onClose }: HeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0 bg-background">
      <h2 className="text-md-lg font-semibold text-foreground">{title}</h2>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
