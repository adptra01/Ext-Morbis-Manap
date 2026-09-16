import { X, Check, AlertTriangle, Info } from 'lucide-react';
import { cn } from '../lib/utils';

const variants = {
  default: 'bg-primary/10 text-primary border-primary/20',
  success:
    'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
  warning:
    'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  danger: 'bg-destructive/10 text-destructive border-destructive/20',
} as const;

const icons = {
  default: Info,
  success: Check,
  warning: AlertTriangle,
  danger: X,
} as const;

interface BadgeProps {
  variant?: keyof typeof variants;
  icon?: boolean;
  children: React.ReactNode;
  className?: string;
  onDismiss?: () => void;
}

export function Badge({ variant = 'default', icon, children, className, onDismiss }: BadgeProps) {
  const Icon = icons[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-base font-semibold',
        variants[variant],
        className,
      )}
    >
      {icon && <Icon className="size-3.5" />}
      {children}
      {onDismiss && (
        <button onClick={onDismiss} className="ml-1 hover:opacity-70 p-0.5" aria-label="Dismiss">
          <X className="size-3.5" />
        </button>
      )}
    </span>
  );
}
