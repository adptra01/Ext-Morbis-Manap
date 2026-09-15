import { cn } from '../lib/utils';

interface GridProps {
  children: React.ReactNode;
  cols?: 2 | 3;
  className?: string;
}

export function Grid({ children, cols = 2, className }: GridProps) {
  return (
    <div
      className={cn(
        'grid gap-4',
        cols === 2 && 'grid-cols-1 md:grid-cols-2',
        cols === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Full({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('col-span-full', className)}>{children}</div>;
}
