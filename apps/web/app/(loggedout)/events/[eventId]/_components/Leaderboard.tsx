import { EventDetails } from '@/app/actions/events/types'
import { LeaderboardBody } from './LeaderboardBody'
import { TableData } from './types'
import { LeaderboardSideBar } from './LeaderboardSideBar'

export function Leaderboard({ tableData, eventDetails }: LeaderboardProps) {
  return (
    <div className="relative mt-4 flex w-full flex-col gap-y-1">
      <div className="mx-auto flex justify-center 2xl:mx-0">
        <p className="w-full text-center text-2xl font-semibold">
          {eventDetails.events.name}
        </p>
      </div>
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-y-2 2xl:hidden">
        <LeaderboardSideBar
          eventDetails={eventDetails}
          totalNum={tableData
            .map((player) => player.endingNum)
            .reduce((playerEndingNum, total) => playerEndingNum + total, 0)}
          isSkillBased={!!eventDetails.skill_events}
        />
        <LeaderboardBody
          tableData={tableData}
          isSkillBased={!!eventDetails.skill_events}
        />
      </div>
      <div className="relative hidden 2xl:block">
        <div className="mx-auto flex max-w-2xl justify-center">
          <LeaderboardBody
            tableData={tableData}
            isSkillBased={!!eventDetails.skill_events}
          />
        </div>
        <div className="4xl:right-[20%] right-[10%] top-12 hidden 2xl:fixed 2xl:block">
          <LeaderboardSideBar
            eventDetails={eventDetails}
            totalNum={tableData
              .map((player) => player.endingNum)
              .reduce((playerEndingNum, total) => playerEndingNum + total, 0)}
            isSkillBased={!!eventDetails.skill_events}
          />
        </div>
      </div>
    </div>
  )
}

type LeaderboardProps = {
  tableData: TableData[]
  eventDetails: EventDetails
}
