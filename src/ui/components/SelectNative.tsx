import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '../lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectNativeProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
}

const SelectNative = forwardRef<HTMLSelectElement, SelectNativeProps>(
  ({ className, options, ...props }, ref) => {
    return (
      <select
        className={cn(
          'flex h-11 w-full rounded-lg border-2 border-input bg-background px-3.5 py-2.5 text-base text-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 border-primary/50',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted',
          className,
        )}
        ref={ref}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  },
);
SelectNative.displayName = 'SelectNative';

export { SelectNative };
export type { SelectOption };
