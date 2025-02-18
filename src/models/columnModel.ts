import Joi from 'joi'
import { ObjectId, PushOperator } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { ColumnSchemaType, CreateColumnRequestBodyType } from '~/types/columnType'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

// Define Collection (name & schema)
const COLUMN_COLLECTION_NAME = 'columns'
const COLUMN_COLLECTION_SCHEMA = Joi.object<ColumnSchemaType>({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),

  // Lưu ý các item trong mảng cardOrderIds là ObjectId nên cần thêm pattern cho chuẩn nhé
  cardOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const create = async (data: CreateColumnRequestBodyType) => {
  try {
    const validData = await COLUMN_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
    validData.boardId = new ObjectId(validData.boardId)
    const createdBoardId = await GET_DB().collection(COLUMN_COLLECTION_NAME).insertOne(validData)
    return createdBoardId.insertedId
  } catch (error) {
    throw new Error(String(error))
  }
}

const findOneById = async (id: string | ObjectId) => {
  try {
    const result = await GET_DB()
      .collection(COLUMN_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) })
    return result as (ColumnSchemaType & { _id: ObjectId }) | null
  } catch (error) {
    throw new Error(String(error))
  }
}

const pushCardOrderIds = async (columnId: string | ObjectId, cardId: string | ObjectId) => {
  try {
    const result = await GET_DB()
      .collection(COLUMN_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(columnId) },
        { $push: { cardOrderIds: new ObjectId(cardId) } as PushOperator<ColumnSchemaType> },
        {
          returnDocument: 'after'
        }
      )

    return result ? result.value : null
  } catch (error) {
    throw new Error(String(error))
  }
}

export const columnModel = {
  COLUMN_COLLECTION_NAME,
  COLUMN_COLLECTION_SCHEMA,
  create,
  findOneById,
  pushCardOrderIds
}
