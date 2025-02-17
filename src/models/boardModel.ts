import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { BOARD_TYPES } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { columnModel } from './columnModel'
import { cardModel } from './cardModel'
import { BoardSchemaType } from '~/types/boardType'

// Define Collection (name & schema)
const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object<BoardSchemaType>({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  description: Joi.string().required().min(3).max(256).trim().strict(),
  type: Joi.string().required().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).trim().strict(),

  // Các item trong mảng columnOrderIds là ObjectId nên cần thêm pattern cho chuẩn
  columnOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const create = async (data: object) => {
  try {
    const validData = await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
    const createdBoardId = await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(validData)
    return createdBoardId.insertedId
  } catch (error) {
    throw new Error(String(error))
  }
}

const findOneById = async (id: string | ObjectId) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) })
    return result as (BoardSchemaType & { _id: ObjectId }) | null
  } catch (error) {
    throw new Error(String(error))
  }
}

const getDetails = async (id: string | ObjectId) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id),
            _destroy: false
          }
        },
        {
          $lookup: {
            from: columnModel.COLUMN_COLLECTION_NAME,
            localField: '_id',
            foreignField: 'boardId',
            as: 'columns'
          }
        },
        {
          $lookup: {
            from: cardModel.CARD_COLLECTION_NAME,
            localField: '_id',
            foreignField: 'boardId',
            as: 'cards'
          }
        }
      ])
      .toArray()
    return result[0] || null
  } catch (error) {
    throw new Error(String(error))
  }
}

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  create,
  findOneById,
  getDetails
}
