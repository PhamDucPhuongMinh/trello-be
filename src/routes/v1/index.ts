import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from './boardRoute'

const Router = express.Router()

Router.route('/').get((req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready use.' })
})

Router.use('/boards', boardRoute)

export const APIsV1 = Router
