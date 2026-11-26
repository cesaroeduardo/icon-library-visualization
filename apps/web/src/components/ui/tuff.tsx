import * as React from 'react'
import { cn } from '@/lib/utils'

/** TUFFUI Surface Primitives: Depth without borders (Shell -> Panel -> Inset) */

export function Shell({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-[1.375rem] bg-surface p-1.5', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function Panel({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-2xl bg-surface-inset', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function Inset({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-xl bg-foreground/[0.04]', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function IconTile({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'h-9 w-9 shrink-0 rounded-xl bg-foreground/[0.06] flex items-center justify-center text-foreground',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

type PillTone = 'brand' | 'positive' | 'negative' | 'warning' | 'neutral'

const pillTones: Record<PillTone, string> = {
  brand: 'bg-brand/15 text-brand',
  positive: 'bg-positive/15 text-positive',
  negative: 'bg-negative/15 text-negative',
  warning: 'bg-warning/15 text-warning',
  neutral: 'bg-foreground/[0.07] text-muted-foreground'
}

export function StatusPill({
  tone = 'neutral',
  size = 'md',
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: PillTone
  size?: 'sm' | 'md'
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        size === 'sm' ? 'h-5 px-2 text-[0.6875rem]' : 'h-6 px-2.5 text-xs',
        pillTones[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export function Tag({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center h-5 rounded-md bg-foreground/[0.06] px-1.5 font-mono text-[0.6875rem] text-muted-foreground',
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

type ButtonVariant = 'primary' | 'secondary' | 'quiet'

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: 'sm' | 'md'
}

export function ActionButton({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ActionButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-medium cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-brand/60 disabled:opacity-50',
        size === 'sm' ? 'h-8 px-3.5 text-[0.8125rem]' : 'h-9 px-4 text-sm',
        variant === 'primary' && 'tuff-btn-primary',
        variant === 'secondary' && 'tuff-btn-secondary',
        variant === 'quiet' &&
          'bg-transparent text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground transition-colors active:scale-[0.97]',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

interface ActionLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant
  size?: 'sm' | 'md'
}

export function ActionLink({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ActionLinkProps) {
  return (
    <a
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-medium cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-brand/60',
        size === 'sm' ? 'h-8 px-3.5 text-[0.8125rem]' : 'h-9 px-4 text-sm',
        variant === 'primary' && 'tuff-btn-primary',
        variant === 'secondary' && 'tuff-btn-secondary',
        variant === 'quiet' &&
          'bg-transparent text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground transition-colors active:scale-[0.97]',
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
}
