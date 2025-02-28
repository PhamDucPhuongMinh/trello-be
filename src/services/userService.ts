import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { userModel } from '~/models/userModel'
import { RegisterUserRequestBodyType } from '~/types/userType'
import ApiError from '~/utils/ApiError'
import { pickUser } from '~/utils/formatters'

const create = async (reqBody: RegisterUserRequestBodyType) => {
  const existedUser = await userModel.findOneByEmail(reqBody.email)
  if (existedUser) {
    throw new ApiError(StatusCodes.CONFLICT, 'Email already exists')
  }

  // Tạo data user
  const nameFromEmail = reqBody.email.split('@')[0]
  const newUserData = {
    email: reqBody.email,
    password: bcrypt.hashSync(reqBody.password, 10),
    username: nameFromEmail,
    displayName: nameFromEmail,
    verifyToken: uuidv4()
  }

  // Lưu data user vào DB
  const createdUserId = await userModel.create(newUserData)
  const createdUser = await userModel.findOneById(createdUserId)

  if (!createdUser) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Create user failed')
  }

  return pickUser(createdUser)

  // Tao token verify và gửi email xác nhận
}

export const userService = {
  create
}
