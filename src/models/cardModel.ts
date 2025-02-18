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

export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  create,
  findOneById
}
