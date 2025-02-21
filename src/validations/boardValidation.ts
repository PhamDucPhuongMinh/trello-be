import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { BoardSchemaType, CreateBoardRequestBodyType, SupportMovingCardRequestBodyType } from '~/types/boardType'
import ApiError from '~/utils/ApiError'
import { BOARD_TYPES } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const create = async (req: Request, res: Response, next: NextFunction) => {
  const correctCondition = Joi.object<CreateBoardRequestBodyType>({
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

const update = async (req: Request, res: Response, next: NextFunction) => {
  // Không bắt buộc cập nhật tất cả các trường => không sử dụng required()
  const correctCondition = Joi.object<Partial<BoardSchemaType>>({
    title: Joi.string().min(3).max(50).trim().strict(),
    description: Joi.string().min(3).max(256).trim().strict(),
    type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).trim().strict(),
    columnOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([])
  })

  try {
    // allowUnknown: true để cho phép cập nhật các trường không nằm  trong schema
    await correctCondition.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error as string).message))
  }
}

const moveCardToDifferentColumn = async (req: Request, res: Response, next: NextFunction) => {
  // Không bắt buộc cập nhật tất cả các trường => không sử dụng required()
  const correctCondition = Joi.object<SupportMovingCardRequestBodyType>({
    cardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    prevColumnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    prevCardOrderedIds: Joi.array()
      .required()
      .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)),
    nextColumnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    nextCardOrderedIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
  })

  try {
    // allowUnknown: true để cho phép cập nhật các trường không nằm  trong schema
    await correctCondition.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error as string).message))
  }
}

export const boardValidation = {
  create,
  update,
  moveCardToDifferentColumn
}
