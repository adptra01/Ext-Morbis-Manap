import { type HTMLAttributes } from 'react'
import { cn } from '../lib/utils'

const variants = {
  default: 'md-badge--primary',
  success: 'md-badge--green',
  warning: 'md-badge--amber',
  danger: 'md-badge--red',
} as const

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variants
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  return (
    <span className={cn('md-badge', variants[variant], className)} {...props}>
      {children}
    </span>
  )
}
