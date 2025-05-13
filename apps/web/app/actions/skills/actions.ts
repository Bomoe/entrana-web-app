'use server'

import { db } from '@workspace/db/db'
import { membersTable, SkillJson, skillsTable } from '@workspace/db/schema'
import { Hiscore } from '@workspace/db/schemaTypes'
import { gt, lt, and, asc, desc, sql, eq } from 'drizzle-orm'
import { EventHiscore } from '@/lib/globalTypes/types'

export async function getSkillHiscoreFromDateRange(
  targetSkill: number,
  dateRange: { start: Date; end: Date }
): Promise<EventHiscore> {
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
  const latestByRsn = new Map<
    string,
    { skills: SkillJson; lastUpdatedAtStr: string }
  >()

  for (const record of earliestRecords) {
    if (record.skills && record.skills[targetSkill]?.xp !== undefined) {
      earliestByRsn.set(record.rsn, {
        skills: record.skills,
      })
    }
  }

  for (const record of latestRecords) {
    if (record.skills && record.skills[targetSkill]?.xp !== undefined) {
      latestByRsn.set(record.rsn, {
        skills: record.skills,
        lastUpdatedAtStr: new Date(record.created_at).toISOString(),
      })
    }
  }

  let data: EventHiscore = {}

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
        endingNum:
          latest.skills[targetSkill].xp - earliest.skills[targetSkill].xp,
        lastUpdatedAtStr: latest.lastUpdatedAtStr,
      }
    }
  }

  return data
}

export async function getAllSkills() {
  return await db.select().from(skillsTable)
}
