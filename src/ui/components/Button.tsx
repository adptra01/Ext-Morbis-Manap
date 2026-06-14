import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '../lib/utils'

const variants = {
  primary:
    'bg-[#2469f0] text-white hover:bg-[#1d58cc] active:bg-[#1647a8] shadow-sm',
  secondary:
    'bg-[var(--md-gray-100)] text-[var(--md-gray-700)] hover:bg-[var(--md-gray-200)] active:bg-[var(--md-gray-300)] border border-[var(--md-gray-200)]',
  ghost:
    'text-[var(--md-gray-600)] hover:bg-[var(--md-gray-100)] active:bg-[var(--md-gray-200)]',
  danger:
    'bg-[#cc3340] text-white hover:bg-[#ad2b36] active:bg-[#8e232c] shadow-sm',
  success:
    'bg-[#1b8a4b] text-white hover:bg-[#16753f] active:bg-[#116033] shadow-sm',
} as const

const sizes = {
  sm: 'h-7 px-2.5 text-md-sm',
  md: 'h-8 px-3.5 text-md-sm',
  lg: 'h-9 px-4 text-md-base',
} as const

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2469f0] focus-visible:ring-offset-1',
          'disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-0.5 h-3.5 w-3.5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
