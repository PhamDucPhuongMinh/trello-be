import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { columnService } from '~/services/columnService'

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createdColumn = await columnService.create(req.body)
    res.status(StatusCodes.CREATED).json(createdColumn)
  } catch (error) {
    next(error)
  }
}

export const columnController = {
  create
}
