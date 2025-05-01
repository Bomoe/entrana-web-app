import {
  integer,
  pgTable,
  varchar,
  timestamp,
  jsonb,
} from 'drizzle-orm/pg-core'

export type SkillJson = Record<
  number,
  {
    id: number
    name: string
    rank: number
    level: number
    xp: number
  }
>

export type ActivityJson = Record<
  number,
  { id: number; name: string; rank: number; score: number }
>

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
})

export const hiscoresTable = pgTable('hiscores', {
  id: integer().generatedAlwaysAsIdentity(),
  rsn: varchar({ length: 255 }).notNull(),
  skills: jsonb('skills').$type<SkillJson>(),
  activities: jsonb('activities').$type<ActivityJson>(),
  created_at: timestamp('created_at').defaultNow().notNull(),
})

export const skillHiscoresTable = pgTable('skill_hiscores', {
  rsn: varchar({ length: 255 }).notNull(),
  skill_id: integer('skill_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  rank: integer('rank').notNull(),
  level: integer('level').notNull(),
  xp: integer('xp').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
})

export const activityHiscoresTable = pgTable('activity_hiscores', {
  rsn: varchar({ length: 255 }).notNull(),
  activity_id: integer('activity_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  rank: integer('rank').notNull(),
  score: integer('score').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
})
