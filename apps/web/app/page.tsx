import { Button } from '@workspace/ui/components/button'
import { usersTable } from '@workspace/db/schema'
import { db } from '@workspace/db/db'

export default async function Page() {
  const users = await db.select().from(usersTable)
  console.log(users)
  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World</h1>
        <Button size="sm">Button</Button>
      </div>
    </div>
  )
}
