import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { permissionsTable } from '../schema.ts'
import { Permissions } from '../schemaTypes.ts'
import { config } from 'dotenv'

config()

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required')
}

const client = postgres(connectionString)
const db = drizzle(client)

async function populatePermissions() {
  try {
    console.log('Populating permissions table...')

    const permissionsToInsert = Object.values(Permissions).map(
      (permission) => ({ permission })
    )

    await db
      .insert(permissionsTable)
      .values(permissionsToInsert)
      .onConflictDoNothing()

    console.log('Successfully populated permissions table')
  } catch (error) {
    console.error('Error populating permissions:', error)
  } finally {
    await client.end()
  }
}

populatePermissions()
