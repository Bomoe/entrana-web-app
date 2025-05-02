import { Button } from '@workspace/ui/components/button'
import { hiscoresTable } from '@workspace/db/schema'
import { db } from '@workspace/db/db'
import { getSkillFromName } from '@/lib/utils/getSkillFromNumberOrName'
import { getTopPlayerFromSkill } from './actions/skills/actions'

export default async function Page() {
  const skill = 'Overall'
  const skillNum = getSkillFromName(skill)
  let skillHiscores: Record<
    string,
    {
      startingXp: number
      startingLevel: number
      endingXp: number
      endingLevel: number
    }
  > = {}
  if (typeof skillNum === 'number') {
    skillHiscores = await getTopPlayerFromSkill(skillNum, {
      start: new Date(Date.now() - 24 * 60 * 60 * 1000),
      end: new Date(),
    })
  }
  console.log(skillHiscores)

  const formattedPlayerLeaderboard = Object.entries(skillHiscores)
    .map(([playerName, stats]) => ({
      playerName,
      ...stats,
    }))
    .sort((a, b) => b.endingXp - a.endingXp)

  const PlayerDisplay = ({
    data,
    index,
  }: {
    data: {
      startingXp: number
      startingLevel: number
      endingXp: number
      endingLevel: number
      playerName: string
    }
    index: number
  }) => {
    return (
      <div className="flex flex-row gap-x-1">
        <p>{index + 1}</p>
        <p>{data.playerName}</p>
        <p>{data.endingXp}</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="font-bold">Skill Leaderboard: {skill}</p>
        {formattedPlayerLeaderboard.map((data, index) => (
          <PlayerDisplay key={index} data={data} index={index} />
        ))}
      </div>
    </div>
  )
}
