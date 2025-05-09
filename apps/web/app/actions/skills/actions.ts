'use server'

import { db } from '@workspace/db/db'
import {
  hiscoresTable,
  membersTable,
  SkillJson,
  skillsTable,
} from '@workspace/db/schema'
import { Hiscore } from '@workspace/db/schemaTypes'
import { gt, lt, and, asc, desc, sql, eq } from 'drizzle-orm'
import { SkillHiscore } from './types'

export async function getSkillHiscoreFromDateRange(
  targetSkill: number,
  dateRange: { start: Date; end: Date }
): Promise<SkillHiscore> {
  console.log({ targetSkill, dateRange })

  // Get all active members
  const members = await db
    .select()
    .from(membersTable)
    .where(sql`${membersTable.deletedAt} IS NULL`)

  const rsnList = members.map((member) => member.rsn)

  if (rsnList.length === 0) {
    return {}
  }

  const startDateStr = dateRange.start.toISOString()
  const endDateStr = dateRange.end.toISOString()

  const rsnPlaceholders = rsnList.map((rsn) => `'${rsn}'`).join(', ')
  const inClause = sql`rsn IN (${sql.raw(rsnPlaceholders)})`

  const earliestRecords = await db.execute<Hiscore>(sql`
    SELECT DISTINCT ON (rsn)
      id, rsn, skills, created_at
    FROM hiscores
    WHERE
      created_at > ${sql.raw(`'${startDateStr}'`)} AND
      created_at < ${sql.raw(`'${endDateStr}'`)} AND
      ${inClause}
    ORDER BY rsn, created_at ASC
  `)

  const latestRecords = await db.execute<Hiscore>(sql`
    SELECT DISTINCT ON (rsn)
      id, rsn, skills, created_at
    FROM hiscores
    WHERE
      created_at > ${sql.raw(`'${startDateStr}'`)} AND
      created_at < ${sql.raw(`'${endDateStr}'`)} AND
      ${inClause}
    ORDER BY rsn, created_at DESC
  `)

  const earliestByRsn = new Map<string, { skills: SkillJson }>()
  const latestByRsn = new Map<string, { skills: SkillJson }>()

  for (const record of earliestRecords) {
    if (record.skills && record.skills[targetSkill]?.xp !== undefined) {
      earliestByRsn.set(record.rsn, {
        skills: record.skills,
      })
      if (record.rsn === 'Esports Guy') {
        console.log({ isEarly: true, skills: record.skills })
      }
    }
  }

  for (const record of latestRecords) {
    if (record.skills && record.skills[targetSkill]?.xp !== undefined) {
      latestByRsn.set(record.rsn, {
        skills: record.skills,
      })
      if (record.rsn === 'Esports Guy') {
        console.log({ isEarly: false, skills: record.skills })
      }
    }
  }

  let data: SkillHiscore = {}

  for (const rsn of earliestByRsn.keys()) {
    const earliest = earliestByRsn.get(rsn)
    const latest = latestByRsn.get(rsn)

    if (
      earliest &&
      latest &&
      typeof earliest.skills[targetSkill]?.xp === 'number' &&
      typeof latest.skills[targetSkill]?.xp === 'number'
    ) {
      data[rsn] = {
        endingXp:
          latest.skills[targetSkill].xp - earliest.skills[targetSkill].xp,
      }
    }
  }

  return data
}

// export async function getSkillHiscoreFromDateRange(
//   targetSkill: number,
//   dateRange: { start: Date; end: Date }
// ): Promise<SkillHiscore> {
//   console.log({ targetSkill, dateRange })
//   const members = await db
//     .select()
//     .from(membersTable)
//     .where(sql`${membersTable.deletedAt} IS NULL`)
//   console.log(members.length)

//   let data: SkillHiscore = {}

//   for (const member of members) {
//     const ascData = await db
//       .select()
//       .from(hiscoresTable)
//       .where(
//         and(
//           eq(hiscoresTable.rsn, member.rsn),
//           gt(hiscoresTable.created_at, dateRange.start),
//           lt(hiscoresTable.created_at, dateRange.end)
//         )
//       )
//       .orderBy(asc(hiscoresTable.created_at))
//       .limit(1)
//     const descData = await db
//       .select()
//       .from(hiscoresTable)
//       .where(
//         and(
//           eq(hiscoresTable.rsn, member.rsn),
//           gt(hiscoresTable.created_at, dateRange.start),
//           lt(hiscoresTable.created_at, dateRange.end)
//         )
//       )
//       .orderBy(desc(hiscoresTable.created_at))
//       .limit(1)
//     if (
//       descData.length > 0 &&
//       ascData.length > 0 &&
//       descData[0] &&
//       ascData[0] &&
//       descData[0].skills &&
//       ascData[0].skills &&
//       descData[0].skills[targetSkill] &&
//       ascData[0].skills[targetSkill] &&
//       typeof descData[0].skills[targetSkill].xp === 'number' &&
//       typeof ascData[0].skills[targetSkill].xp === 'number'
//     ) {
//       data[member.rsn] = {
//         endingXp:
//           descData[0].skills[targetSkill].xp -
//           ascData[0].skills[targetSkill].xp,
//       }
//     }
//   }
//   return data
// }

export async function getAllSkills() {
  return await db.select().from(skillsTable)
}
