import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { userModel } from '~/models/userModel'
import { RegisterUserRequestBodyType } from '~/types/userType'
import ApiError from '~/utils/ApiError'
import { pickUser } from '~/utils/formatters'
import { WEBSITE_DOMAIN } from '~/utils/constants'
import { BrevoProvider } from '~/providers/BrevoProvider'

const create = async (reqBody: RegisterUserRequestBodyType) => {
  try {
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

    // Tao token verify và gửi email xác nhận
    const verificationUrl = `${WEBSITE_DOMAIN}/account/verification?email=${createdUser.email}&token=${createdUser.verifyToken}`
    const customSubject = 'Trello Application: Please verify your email address before using our service!'
    const htmlContent = `
    <h3>Hi ${createdUser.displayName},</h3>
    <p>Thank you for registering an account on our service.</p>
    <p>Please click the link below to verify your email address:</p>
    <a href="${verificationUrl}">${verificationUrl}</a>
    <p>If you did not register an account, you can safely ignore this email.</p>
    <p>Thank you!</p>
  `
    console.log(createdUser.email)
    await BrevoProvider.sendEmail(createdUser.email, customSubject, htmlContent)

    return pickUser(createdUser)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const userService = {
  create
}
