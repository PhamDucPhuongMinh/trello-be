import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { CreateResBoardBodyType } from '~/types/boardType'
import ApiError from '~/utils/ApiError'
import { BOARD_TYPES } from '~/utils/constants'

const create = async (req: Request, res: Response, next: NextFunction) => {
  const correctCondition = Joi.object<CreateResBoardBodyType>({
    title: Joi.string().required().min(3).max(50).trim().strict(),
    description: Joi.string().required().min(3).max(256).trim().strict(),
    type: Joi.string().required().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).trim().strict()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error as string).message))
  }
}

export const boardValidation = {
  create
}
