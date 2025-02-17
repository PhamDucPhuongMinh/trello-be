import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardController } from '~/controllers/boardController'
import { boardValidation } from '~/validations/boardValidation'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET /board' })
  })
  .post(boardValidation.create, boardController.create)

Router.route('/:id').get(boardController.getDetails)

export const boardRoute = Router
