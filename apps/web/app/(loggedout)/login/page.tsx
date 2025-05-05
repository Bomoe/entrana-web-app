import { authClient } from '@/lib/auth/client'
import { LoginForm } from './_components/LoginForm'
import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Page() {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })
  if (session) {
    redirect('/dashboard')
  }
  return <LoginForm />
}
