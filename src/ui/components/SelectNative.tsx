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
          'flex h-8 w-full rounded-md border border-input bg-background px-2.5 py-1 text-md-sm text-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
          'disabled:cursor-not-allowed disabled:opacity-50',
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
