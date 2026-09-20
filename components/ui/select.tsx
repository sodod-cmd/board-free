import { cn } from '@/lib/utils'

/** Энгийн төрөлх (native) select. TV самбарын админд хангалттай. */
export function Select({ className, ...props }: React.ComponentProps<'select'>) {
  return (
    <select
      data-slot="select"
      className={cn(
        'h-9 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-xs outline-none transition-colors',
        'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
