import { getCachedActivityHiscore } from '@/app/actions/activities/actions'
import { getCachedEventDetails } from '@/app/actions/events/actions'
import { EventDetails } from '@/app/actions/events/types'
import { getCachedSkillHiscore } from '@/app/actions/skills/actions'
import { redirect } from 'next/navigation'
import { TableData } from './_components/types'
import { Leaderboard } from './_components/Leaderboard'
import { EventHiscore } from '@/lib/globalTypes/types'

export default async function Page({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
  const { eventId } = await params
  const events = await getCachedEventDetails({ eventId: parseInt(eventId) })
  let foundEvent: EventDetails | null = null
  if (events.length > 0 && events[0]) {
    foundEvent = events[0]
  } else {
    console.log('No event found, redirecting')
    redirect('/events')
  }

  let hiscores: EventHiscore = {}
  if (foundEvent.skill_events && foundEvent.skills?.hiscoreSkillId) {
    hiscores = await getCachedSkillHiscore(foundEvent.skills.hiscoreSkillId, {
      start: foundEvent.events.start,
      end: foundEvent.events.end,
    })
  } else if (
    foundEvent.activity_events &&
    foundEvent.activities?.hiscoreActivityId
  ) {
    hiscores = await getCachedActivityHiscore(
      foundEvent.activities.hiscoreActivityId,
      { start: foundEvent.events.start, end: foundEvent.events.end }
    )
  }
  const sortedHiscores = Object.entries(hiscores).sort(
    (a, b) => b[1].endingNum - a[1].endingNum
  )
  const formattedPlayerLeaderboard: TableData[] = sortedHiscores.map(
    ([playerName, stats], index) => ({
      playerName,
      placement: index,
      ...stats,
    })
  )

  if (!formattedPlayerLeaderboard) {
    console.error('No leaderboard data, redirecting')
    redirect('')
  }

  return (
    <div className="flex w-full items-center justify-center">
      <Leaderboard
        tableData={formattedPlayerLeaderboard}
        eventDetails={foundEvent}
      />
    </div>
  )
}
