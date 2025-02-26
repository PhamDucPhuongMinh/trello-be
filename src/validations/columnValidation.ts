import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { ColumnSchemaType, CreateColumnRequestBodyType } from '~/types/columnType'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const create = async (req: Request, res: Response, next: NextFunction) => {
  const correctCondition = Joi.object<CreateColumnRequestBodyType>({
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().required().min(3).max(50).trim().strict()
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
  const correctCondition = Joi.object<Partial<ColumnSchemaType>>({
    boardId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().min(3).max(50).trim().strict(),
    cardOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([])
  })

  try {
    // allowUnknown: true để cho phép cập nhật các trường không nằm  trong schema
    await correctCondition.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error as string).message))
  }
}

const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  const correctCondition = Joi.object({
    id: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  })

  try {
    await correctCondition.validateAsync({ id: req.params.id })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error as string).message))
  }
}

export const columnValidation = {
  create,
  update,
  deleteItem
}
