'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  GraduationCap,
  Images,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  Monitor,
  Star,
  Users,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/admin', label: 'Хяналтын самбар', icon: LayoutDashboard },
  { href: '/admin/slides', label: 'Слайдер', icon: Images },
  { href: '/admin/news', label: 'Онцлох мэдээ', icon: Star },
  { href: '/admin/ticker', label: 'Урсдаг мэдээ', icon: Megaphone },
  { href: '/admin/classes', label: 'Ангиуд', icon: GraduationCap },
  { href: '/admin/admins', label: 'Админууд', icon: Users },
]

export function AdminShell({
  admin,
  children,
}: {
  admin: { username: string; name?: string }
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.replace('/admin/login')
    router.refresh()
  }

  const nav = (
    <nav className="flex flex-col gap-1 p-3">
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = href === '/admin' ? pathname === href : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </Link>
        )
      })}

      <div className="my-2 h-px bg-border" />

      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Monitor className="size-4 shrink-0" />
        Самбарыг үзэх
      </Link>
    </nav>
  )

  return (
    <div className="flex min-h-dvh bg-background">
      {/* Гар утасны хөшиг */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <div className="leading-tight">
            <p className="text-sm font-semibold">Админ самбар</p>
            <p className="text-xs text-muted-foreground">Нэст Эдүкэйшн IT</p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            aria-label="Хаах"
            onClick={() => setOpen(false)}
          >
            <X className="size-4" />
          </Button>
        </div>

        {nav}

        <div className="mt-auto border-t border-border p-3">
          <div className="mb-2 px-3">
            <p className="truncate text-sm font-medium">{admin.name || admin.username}</p>
            <p className="truncate text-xs text-muted-foreground">@{admin.username}</p>
          </div>
          <Button variant="outline" size="lg" className="w-full" onClick={logout}>
            <LogOut className="size-4" />
            Гарах
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3 lg:hidden">
          <Button variant="ghost" size="icon" aria-label="Цэс" onClick={() => setOpen(true)}>
            <Menu className="size-5" />
          </Button>
          <p className="text-sm font-semibold">Админ самбар</p>
        </header>

        <main className="min-w-0 flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
