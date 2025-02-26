import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { CardSchemaType } from '~/types/cardType'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const CARD_COLLECTION_NAME = 'cards'
const CARD_COLLECTION_SCHEMA = Joi.object<CardSchemaType>({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})
const INVALID_UPDATE_FIELDS = ['_id', 'boardId', 'createdAt']

const create = async (data: object) => {
  try {
    const validData = await CARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
    validData.boardId = new ObjectId(validData.boardId)
    validData.columnId = new ObjectId(validData.columnId)
    const createdBoardId = await GET_DB().collection(CARD_COLLECTION_NAME).insertOne(validData)
    return createdBoardId.insertedId
  } catch (error) {
    throw new Error(String(error))
  }
}

const findOneById = async (id: string | ObjectId) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) })
    return result as (CardSchemaType & { _id: ObjectId }) | null
  } catch (error) {
    throw new Error(String(error))
  }
}

const update = async (cardId: string | ObjectId, updatedData: Partial<CardSchemaType>) => {
  try {
    Object.keys(updatedData).forEach((key) => {
      if (INVALID_UPDATE_FIELDS.includes(key)) {
        delete updatedData[key as keyof CardSchemaType]
      }
      // Check nếu key không có trong schema thì xóa luôn
      else if (!Object.keys(CARD_COLLECTION_SCHEMA.describe().keys).includes(key)) {
        delete updatedData[key as keyof CardSchemaType]
      }
    })

    if (updatedData.columnId) {
      updatedData.columnId = new ObjectId(updatedData.columnId)
    }

    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(cardId) },
        { $set: updatedData },
        {
          returnDocument: 'after'
        }
      )
    return result
  } catch (error) {
    throw new Error(String(error))
  }
}

const deleteManyByColumnId = async (columnId: string | ObjectId) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .deleteMany({ columnId: new ObjectId(columnId) })
    return result
  } catch (error) {
    throw new Error(String(error))
  }
}

export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  create,
  findOneById,
  update,
  deleteManyByColumnId
}
