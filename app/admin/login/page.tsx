import { Suspense } from 'react'
import { LoginForm } from '@/components/admin/login-form'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Админ нэвтрэх | Мэдээллийн самбар',
}

export default function LoginPage() {
  return (
    <main className="bg-app flex min-h-dvh items-center justify-center p-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  )
}
