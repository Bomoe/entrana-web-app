'use client'

import { Button } from '@workspace/ui/components/button'
import { authClient } from '@/lib/auth/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getMemberDataForCSV, MemberData } from '@/app/actions/wom/actions'

export function Dashboard({ username, isAdmin }: DashboardProps) {
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

  async function getMemberCSV() {
    const memberData = await getMemberDataForCSV()

    if (memberData.length === 0) {
      console.error('Could not get member data.')
      return
    }

    const headers = ['Display Name', 'Role']

    const rows = memberData.map((member) => [member.displayName, member.role])

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((field) => `"${field.replace(/"/g, '""')}"`).join(',')
      )
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute(
      'download',
      `wom-members-${new Date().toLocaleDateString()}.csv`
    )
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-y-1">
      <p>Welcome {username}!</p>
      <div className="flex flex-row gap-x-2">
        <Button onClick={signOut}>Logout</Button>
        {isAdmin && (
          <>
            <Button>
              <Link href={'/admin'}>Admin Panel</Link>
            </Button>
            <Button onClick={() => getMemberCSV()}>Download WOM CSV</Button>
          </>
        )}
      </div>
    </div>
  )
}

type DashboardProps = { username: string; isAdmin: boolean }
