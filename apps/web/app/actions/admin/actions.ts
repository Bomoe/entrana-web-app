'use server'

import { z } from 'zod'
import { eventCreationFormSchema } from './types'
import { getSession } from '@/lib/auth/getSession'
import { redirect } from 'next/navigation'
import { db } from '@workspace/db/db'
import {
  activityEventsTable,
  eventsTable,
  EventType,
  skillEventsTable,
} from '@workspace/db/schema'
import { NewEvent, Permissions } from '@workspace/db/schemaTypes'
import { getUserPermissions } from '../auth/actions'

export async function createEvent({
  eventData,
}: {
  eventData: z.infer<typeof eventCreationFormSchema>
}): Promise<{ success: boolean; message: string }> {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const userPermissions = await getUserPermissions({ userId: session.user.id })

  if (!userPermissions.has(Permissions.CreateEvents)) {
    console.error(
      `An unauthorized user with the id: ${session.user.id} tried to access the admin panel`
    )
    redirect('')
  }

  const { success, data } = eventCreationFormSchema.safeParse(eventData)
  if (!success) {
    return {
      success: false,
      message: 'Data is not valid, please fill out the form again.',
    }
  }
  try {
    const event = await db
      .insert(eventsTable)
      .values({
        name: data.eventName,
        description: data.eventDescription,
        type: data.eventType,
        start: data.eventDateRange.from,
        end: data.eventDateRange.to,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    if (data.eventType === EventType.Skill && data.typeId && event.length > 0) {
      const createdEvent = event[0]
      if (createdEvent && createdEvent.id) {
        await db.insert(skillEventsTable).values({
          eventId: createdEvent.id,
          skillId: data.typeId,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }
    }

    if (
      data.eventType === EventType.Activity &&
      data.typeId &&
      event.length > 0
    ) {
      const createdEvent = event[0]
      if (createdEvent && createdEvent.id) {
        await db.insert(activityEventsTable).values({
          eventId: createdEvent.id,
          activityId: data.typeId,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }
    }

    return { success: true, message: '' }
  } catch (e) {
    console.error('Error uploading event:', e)
    return {
      success: false,
      message: 'Error when uploading new event, please try again.',
    }
  }
}
