import express, { Request, Response } from 'express'
import { Pool } from 'pg'

const {
  AARNIHAUTA_PORT: serverPortString,
  AARNIHAUTA_PG_HOST: host,
  AARNIHAUTA_PG_PORT: portString,
  AARNIHAUTA_PG_USER: user,
  AARNIHAUTA_PG_PASS: password,
  AARNIHAUTA_PG_DB: database
} = process.env;

const port = Number(portString)

const pool = new Pool({ host, port, database, user, password })

const router = express.Router()

router.get('/:key', async (req: Request, res: Response) => {
  const key = req.params.key
  const queryText = 'SELECT value FROM entries WHERE key = $1'
  const queryValues = [key]
  try {
    const client = await pool.connect()
    const result = await client.query(queryText, queryValues)
    client.release()
    if (result.rows.length === 0) {
      res.status(404).send('Key not found')
      return
    }
    res.send(result.rows[0].value)
  } catch (error) {
    res.status(500).send('Database error')
    return
  }
})

router.post('/:key', async (req: Request, res: Response) => {
  const key = req.params.key
  const value = req.body.value
  if (typeof value !== 'string') {
    res.status(400).send('Value must be a string')
    return
  }

  const queryText = 'INSERT INTO entries (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value'
  const queryValues = [key, value]
  try {
    const client = await pool.connect()
    await client.query(queryText, queryValues)
    client.release()
  } catch (error) {
    res.status(500).send('Database error')
    return
  }
  res.send()
})

router.delete('/:key', async (req: Request, res: Response) => {
  const key = req.params.key
  const queryText = 'DELETE FROM entries WHERE key = $1'
  const queryValues = [key]
  try {
    const client = await pool.connect()
    await client.query(queryText, queryValues)
    client.release()
  } catch (error) {
    res.status(500).send('Database error')
    return
  }
  res.send()
})

export default router