import { Button } from '@workspace/ui/components/button'
import { hiscores } from '@workspace/db/schema'
import { db } from '@workspace/db/db'

export default async function Page() {
  const data = await db.select().from(hiscores)
  console.log(data)
  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World</h1>
        <Button size="sm">Button</Button>
      </div>
    </div>
  )
}
