import { InferModel } from 'drizzle-orm'
import {
  skillHiscoresTable,
  activityHiscoresTable,
  hiscoresTable,
  usersTable,
} from './schema.ts'

// For full row type (all columns)
export type Hiscore = typeof hiscoresTable.$inferSelect
export type SkillHiscore = typeof skillHiscoresTable.$inferSelect
export type ActivityHiscore = typeof activityHiscoresTable.$inferSelect
export type User = typeof usersTable.$inferSelect

// For insert operations (excludes auto-generated columns)
export type NewHiscore = typeof hiscoresTable.$inferInsert
export type NewSkillHiscore = typeof skillHiscoresTable.$inferInsert
export type NewActivityHiscore = typeof activityHiscoresTable.$inferInsert
export type NewUser = typeof usersTable.$inferInsert
