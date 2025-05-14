'use client'

import { FormattedEventDetails } from '@/app/actions/events/types'
import { EventCard } from './EventCard'
import { Input } from '@workspace/ui/components/input'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { getMultipleEvents } from '@/app/actions/events/actions'
import { debounce } from 'lodash'

export function EventList({ allEvents, itemsPerPage }: EventListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [events, setEvents] = useState(allEvents)

  const debouncedSearch = debounce((newSearchTerm: string) => {
    getNewEvents({
      page: 0,
      take: itemsPerPage,
      search: newSearchTerm,
    })
  }, 300)

  async function getNewEvents({
    page,
    take,
    search,
  }: {
    page: number
    take: number
    search: string
  }) {
    const newEvents = await getMultipleEvents({
      take,
      skip: take * page,
      search,
    })
    setEvents(newEvents)
  }

  return (
    <div className="flex w-[70%] min-w-[70%] flex-col items-center justify-center gap-y-6">
      <div className="border-primary flex h-10 w-full items-center overflow-hidden rounded-md border">
        <div className="bg-primary flex h-full items-center">
          <Search className="mx-2 h-5 w-5" />
        </div>
        <Input
          onChange={(e) => debouncedSearch(e.target.value)}
          placeholder="Search events..."
          className="h-full w-full rounded-l-none border-0 p-2"
        />
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-y-4">
        {events.map((event) => (
          <EventCard key={event.id.toString()} event={event} />
        ))}
      </div>
    </div>
  )
}

type EventListProps = {
  allEvents: FormattedEventDetails[]
  itemsPerPage: number
}
