import express, { Request, Response } from 'express'
import pool from '../db/db'

const exerciseRouter = express.Router()

// GET all exercises
exerciseRouter.get('/exercises', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM exercises')
    const exercises = result.rows
    res.json(exercises)
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).send(e.message)
    }
  }
})

// GET one exercise
exerciseRouter.get('/exercises/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    const result = await pool.query(
      'SELECT * FROM exercises WHERE exercise_id = $1',
      [id]
    )
    const exercise = result.rows[0]

    if (exercise) {
      res.json(exercise)
    } else {
      res.status(404).json({ message: 'Exercise not found' })
    }
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).send(e.message)
    }
  }
})

// CREATE a new exercise
exerciseRouter.post('/exercises', async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      difficulty,
      equipment_type,
      muscle_target,
      image_url,
      video_url,
      tags,
      benefits,
      user_rating,
    } = req.body
    const newExercise = await pool.query(
      'INSERT INTO exercises (name, description, difficulty, equipment_type, muscle_target, image_url, video_url, tags, benefits, user_rating) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [
        name,
        description,
        difficulty,
        equipment_type,
        muscle_target,
        image_url,
        video_url,
        tags,
        benefits,
        user_rating,
      ]
    )

    res.json(newExercise.rows[0])
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).send(e.message)
    }
  }
})

// UPDATE an exercise
exerciseRouter.put('/exercises/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    const {
      name,
      description,
      difficulty,
      equipment_type,
      muscle_target,
      image_url,
      video_url,
      tags,
      benefits,
      user_rating,
    } = req.body

    const updatedExercise = await pool.query(
      'UPDATE exercises SET name=$1, description=$2, difficulty=$3, equipment_type=$4, muscle_target=$5, image_url=$6, video_url=$7, tags=$8, benefits=$9, user_rating=$10 WHERE exercise_id=$11 RETURNING *',
      [
        name,
        description,
        difficulty,
        equipment_type,
        muscle_target,
        image_url,
        video_url,
        tags,
        benefits,
        user_rating,
        id,
      ]
    )

    if (updatedExercise.rows.length > 0) {
      res.json(updatedExercise.rows[0])
    } else {
      res.status(404).json({ message: 'Exercise not found' })
    }
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).send(e.message)
    }
  }
})

// DELETE an exercise
exerciseRouter.delete('/exercises/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    const result = await pool.query(
      'DELETE FROM exercises WHERE exercise_id = $1 RETURNING *',
      [id]
    )
    const deletedExercise = result.rows[0]

    if (deletedExercise) {
      res.json({ message: 'Exercise deleted successfully', deletedExercise })
    } else {
      res.status(404).json({ message: 'Exercise not found' })
    }
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).send(e.message)
    }
  }
})

export { exerciseRouter }
