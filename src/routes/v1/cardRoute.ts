import express from 'express'
import { cardController } from '~/controllers/cardController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { cardValidation } from '~/validations/cardValidation'

const Router = express.Router()

Router.route('/').post(authMiddleware.isAuthorized, cardValidation.create, cardController.create)

export const cardRoute = Router
