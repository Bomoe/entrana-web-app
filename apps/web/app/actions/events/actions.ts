'use server'

import { db } from '@workspace/db/db'
import {
  activitiesTable,
  activityEventsTable,
  eventsTable,
  EventType,
  skillEventsTable,
  skillsTable,
} from '@workspace/db/schema'
import { desc, eq, ilike, or } from 'drizzle-orm'
import { EventDetails, FormattedEventDetails } from './types'
import { unstable_cache } from 'next/cache'

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
    .leftJoin(skillsTable, eq(skillEventsTable.skillId, skillsTable.skillId))
    .leftJoin(
      activityEventsTable,
      eq(eventsTable.id, activityEventsTable.eventId)
    )
    .leftJoin(
      activitiesTable,
      eq(activityEventsTable.activityId, activitiesTable.activityId)
    )

  return foundEvent
}

export async function getCachedEventDetails({
  eventId,
}: {
  eventId: number
}): Promise<EventDetails[]> {
  const cachedDetails = unstable_cache(
    async (eventId: number): Promise<EventDetails[]> => {
      return await getEventDetails({ eventId })
    },
    [`event-${eventId}`]
  )

  return await cachedDetails(eventId)
}

export async function getMultipleEvents({
  take,
  skip,
  search = '',
}: {
  take: number
  skip: number
  search?: string
}): Promise<FormattedEventDetails[]> {
  const events = await db
    .selectDistinct()
    .from(eventsTable)
    .leftJoin(skillEventsTable, eq(eventsTable.id, skillEventsTable.eventId))
    .leftJoin(skillsTable, eq(skillEventsTable.skillId, skillsTable.skillId))
    .leftJoin(
      activityEventsTable,
      eq(eventsTable.id, activityEventsTable.eventId)
    )
    .leftJoin(
      activitiesTable,
      eq(activityEventsTable.activityId, activitiesTable.activityId)
    )
    .orderBy(desc(activityEventsTable.createdAt))
    .limit(take)
    .offset(skip)
    .where(
      search !== ''
        ? or(
            ilike(eventsTable.name, `%${search}%`),
            ilike(eventsTable.description, `%${search}%`),
            ilike(skillsTable.name, `%${search}%`),
            ilike(activitiesTable.name, `%${search}%`)
          )
        : undefined
    )

  const formattedEvents: FormattedEventDetails[] = []

  for (const event of events) {
    const isSkill = event.events.type === EventType.Skill
    const isActivity = event.events.type === EventType.Activity

    formattedEvents.push({
      ...event.events,
      skillName: isSkill ? event.skills?.name || '' : null,
      activityName: isActivity ? event.activities?.name || '' : null,
    })
  }

  return formattedEvents
}
