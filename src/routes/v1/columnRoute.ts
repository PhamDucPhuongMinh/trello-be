import express from 'express'
import { columnController } from '~/controllers/columnController'
import { columnValidation } from '~/validations/columnValidation'

const Router = express.Router()

Router.route('/').post(columnValidation.create, columnController.create)

Router.route('/:id').put(columnValidation.update, columnController.update)

Router.route('/:id').delete(columnValidation.deleteItem, columnController.deleteItem)

export const columnRoute = Router
