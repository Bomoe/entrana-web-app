import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Dashboard } from './_components/Dashboard'
import { db } from '@workspace/db/db'
import { getUserPermissions } from '@/app/actions/auth/actions'

export default async function Page() {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })

  if (!session) {
    redirect('/login')
  }

  const userPermissions = await getUserPermissions({ userId: session.user.id })

  const isAdmin = userPermissions.size > 0

  return (
    <Dashboard
      username={session.user.displayUsername ?? ''}
      isAdmin={isAdmin}
    />
  )
}
