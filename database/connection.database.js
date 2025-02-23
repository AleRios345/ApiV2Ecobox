import 'dotenv/config.js'
import pg from 'pg'

const { Pool } = pg

export const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  allowExitOnIdle: true,
  ssl: {
    rejectUnauthorized: false
  }
})
