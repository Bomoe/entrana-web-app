import { getActivityHiscoreFromDateRange } from '@/app/actions/activities/actions'
import {
  ActivityHiscore,
  ActivityHiscoreItem,
} from '@/app/actions/activities/types'
import { getEventDetails } from '@/app/actions/events/actions'
import { EventDetails } from '@/app/actions/events/types'
import { getSkillHiscoreFromDateRange } from '@/app/actions/skills/actions'
import { SkillHiscore, SkillHiscoreItem } from '@/app/actions/skills/types'
import { EventType } from '@workspace/db/schema'
import { Event } from '@workspace/db/schemaTypes'
import { redirect } from 'next/navigation'

export default async function Page({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
  const { eventId } = await params
  const events = await getEventDetails({ eventId: parseInt(eventId) })
  let foundEvent: EventDetails | null = null
  if (events.length > 0 && events[0]) {
    foundEvent = events[0]
  } else {
    redirect('')
  }

  let formattedPlayerLeaderboard:
    | FormattedHiscoreItem<SkillHiscoreItem>[]
    | FormattedHiscoreItem<ActivityHiscoreItem>[]
    | null = null

  if (foundEvent.skill_events) {
    const hiscores = await getSkillHiscoreFromDateRange(
      foundEvent.skill_events.skillId,
      { start: foundEvent.events.start, end: foundEvent.events.end }
    )
    formattedPlayerLeaderboard = Object.entries(hiscores)
      .map(([playerName, stats]) => ({
        playerName,
        ...stats,
      }))
      .sort((a, b) => b.endingXp - a.endingXp)
  } else if (foundEvent.activity_events) {
    const hiscores = await getActivityHiscoreFromDateRange(
      foundEvent.activity_events.activityId,
      { start: foundEvent.events.start, end: foundEvent.events.end }
    )
    formattedPlayerLeaderboard = Object.entries(hiscores)
      .map(([playerName, stats]) => ({
        playerName,
        ...stats,
      }))
      .sort((a, b) => b.endingScore - a.endingScore)
  }

  if (!formattedPlayerLeaderboard) {
    redirect('')
  }

  const PlayerDisplay = ({
    skillData,
    activityData,
    index,
  }: {
    skillData?: FormattedHiscoreItem<SkillHiscoreItem>
    activityData?: FormattedHiscoreItem<ActivityHiscoreItem>
    index: number
  }) => {
    const playerName = skillData?.playerName ?? activityData?.playerName ?? ''
    const endingNum = skillData?.endingXp ?? activityData?.endingScore ?? 0
    return (
      <div className="flex flex-row gap-x-1">
        <p>{index + 1}</p>
        <p>{playerName}</p>
        <p>{endingNum}</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="font-bold">{foundEvent.events.name}</p>
        {formattedPlayerLeaderboard.map((data, index) => {
          if (foundEvent.skill_events) {
            return (
              <PlayerDisplay
                key={index}
                skillData={data as FormattedHiscoreItem<SkillHiscoreItem>}
                index={index}
              />
            )
          } else {
            return (
              <PlayerDisplay
                key={index}
                activityData={data as FormattedHiscoreItem<ActivityHiscoreItem>}
                index={index}
              />
            )
          }
        })}
      </div>
    </div>
  )
}

type FormattedHiscoreItem<T> = T & {
  playerName: string
}
