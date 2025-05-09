'use server'

import { db } from '@workspace/db/db'
import {
  hiscoresTable,
  membersTable,
  SkillJson,
  skillsTable,
} from '@workspace/db/schema'
import { Hiscore } from '@workspace/db/schemaTypes'
import { gt, lt, and, asc, desc, eq } from 'drizzle-orm'
import { SkillHiscore } from './types'

export async function getSkillHiscoreFromDateRange(
  targetSkill: number,
  dateRange: { start: Date; end: Date }
): Promise<SkillHiscore> {
  console.log({ targetSkill, dateRange })
  const members = await db
    .select()
    .from(membersTable)
    .where(eq(membersTable.deletedAt, null as any))

  let data: SkillHiscore = {}

  for (const member of members) {
    const ascData = await db
      .select()
      .from(hiscoresTable)
      .where(
        and(
          gt(hiscoresTable.created_at, dateRange.start),
          lt(hiscoresTable.created_at, dateRange.end)
        )
      )
      .orderBy(asc(hiscoresTable.created_at))
      .limit(1)
    const descData = await db
      .select()
      .from(hiscoresTable)
      .where(
        and(
          gt(hiscoresTable.created_at, dateRange.start),
          lt(hiscoresTable.created_at, dateRange.end)
        )
      )
      .orderBy(desc(hiscoresTable.created_at))
      .limit(1)
    if (
      descData.length > 0 &&
      ascData.length > 0 &&
      descData[0] &&
      ascData[0] &&
      descData[0].skills &&
      ascData[0].skills &&
      descData[0].skills[targetSkill] &&
      ascData[0].skills[targetSkill] &&
      typeof descData[0].skills[targetSkill].xp === 'number' &&
      typeof ascData[0].skills[targetSkill].xp === 'number'
    ) {
      data[member.rsn] = {
        endingXp:
          descData[0].skills[targetSkill].xp -
          ascData[0].skills[targetSkill].xp,
      }
    }
  }
  return data
  // console.log(data.length)

  // return
}

// function filterAndFormatSkills(
//   targetSkill: number,
//   data: Hiscore[]
// ): SkillHiscore {
//   const playerData: Record<
//     string,
//     {
//       startingXp: number
//       startingLevel: number
//       endingXp: number
//       endingLevel: number
//     }
//   > = {}

//   for (const player of data) {
//     if (player && player.skills) {
//       const currentPlayer = playerData[player.rsn]
//       const currentSkill = player.skills[targetSkill]
//       if (currentPlayer && currentSkill) {
//         playerData[player.rsn] = {
//           startingXp: currentPlayer.startingXp,
//           startingLevel: currentPlayer.startingLevel,
//           endingXp: currentSkill.xp - currentPlayer.startingXp,
//           endingLevel: currentSkill.level - currentPlayer.startingLevel,
//         }
//       } else {
//         playerData[player.rsn] = {
//           startingXp: currentSkill?.xp || 0,
//           startingLevel: currentSkill?.level || 0,
//           endingXp: 0,
//           endingLevel: 0,
//         }
//       }
//     }
//   }

//   return playerData
// }

export async function getAllSkills() {
  return await db.select().from(skillsTable)
}
