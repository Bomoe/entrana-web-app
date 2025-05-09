'use server'

import { db } from '@workspace/db/db'
import {
  activitiesTable,
  hiscoresTable,
  SkillJson,
  skillsTable,
} from '@workspace/db/schema'
import { Hiscore } from '@workspace/db/schemaTypes'
import { gt, lt, and, asc, desc } from 'drizzle-orm'
import { ActivityHiscore } from './types'

export async function getAllActivities() {
  return await db.select().from(activitiesTable)
}

export async function getActivityHiscoreFromDateRange(
  targetActivity: number,
  dateRange: { start: Date; end: Date }
): Promise<ActivityHiscore> {
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

  return filterAndFormatActivities(targetActivity, data)
}

function filterAndFormatActivities(
  targetActivity: number,
  data: Hiscore[]
): ActivityHiscore {
  const playerData: ActivityHiscore = {}

  for (const player of data) {
    if (player && player.activities) {
      const currentPlayer = playerData[player.rsn]
      const currentSkill = player.activities[targetActivity]
      if (currentPlayer && currentSkill) {
        playerData[player.rsn] = {
          startingScore: currentPlayer.startingScore,
          endingScore: currentSkill.score - currentPlayer.startingScore,
        }
      } else {
        playerData[player.rsn] = {
          startingScore: currentSkill?.score || 0,
          endingScore: 0,
        }
      }
    }
  }

  return playerData
}
