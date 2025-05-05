import {
  integer,
  pgTable,
  varchar,
  timestamp,
  jsonb,
  text,
  boolean,
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
  id: text('id').primaryKey(),
  username: varchar({ length: 255 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image'),
  displayUsername: text('display_username'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
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

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
})
