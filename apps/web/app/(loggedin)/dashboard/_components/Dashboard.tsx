'use client'

import { Button } from '@workspace/ui/components/button'
import { authClient } from '@/lib/auth/client'
import { useRouter } from 'next/navigation'

export function Dashboard({ username }: { username: string }) {
  const router = useRouter()

  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/login')
        },
      },
    })
  }

  return (
    <div>
      <p>Welcome {username}!</p>
      <Button onClick={signOut}>Logout</Button>
    </div>
  )
}
