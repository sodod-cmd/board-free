import { cn } from '@/lib/utils'

export function Badge({
  className,
  tone = 'default',
  ...props
}: React.ComponentProps<'span'> & { tone?: 'default' | 'success' | 'muted' | 'danger' }) {
  const tones = {
    default: 'bg-primary/10 text-primary',
    success: 'bg-success/15 text-success',
    muted: 'bg-muted text-muted-foreground',
    danger: 'bg-destructive/10 text-destructive',
  } as const

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        tones[tone],
        className,
      )}
      {...props}
    />
  )
}
