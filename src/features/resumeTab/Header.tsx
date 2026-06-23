import { X, FileText } from 'lucide-react';
import { Button } from '../../ui/components/button';

interface HeaderProps {
  title: string;
  onClose: () => void;
}

export function Header({ title, onClose }: HeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0" style={{ background: 'linear-gradient(135deg, #f0f7ff 0%, #f8fafc 100%)' }}>
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: '#2563eb' }}>
          <FileText className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-lg font-bold text-foreground tracking-tight">{title}</h2>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-white/50"
      >
        <X className="h-4.5 w-4.5" />
      </Button>
    </div>
  );
}
