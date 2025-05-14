import {
  skillEventsTable,
  eventsTable,
  activityEventsTable,
} from '@workspace/db/schema'

export type EventDetails = {
  events: typeof eventsTable.$inferSelect
  skill_events: typeof skillEventsTable.$inferSelect | null
  activity_events: typeof activityEventsTable.$inferSelect | null
}

export type FormattedEventDetails = typeof eventsTable.$inferSelect & {
  skillName: string | null
  activityName: string | null
}
