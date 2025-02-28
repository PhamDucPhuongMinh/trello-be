import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createdUser = await userService.create(req.body)
    res.status(StatusCodes.CREATED).json(createdUser)
  } catch (error) {
    next(error)
  }
}

export const userController = {
  create
}
