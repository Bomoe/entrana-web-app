import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Dashboard } from './_components/Dashboard'

export default async function Page() {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })
  if (!session) {
    redirect('/login')
  }
  return <Dashboard username={session.user.displayUsername ?? ''} />
}
