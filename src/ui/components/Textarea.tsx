import { forwardRef, useRef, useEffect, type TextareaHTMLAttributes } from 'react';
import { cn } from '../lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoResize?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autoResize = true, onChange, ...props }, ref) => {
    const innerRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || innerRef;

    useEffect(() => {
      if (autoResize && textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
      }
    }, [props.value, autoResize, textareaRef]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (autoResize) {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
      }
      onChange?.(e);
    };

    return (
      <textarea
        ref={textareaRef}
        className={cn(
          'flex w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-md-sm text-foreground',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'resize-y min-h-[50px] leading-relaxed',
          className,
        )}
        onChange={handleChange}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
