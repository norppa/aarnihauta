import 'dotenv/config'
import express, { Request, Response } from 'express'
import cors from 'cors'
import storeRouter from './storeRouter'

const server = express()
server.use(cors())
server.use(express.json())

server.get('/', (req: Request, res: Response) => {
  res.send('Aarnihauta Server is running')
})

server.use('/api/store', storeRouter)

const port = process.env.AARNIHAUTA_PORT
server.listen(port, () => {
  console.log(`Aarnihauta Server @ ${port}`)
})