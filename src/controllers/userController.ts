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

const verifyAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.verifyAccount(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.login(req.body)

    // Xử lý trả về http only cookie cho phía client

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const userController = {
  create,
  verifyAccount,
  login
}
