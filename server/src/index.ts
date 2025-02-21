import express, { Request, Response } from 'express'

const server = express()

server.use(express.static('public'))

server.get('/api', (req: Request, res: Response) => {
  res.send('Hello world!')
})

server.listen(6001, () => {
  console.log('Aarnihauta Server is running on http://localhost:6001')
})