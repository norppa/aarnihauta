import 'dotenv/config'
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

const server = express()
server.use(express.json())

const pool = new Pool({ host, port, database, user, password })

server.get('/api/store', async (req: Request, res: Response) => {
  const queryText = 'SELECT key, value FROM entries'
  const client = await pool.connect()
  const result = await client.query(queryText)
  client.release()
  res.send(result.rows)
})

server.post('/api/store', async (req: Request, res: Response) => {
  const { key, value } = req.body
  if (key === undefined || value === undefined) {
    res.status(400).send('Key and value are required')
    return
  }
  if (typeof key !== 'string' || typeof value !== 'string') {
    res.status(400).send('Key and value must be strings')
    return
  }
  const queryText = 'INSERT INTO entries (key, value) VALUES ($1, $2)'
  const queryValues = [key, value]
  try {
    const client = await pool.connect()
    await client.query(queryText, queryValues)
    client.release()
  } catch (error) {
    res.status(400).send('Value already exists or database error')
    return
  }
  res.send()
})

server.delete('/api/store', async (req: Request, res: Response) => {
  const { key } = req.body
  if (typeof key !== 'string' || key === undefined) {
    res.status(400).send('Key must be a string')
    return
  }
  const queryText = 'DELETE FROM values WHERE key = $1'
  const queryValues = [key]
  const client = await pool.connect()
  await client.query(queryText, queryValues)
  client.release()
  res.send()
})

server.listen(serverPortString, () => {
  console.log(`Aarnihauta Server @ ${port}`)
})