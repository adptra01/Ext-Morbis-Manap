import { cn } from '../lib/utils';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  helperText?: string;
}

export function Label({ className, required, helperText, children, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        'block text-base font-semibold text-foreground uppercase tracking-[0.03em] mb-1.5',
        className,
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="text-destructive ml-1" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}
