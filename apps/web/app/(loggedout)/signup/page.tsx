import { auth } from '@/lib/auth/auth'
import { SignupForm } from './_components/SignupForm'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Page() {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })
  if (session) {
    redirect('/dashboard')
  }
  return (
    <div className="min-h-svh w-full">
      <SignupForm />
    </div>
  )
}
