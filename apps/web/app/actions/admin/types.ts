import { EventType } from '@workspace/db/schema'
import { z } from 'zod'

const eventDateRange = z.object({
  from: z.date(),
  to: z.date(),
})

export const eventCreationFormSchema = z.object({
  eventName: z.string().min(1, 'Event name is required').trim(),
  eventDescription: z.string().min(1, 'Event description is required').trim(),
  eventType: z.nativeEnum(EventType),
  eventDateRange: eventDateRange,
  typeId: z.number().optional(),
})
