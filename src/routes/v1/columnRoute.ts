import express from 'express'
import { columnController } from '~/controllers/columnController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { columnValidation } from '~/validations/columnValidation'

const Router = express.Router()

Router.route('/').post(authMiddleware.isAuthorized, columnValidation.create, columnController.create)

Router.route('/:id').put(authMiddleware.isAuthorized, columnValidation.update, columnController.update)

Router.route('/:id').delete(authMiddleware.isAuthorized, columnValidation.deleteItem, columnController.deleteItem)

export const columnRoute = Router
