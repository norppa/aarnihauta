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

server.use(express.static('public'))

const pool = new Pool({ host, port, database, user, password })

server.get('/api/values', async (req: Request, res: Response) => {
  const queryText = 'SELECT * FROM values'
  const client = await pool.connect()
  const result = await client.query(queryText)
  client.release()
  res.send(result.rows)
})

server.post('/api/values', async (req: Request, res: Response) => {
  console.log(req.body)
  const queryText = 'INSERT INTO values (value) VALUES ($1) RETURNING *'
  const queryValues = [req.body.value]
  console.log(queryValues)
  const client = await pool.connect()
  const result = await client.query(queryText, queryValues)
  client.release()
  res.send(result.rows)
})

server.delete('/api/values', async (req: Request, res: Response) => {
  const queryText = 'DELETE FROM values'
  const client = await pool.connect()
  const result = await client.query(queryText)
  client.release()
  res.send()
})

server.listen(serverPortString, () => {
  console.log(`Aarnihauta Server is running on http://localhost:${serverPortString}`)
})