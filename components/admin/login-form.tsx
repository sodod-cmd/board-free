'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, LogIn, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@/lib/admin-client'

export function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const nextPath = params.get('next') || '/admin'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await api('/api/auth/login', { method: 'POST', json: { username, password } })
      router.replace(nextPath.startsWith('/admin') ? nextPath : '/admin')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Нэвтрэхэд алдаа гарлаа.')
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="flex flex-col gap-6 py-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex items-center justify-center rounded-xl bg-primary p-2">
            <Image
              src="/images/logo.webp"
              alt="Лого"
              width={120}
              height={38}
              className="h-8 w-auto brightness-0 invert"
              priority
            />
          </span>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Админ нэвтрэх</h1>
            <p className="text-sm text-muted-foreground">Мэдээллийн самбарын удирдлага</p>
          </div>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="username">Нэвтрэх нэр</Label>
            <Input
              id="username"
              value={username}
              autoComplete="username"
              autoFocus
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Нууц үг</Label>
            <Input
              id="password"
              type="password"
              value={password}
              autoComplete="current-password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <TriangleAlert className="size-4 shrink-0" />
              {error}
            </p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
            Нэвтрэх
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
