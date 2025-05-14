'use client'

import { FormattedEventDetails } from '@/app/actions/events/types'
import { Card, CardContent } from '@workspace/ui/components/card'
import { Separator } from '@workspace/ui/components/separator'
import {
  format,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from 'date-fns'
import { useState, useEffect } from 'react'
import { EventType } from '@workspace/db/schema'
import { formatDate } from '@/lib/utils/formatDate'
import { useCountdown } from '@/lib/hooks/useCountdown'
import { Button } from '@workspace/ui/components/button'
import { cn } from '@workspace/ui/lib/utils'
import { useRouter } from 'next/navigation'

export function EventCard({ event }: EventCardProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [remainingTimeString, setRemainingTimeString] = useState('Event ended')
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useCountdown({
    endDate: event.end,
    onTimeRemainingUpdate: setRemainingTimeString,
  })

  const startFormatted = event.start ? formatDate(event.start) : ''
  const endFormatted = event.end ? formatDate(event.end) : ''
  const isSkillBased = event.type === EventType.Skill

  return (
    <Card
      className={cn(
        isMounted &&
          'hover:border-primary/50 hover:bg-card/50 cursor-pointer transition-colors',
        'w-full'
      )}
      onClick={() => router.push(`events/${event.id}`)}
    >
      <CardContent className="p-3">
        {!isMounted ? (
          // Loading skeleton
          <div className="flex flex-col space-y-2">
            <div className="bg-secondary/30 h-4 w-3/4 animate-pulse rounded" />
            <div className="bg-secondary/30 h-3 w-full animate-pulse rounded" />
            <div className="mt-2 grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-secondary/20 rounded-md p-1.5">
                  <div className="flex flex-col">
                    <div className="bg-secondary/30 h-2 w-1/3 animate-pulse rounded" />
                    <div className="bg-secondary/30 mt-1 h-3 w-2/3 animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex w-full flex-col space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{event.name}</h3>
              <span className="bg-secondary/30 rounded-full px-2 py-0.5 text-sm">
                {isSkillBased
                  ? `Skill: ${event.skillName}`
                  : event.type === EventType.Activity
                    ? `Activity: ${event.activityName}`
                    : event.type}
              </span>
            </div>
            <p className="text-muted-foreground line-clamp-2 text-sm">
              {event.description}
            </p>
            <div className="mt-2 grid grid-cols-4 gap-2">
              <div className="bg-secondary/20 rounded-md p-1.5">
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-[10px] uppercase tracking-wider">
                    Start
                  </span>
                  <span className="truncate text-sm font-medium">
                    {startFormatted}
                  </span>
                </div>
              </div>
              <div className="bg-secondary/20 rounded-md p-1.5">
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-[10px] uppercase tracking-wider">
                    End
                  </span>
                  <span className="truncate text-sm font-medium">
                    {endFormatted}
                  </span>
                </div>
              </div>
              <div className="bg-primary/10 border-primary/20 col-span-2 rounded-md border p-1.5">
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-[10px] uppercase tracking-wider">
                    Time Remaining
                  </span>
                  <span className="truncate text-sm font-semibold">
                    {remainingTimeString}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

type EventCardProps = { event: FormattedEventDetails }
