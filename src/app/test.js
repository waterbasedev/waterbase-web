import {db} from '@vercel/postgres'

const client = await db.connect()
await client.sql`SELECT 1`
