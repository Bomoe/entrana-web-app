import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { Logger } from 'drizzle-orm/logger'
class MyLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    console.log({ query, params })
  }
}

const connectionString = process.env.DATABASE_URL || ''

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false })
export const db = drizzle({ client, logger: new MyLogger() })
