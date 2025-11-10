import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import AdminDashboard from './AdminDashboard'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const adminSession = cookieStore.get('admin_session')

  // Server-side authentication check
  if (!adminSession || adminSession.value !== 'authenticated') {
    redirect('/admin/login')
  }

  return <AdminDashboard />
}
