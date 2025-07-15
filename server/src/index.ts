import 'dotenv/config'
import express, { Request, Response } from 'express'
import storeRouter from './storeRouter'


const server = express()
server.use(express.json())

server.use('/api/store', storeRouter)

const port = process.env.AARNIHAUTA_PORT
server.listen(port, () => {
  console.log(`Aarnihauta Server @ ${port}`)
})