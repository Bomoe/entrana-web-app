import { db } from '@workspace/db/db'
import {
  account,
  session,
  usersTable,
  verification,
} from '@workspace/db/schema'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
import { username } from 'better-auth/plugins'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: usersTable,
      session: session,
      account: account,
      verification: verification,
    },
  }),
  plugins: [username(), nextCookies()],
  emailAndPassword: {
    enabled: true,
  },
  //...
})
