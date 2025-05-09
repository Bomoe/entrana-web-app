import {
  hiscoresTable,
  usersTable,
  eventsTable,
  skillsTable,
  session,
  account,
  verification,
  skillEventsTable,
  activityEventsTable,
  activitiesTable,
} from './schema.ts'

// For full row type (all columns)
export type Hiscore = typeof hiscoresTable.$inferSelect
export type User = typeof usersTable.$inferSelect
export type Event = typeof eventsTable.$inferSelect
export type Skill = typeof skillsTable.$inferSelect
export type Session = typeof session.$inferSelect
export type Account = typeof account.$inferSelect
export type Verification = typeof verification.$inferSelect
export type SkillEvent = typeof skillEventsTable.$inferSelect
export type ActivityEvent = typeof activityEventsTable.$inferSelect
export type Activity = typeof activitiesTable.$inferSelect

// For insert operations (excludes auto-generated columns)
export type NewHiscore = typeof hiscoresTable.$inferInsert
export type NewUser = typeof usersTable.$inferInsert
export type NewEvent = typeof eventsTable.$inferInsert
export type NewSkill = typeof skillsTable.$inferInsert
export type NewSession = typeof session.$inferInsert
export type NewAccount = typeof account.$inferInsert
export type NewVerification = typeof verification.$inferInsert
export type NewSkillEvent = typeof skillEventsTable.$inferInsert
export type NewActivityEvent = typeof activityEventsTable.$inferInsert
export type NewActivity = typeof activitiesTable.$inferInsert
