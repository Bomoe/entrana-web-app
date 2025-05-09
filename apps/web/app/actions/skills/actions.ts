'use server'

import { db } from '@workspace/db/db'
import { hiscoresTable, SkillJson, skillsTable } from '@workspace/db/schema'
import { Hiscore } from '@workspace/db/schemaTypes'
import { gt, lt, and, asc, desc } from 'drizzle-orm'
import { SkillHiscore } from './types'

export async function getSkillHiscoreFromDateRange(
  targetSkill: number,
  dateRange: { start: Date; end: Date }
): Promise<SkillHiscore> {
  const data = await db
    .select()
    .from(hiscoresTable)
    .where(
      and(
        gt(hiscoresTable.created_at, dateRange.start),
        lt(hiscoresTable.created_at, dateRange.end)
      )
    )
    .orderBy(asc(hiscoresTable.created_at))

  return filterAndFormatSkills(targetSkill, data)
}

function filterAndFormatSkills(
  targetSkill: number,
  data: Hiscore[]
): SkillHiscore {
  const playerData: Record<
    string,
    {
      startingXp: number
      startingLevel: number
      endingXp: number
      endingLevel: number
    }
  > = {}

  for (const player of data) {
    if (player && player.skills) {
      const currentPlayer = playerData[player.rsn]
      const currentSkill = player.skills[targetSkill]
      if (currentPlayer && currentSkill) {
        playerData[player.rsn] = {
          startingXp: currentPlayer.startingXp,
          startingLevel: currentPlayer.startingLevel,
          endingXp: currentSkill.xp - currentPlayer.startingXp,
          endingLevel: currentSkill.level - currentPlayer.startingLevel,
        }
      } else {
        playerData[player.rsn] = {
          startingXp: currentSkill?.xp || 0,
          startingLevel: currentSkill?.level || 0,
          endingXp: 0,
          endingLevel: 0,
        }
      }
    }
  }

  return playerData
}

export async function getAllSkills() {
  return await db.select().from(skillsTable)
}
