'use client'

import * as React from 'react'
import { addDays, format, set } from 'date-fns'
import { CalendarIcon, Clock } from 'lucide-react'
import { DateRange } from 'react-day-picker'

import { cn } from '@workspace/ui/lib/utils'
import { Button } from '@workspace/ui/components/button'
import { Calendar } from '@workspace/ui/components/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components/popover'
import { Input } from '@workspace/ui/components/input'

export function DatePickerWithRange({
  className,
  onChange,
  defaultDateRange,
  includeTime = false,
  isDisabled = false,
}: React.HTMLAttributes<HTMLDivElement> & {
  onChange?: (date: DateRange | undefined) => void
  defaultDateRange?: DateRange
  includeTime?: boolean
  isDisabled?: boolean
}) {
  const initializedRef = React.useRef(false)
  const [date, setDate] = React.useState<DateRange | undefined>(undefined)
  const [fromTime, setFromTime] = React.useState('00:00')
  const [toTime, setToTime] = React.useState('23:59')

  React.useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true

      const initialDateRange = defaultDateRange || {
        from: new Date(),
        to: addDays(new Date(), 7),
      }

      setDate(initialDateRange)

      if (initialDateRange?.from) {
        const hours = initialDateRange.from
          .getHours()
          .toString()
          .padStart(2, '0')
        const minutes = initialDateRange.from
          .getMinutes()
          .toString()
          .padStart(2, '0')
        setFromTime(`${hours}:${minutes}`)
      }

      if (initialDateRange?.to) {
        const hours = initialDateRange.to.getHours().toString().padStart(2, '0')
        const minutes = initialDateRange.to
          .getMinutes()
          .toString()
          .padStart(2, '0')
        setToTime(`${hours}:${minutes}`)
      }
    }
  }, [defaultDateRange])

  const handleDateChange = (newDate: DateRange | undefined) => {
    if (newDate) {
      const updatedDate: DateRange = {
        from: newDate.from
          ? updateDateWithTime(newDate.from, fromTime)
          : undefined,
        to: newDate.to ? updateDateWithTime(newDate.to, toTime) : undefined,
      }
      setDate(updatedDate)

      if (onChange) {
        onChange(updatedDate)
      }
    } else {
      setDate(newDate)
      if (onChange) {
        onChange(newDate)
      }
    }
  }

  const updateDateWithTime = (date: Date, timeString: string): Date => {
    const [hours, minutes] = timeString.split(':').map(Number)
    return set(date, { hours, minutes, seconds: 0 })
  }

  const handleFromTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value
    setFromTime(newTime)

    if (date?.from) {
      const updatedDate = {
        ...date,
        from: updateDateWithTime(date.from, newTime),
      }
      setDate(updatedDate)

      if (onChange) {
        onChange(updatedDate)
      }
    }
  }

  const handleToTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value
    setToTime(newTime)

    if (date?.to) {
      const updatedDate = {
        ...date,
        to: updateDateWithTime(date.to, newTime),
      }
      setDate(updatedDate)

      if (onChange) {
        onChange(updatedDate)
      }
    }
  }

  // Create formatted date strings only on the client side
  const formatDateDisplay = () => {
    if (!date?.from) return <span>Pick a date</span>

    if (date.to) {
      return (
        <>
          {format(date.from, 'LLL dd, y')}
          {includeTime && ` ${format(date.from, 'h:mm a')}`} -{' '}
          {format(date.to, 'LLL dd, y')}
          {includeTime && ` ${format(date.to, 'h:mm a')}`}
        </>
      )
    }

    return (
      <>
        {format(date.from, 'LLL dd, y')}
        {includeTime && ` ${format(date.from, 'h:mm a')}`}
      </>
    )
  }

  return (
    <div
      className={cn(
        'grid gap-2',
        className,
        isDisabled && 'pointer-events-none cursor-not-allowed opacity-50'
      )}
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[400px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
            disabled={isDisabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateDisplay()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />

          {includeTime && (
            <div className="border-border border-t p-3">
              <div className="flex justify-between space-x-2">
                <div className="space-y-1">
                  <div className="flex items-center">
                    <Clock className="text-muted-foreground mr-2 h-4 w-4" />
                    <span className="text-sm font-medium">Start Time</span>
                  </div>
                  <Input
                    type="time"
                    value={fromTime}
                    onChange={handleFromTimeChange}
                    className="w-full"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <Clock className="text-muted-foreground mr-2 h-4 w-4" />
                    <span className="text-sm font-medium">End Time</span>
                  </div>
                  <Input
                    type="time"
                    value={toTime}
                    onChange={handleToTimeChange}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
