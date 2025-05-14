import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from 'date-fns'
import { useEffect, useState } from 'react'

export function useCountdown({
  endDate,
  onTimeRemainingUpdate,
}: UseCountdownProps) {
  const [remainingTime, setRemainingTime] = useState(0)

  useEffect(() => {
    const timeLeft = getTimeLeft(endDate)
    onTimeRemainingUpdate(timeLeft.timeLeftStr)
    const timer = setTimeout(
      () => setRemainingTime(timeLeft.timeLeftNum ?? 0),
      1000
    )

    return () => clearTimeout(timer)
  }, [remainingTime, endDate])

  function getTimeLeft(endDate: Date) {
    const newEndDate = new Date(endDate)
    const now = new Date()

    if (newEndDate && newEndDate > now) {
      const days = differenceInDays(newEndDate, now)
      const hours = differenceInHours(newEndDate, now) % 24
      const minutes = differenceInMinutes(newEndDate, now) % 60
      const seconds = differenceInSeconds(newEndDate, now) % 60
      return {
        timeLeftStr: `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`,
        timeLeftNum: newEndDate.getTime() - now.getTime(),
      }
    } else {
      return { timeLeftStr: 'Event ended', timeLeftNum: 0 }
    }
  }
}

type UseCountdownProps = {
  endDate: Date
  onTimeRemainingUpdate: (timeLeftStr: string) => void
}
