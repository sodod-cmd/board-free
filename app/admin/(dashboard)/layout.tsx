import { redirect } from 'next/navigation'
import { AdminShell } from '@/components/admin/admin-shell'
import { getCurrentAdmin } from '@/lib/session'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Админ самбар | Мэдээллийн самбар',
}

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await getCurrentAdmin()
  if (!admin) redirect('/admin/login')

  return (
    <AdminShell admin={{ username: admin.username, name: admin.name }}>{children}</AdminShell>
  )
}
