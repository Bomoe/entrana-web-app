import {
  integer,
  pgTable,
  varchar,
  timestamp,
  jsonb,
  text,
  boolean,
  date,
  pgEnum,
} from 'drizzle-orm/pg-core'
import { ClanRanks, Permissions } from './schemaTypes.ts'

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

export enum EventType {
  Skill = 'skill',
  Activity = 'activity',
  Bingo = 'bingo',
  ItemRace = 'itemRace',
}

export const pgRankEnum = pgEnum('rankEnum', ClanRanks)

export const pgPermissionEnum = pgEnum('permissionEnum', Permissions)

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
  createdAt: timestamp('created_at').defaultNow().notNull(),
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

export const eventsTable = pgTable('events', {
  id: integer().generatedAlwaysAsIdentity().unique(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  type: text('type').$type<EventType>().notNull(),
  start: timestamp('start').notNull(),
  end: timestamp('end').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
})

export const skillEventsTable = pgTable('skill_events', {
  id: integer().generatedAlwaysAsIdentity().unique(),
  eventId: integer('event_id')
    .notNull()
    .references(() => eventsTable.id, { onDelete: 'cascade' }),
  skillId: integer('skill_id')
    .notNull()
    .references(() => skillsTable.skillId, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
})

export const activityEventsTable = pgTable('activity_events', {
  id: integer().generatedAlwaysAsIdentity().unique(),
  eventId: integer('event_id')
    .notNull()
    .references(() => eventsTable.id, { onDelete: 'cascade' }),
  activityId: integer('activity_id')
    .notNull()
    .references(() => activitiesTable.activityId, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
})

export const skillsTable = pgTable('skills', {
  skillId: integer('skill_id').notNull().generatedAlwaysAsIdentity().unique(),
  hiscoreSkillId: integer('hiscore_skill_id').notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
})

export const activitiesTable = pgTable('activities', {
  activityId: integer('activity_id')
    .notNull()
    .generatedAlwaysAsIdentity()
    .unique(),
  hiscoreActivityId: integer('hiscore_activity_id').notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
})

export const membersTable = pgTable('members', {
  id: integer().generatedAlwaysAsIdentity().unique(),
  rsn: varchar({ length: 255 }).notNull().unique(),
  rank: pgRankEnum().notNull().default(ClanRanks.Bronze),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
})

export const permissionsTable = pgTable('permissions', {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  permission: pgPermissionEnum().notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
})

export const rolesTable = pgTable('roles', {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
})

export const rolePermissionsTable = pgTable('role_permissions', {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  roleId: integer('role_id')
    .notNull()
    .references(() => rolesTable.id, { onDelete: 'cascade' }),
  permissionId: integer('permission_id')
    .notNull()
    .references(() => permissionsTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
})

export const userRoles = pgTable('user_roles', {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  roleId: integer('role_id')
    .notNull()
    .references(() => rolesTable.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
})
