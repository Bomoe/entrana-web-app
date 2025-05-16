'use server'

import { db } from '@workspace/db/db'
import {
  membersTable,
  activitiesTable,
  ActivityJson,
} from '@workspace/db/schema'
import { Hiscore } from '@workspace/db/schemaTypes'
import { gt, lt, and, asc, desc, sql, eq } from 'drizzle-orm'
import { EventHiscore } from '@/lib/globalTypes/types'
import { unstable_cache } from 'next/cache'

export async function getActivityHiscoreFromDateRange(
  targetActivity: number,
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

  const startDateStr = new Date(dateRange.start).toISOString()
  const endDateStr = new Date(dateRange.end).toISOString()

  const rsnPlaceholders = rsnList.map((rsn) => `'${rsn}'`).join(', ')
  const inClause = sql`rsn IN (${sql.raw(rsnPlaceholders)})`

  const earliestRecords = await db.execute<Hiscore>(sql`
    SELECT DISTINCT ON (rsn)
      id, rsn, activities, created_at
    FROM hiscores
    WHERE
      created_at > ${sql.raw(`'${startDateStr}'`)} AND
      created_at < ${sql.raw(`'${endDateStr}'`)} AND
      ${inClause}
    ORDER BY rsn, created_at ASC
  `)

  const latestRecords = await db.execute<Hiscore>(sql`
    SELECT DISTINCT ON (rsn)
      id, rsn, activities, created_at
    FROM hiscores
    WHERE
      created_at > ${sql.raw(`'${startDateStr}'`)} AND
      created_at < ${sql.raw(`'${endDateStr}'`)} AND
      ${inClause}
    ORDER BY rsn, created_at DESC
  `)

  const earliestByRsn = new Map<string, { activities: ActivityJson }>()
  const latestByRsn = new Map<
    string,
    { activities: ActivityJson; lastUpdatedAtStr: string }
  >()

  for (const record of earliestRecords) {
    if (
      record.activities &&
      record.activities[targetActivity]?.score !== undefined
    ) {
      earliestByRsn.set(record.rsn, {
        activities: record.activities,
      })
    }
  }

  for (const record of latestRecords) {
    if (
      record.activities &&
      record.activities[targetActivity]?.score !== undefined
    ) {
      latestByRsn.set(record.rsn, {
        activities: record.activities,
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
      typeof earliest.activities[targetActivity]?.score === 'number' &&
      typeof latest.activities[targetActivity]?.score === 'number'
    ) {
      data[rsn] = {
        endingNum:
          latest.activities[targetActivity].score -
          earliest.activities[targetActivity].score,
        lastUpdatedAtStr: latest.lastUpdatedAtStr,
      }
    }
  }

  return data
}

export const getCachedActivityHiscore = unstable_cache(
  async (
    targetActivity: number,
    dateRange: { start: Date; end: Date }
  ): Promise<EventHiscore> => {
    return await getActivityHiscoreFromDateRange(targetActivity, dateRange)
  },
  ['hiscores-data'],
  { tags: ['hiscores-data'] }
)

export async function getAllActivities() {
  return await db.select().from(activitiesTable)
}
