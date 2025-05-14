'use client'

import { FormattedEventDetails } from '@/app/actions/events/types'
import { EventCard } from './EventCard'
import { SearchBar } from '@workspace/ui/components/search-bar'
import { useState } from 'react'
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
  }, 250)

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
      <SearchBar
        placeholderText="Search Events..."
        onValueChange={debouncedSearch}
      />
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
