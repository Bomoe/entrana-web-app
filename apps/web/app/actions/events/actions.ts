import { db } from '@workspace/db/db'
import {
  activityEventsTable,
  eventsTable,
  skillEventsTable,
} from '@workspace/db/schema'
import { eq } from 'drizzle-orm'
import { EventDetails } from './types'

export async function getEventDetails({
  eventId,
}: {
  eventId: number
}): Promise<EventDetails[]> {
  const foundEvent = await db
    .selectDistinct()
    .from(eventsTable)
    .where(eq(eventsTable.id, eventId))
    .leftJoin(skillEventsTable, eq(eventsTable.id, skillEventsTable.eventId))
    .leftJoin(
      activityEventsTable,
      eq(eventsTable.id, activityEventsTable.eventId)
    )

  return foundEvent
}
