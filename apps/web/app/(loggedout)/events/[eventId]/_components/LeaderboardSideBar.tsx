'use client'

import { EventDetails } from '@/app/actions/events/types'
import { Card, CardContent } from '@workspace/ui/components/card'
import {
  differenceInDays,
  differenceInHours,
  differenceInMilliseconds,
  differenceInMinutes,
  differenceInSeconds,
  format,
} from 'date-fns'
import { useState, useEffect } from 'react'
import { Separator } from '@workspace/ui/components/separator'

export function LeaderboardSideBar({
  eventDetails,
  totalNum,
  isSkillBased,
}: LeaderboardSideBarProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [remainingTime, setRemainingTime] = useState(0)
  const [remainingTimeString, setRemainingTimeString] = useState('Event ended')

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const timeLeft = getTimeLeft(eventDetails.events.end)
    const timer = setTimeout(() => setRemainingTime(timeLeft ?? 0), 1000)
    return () => clearTimeout(timer)
  }, [remainingTime])

  function formatDate(date: Date | string | null | undefined) {
    if (!date) return ''
    const dateObj = date instanceof Date ? date : new Date(date)
    return format(dateObj, 'MMM d, yyyy h:mm a')
  }

  const startFormatted = eventDetails.events.start
    ? formatDate(eventDetails.events.start)
    : ''
  const endFormatted = eventDetails.events.end
    ? formatDate(eventDetails.events.end)
    : ''

  function getTimeLeft(endDate: Date) {
    const newEndDate = new Date(endDate)
    const now = new Date()

    if (newEndDate && newEndDate > now) {
      const days = differenceInDays(newEndDate, now)
      const hours = differenceInHours(newEndDate, now) % 24
      const minutes = differenceInMinutes(newEndDate, now) % 60
      const seconds = differenceInSeconds(newEndDate, now) % 60
      setRemainingTimeString(
        `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`
      )
      return newEndDate.getTime() - now.getTime()
    } else {
      setRemainingTimeString('Event ended')
    }
  }
  return (
    <div className="bg-background/80 h-full w-full flex-shrink-0 p-2 shadow-sm 2xl:w-96 2xl:p-4">
      {!isMounted ? (
        <Card>
          <CardContent className="space-y-2 p-3 2xl:space-y-4 2xl:p-4">
            <div className="bg-secondary/30 h-4 w-3/4 animate-pulse rounded 2xl:h-6" />

            <div className="space-y-1 2xl:space-y-2">
              <div className="bg-secondary/30 h-3 w-full animate-pulse rounded 2xl:h-4" />
              <div className="bg-secondary/30 h-3 w-5/6 animate-pulse rounded 2xl:h-4" />
              <div className="bg-secondary/30 h-3 w-4/6 animate-pulse rounded 2xl:h-4" />
            </div>

            <Separator className="my-1 2xl:my-2" />

            <div className="grid grid-cols-2 gap-2 2xl:flex 2xl:flex-col 2xl:space-y-3">
              <div className="bg-secondary/20 rounded-md p-1.5 2xl:p-2.5">
                <div className="flex flex-col">
                  <div className="bg-secondary/30 h-2 w-1/3 animate-pulse rounded 2xl:h-3" />
                  <div className="bg-secondary/30 mt-1 h-3 w-2/3 animate-pulse rounded 2xl:h-4" />
                </div>
              </div>

              <div className="bg-secondary/20 rounded-md p-1.5 2xl:p-2.5">
                <div className="flex flex-col">
                  <div className="bg-secondary/30 h-2 w-1/3 animate-pulse rounded 2xl:h-3" />
                  <div className="bg-secondary/30 mt-1 h-3 w-2/3 animate-pulse rounded 2xl:h-4" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 2xl:grid-cols-1">
              <div className="bg-primary/10 border-primary/20 rounded-md border p-1.5 2xl:p-3">
                <div className="flex flex-col">
                  <div className="bg-secondary/30 h-2 w-1/3 animate-pulse rounded 2xl:h-3" />
                  <div className="bg-secondary/30 mt-1 h-3 w-3/4 animate-pulse rounded 2xl:h-4" />
                </div>
              </div>

              <div className="bg-success/10 border-success/20 rounded-md border p-1.5 2xl:p-3">
                <div className="flex flex-col">
                  <div className="bg-secondary/30 h-2 w-2/3 animate-pulse rounded 2xl:h-3" />
                  <div className="bg-secondary/30 mt-1 h-3 w-1/4 animate-pulse rounded 2xl:h-4" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div>
          <Card>
            <CardContent className="p-3 2xl:p-4">
              <div className="flex flex-col space-y-2 2xl:space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold 2xl:text-lg">
                    Event Details
                  </h3>
                </div>
                <p className="text-muted-foreground max-h-44 overflow-y-auto text-sm leading-relaxed">
                  {eventDetails.events.description}
                </p>
                <Separator className="my-2 hidden 2xl:block" />
                <div className="mt-2 grid grid-cols-4 gap-2 2xl:mt-0 2xl:grid-cols-1 2xl:space-y-3">
                  <div className="bg-secondary/20 rounded-md p-1.5 2xl:p-2.5">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-[10px] uppercase tracking-wider 2xl:text-xs">
                        Start Date
                      </span>
                      <span className="truncate text-xs font-medium 2xl:text-sm">
                        {startFormatted}
                      </span>
                    </div>
                  </div>
                  <div className="bg-secondary/20 rounded-md p-1.5 2xl:p-2.5">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-[10px] uppercase tracking-wider 2xl:text-xs">
                        End Date
                      </span>
                      <span className="truncate text-xs font-medium 2xl:text-sm">
                        {endFormatted}
                      </span>
                    </div>
                  </div>
                  <div className="bg-primary/10 border-primary/20 rounded-md border p-1.5 2xl:p-3">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-[10px] uppercase tracking-wider 2xl:text-xs">
                        Time Remaining
                      </span>
                      <span className="hidden text-sm font-semibold 2xl:block">
                        {remainingTimeString}
                      </span>
                      <span className="truncate text-xs font-semibold 2xl:hidden">
                        {remainingTimeString}
                      </span>
                    </div>
                  </div>
                  <div className="bg-success/10 border-success/20 rounded-md border p-1.5 2xl:p-3">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-[10px] uppercase tracking-wider 2xl:text-xs">
                        Total {isSkillBased ? 'XP Earned' : 'Kills'}
                      </span>
                      <span
                        className={`truncate text-xs font-semibold 2xl:text-sm ${totalNum > 0 ? 'text-green-500' : ''}`}
                      >
                        +{totalNum.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

type LeaderboardSideBarProps = {
  eventDetails: EventDetails
  totalNum: number
  isSkillBased: boolean
}
