import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { UserSchemaType } from '~/types/userType'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from '~/utils/validators'

const USER_ROLE = {
  ADMIN: 'admin',
  CLIENT: 'client'
}

// Define Collection (name & schema)
const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object<UserSchemaType>({
  email: Joi.string().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
  password: Joi.string().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE),
  username: Joi.string().required().trim().strict(),
  displayName: Joi.string().required().trim().strict(),
  avatar: Joi.string().default(null),
  role: Joi.string().valid(USER_ROLE.ADMIN, USER_ROLE.CLIENT).default(USER_ROLE.CLIENT),

  isActivated: Joi.boolean().default(false),
  verifyToken: Joi.string(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})
const INVALID_UPDATE_FIELDS = ['_id', 'email', 'username', 'createdAt']

const create = async (newUserData: Partial<UserSchemaType>) => {
  try {
    const validData = await USER_COLLECTION_SCHEMA.validateAsync(newUserData, { abortEarly: false })
    const result = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validData)
    return result.insertedId
  } catch (error) {
    throw new Error(String(error))
  }
}

const findOneById = async (id: string | ObjectId) => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) })
    return result as (UserSchemaType & { _id: ObjectId }) | null
  } catch (error) {
    throw new Error(String(error))
  }
}

const findOneByEmail = async (email: string) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ email })
    return result as (UserSchemaType & { _id: ObjectId }) | null
  } catch (error) {
    throw new Error(String(error))
  }
}

export const userModel = {
  USER_ROLE,
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  INVALID_UPDATE_FIELDS,

  create,
  findOneById,
  findOneByEmail
}
