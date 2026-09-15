import { cn } from '../lib/utils';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, children, className }: CardProps) {
  return (
    <div
      className={cn(
        'bg-background border-2 border-border rounded-xl mb-4 overflow-hidden shadow-sm',
        className,
      )}
    >
      <div className="px-4 py-3 bg-primary/5 border-b border-primary/20 text-base font-bold text-primary flex items-center gap-2">
        <span className="text-base" aria-hidden="true">
          ●
        </span>
        {title}
      </div>
      <div className="p-4 space-y-4">{children}</div>
    </div>
  );
}
