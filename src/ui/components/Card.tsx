import { cn } from '../lib/utils';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, children, className }: CardProps) {
  return (
    <div className={cn('bg-card border border-border rounded-lg mb-3 overflow-hidden', className)}>
      <div className="px-3.5 py-2 bg-primary/5 border-b border-primary/15 text-[13px] font-bold text-primary flex items-center gap-1.5">
        <span className="text-sm">●</span>
        {title}
      </div>
      <div className="p-3.5">{children}</div>
    </div>
  );
}
