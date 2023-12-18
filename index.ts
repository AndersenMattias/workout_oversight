import dotenv from 'dotenv'
import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import { exerciseRouter } from './routes/exercises'

dotenv.config()

const app: Express = express()

app.use(express.json())
app.use(cors())

app.use('/api', exerciseRouter)

app.get('/', async (req: Request, res: Response) => {
  //const exercises = await pool.query('SELECT * FROM exercises')

  // res.json(exercises.rows)

  res.json({ message: 'Hello from server side!' })
})

const port = process.env.PORT || 8000

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
