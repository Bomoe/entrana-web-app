import { getMultipleEvents } from '@/app/actions/events/actions'
import { EventList } from './_components/EventList'
import { FormattedEventDetails } from '@/app/actions/events/types'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const itemsPerPage = 10
  const foundEvents = await getMultipleEvents({ take: itemsPerPage, skip: 0 })
  return (
    <div className="mx-auto my-4 flex w-full flex-col items-center justify-center gap-y-4">
      <p className="text-2xl font-semibold">Events</p>
      <EventList allEvents={foundEvents} itemsPerPage={itemsPerPage} />
    </div>
  )
}
