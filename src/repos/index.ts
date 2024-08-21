import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

const dbString = `postgresql://${process.env.POSTGRESDB_USER}:${process.env.POSTGRESDB_ROOT_PASSWORD}@${process.env.POSTGRESDB_HOST}:${process.env.POSTGRESDB_PORT}/${process.env.POSTGRESDB_DATABASE}?schema=public`

const pool = new Pool({
  connectionString: dbString,
})

export const db = drizzle(pool)
