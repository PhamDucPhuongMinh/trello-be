import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import ms from 'ms'
import { userService } from '~/services/userService'
import ApiError from '~/utils/ApiError'

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createdUser = await userService.create(req.body)
    res.status(StatusCodes.CREATED).json(createdUser)
  } catch (error) {
    next(error)
  }
}

const verifyAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.verifyAccount(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.login(req.body)

    // Xử lý trả về http only cookie cho phía client
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14days')
    })

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14days')
    })

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    res.status(StatusCodes.OK).json({ message: 'Logout successfully' })
  } catch (error) {
    next(error)
  }
}

const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken: string | undefined = req.cookies?.refreshToken
    if (!refreshToken) {
      throw 'Missing refresh token'
    }
    const result = await userService.refreshToken(refreshToken)
    // Xử lý trả về http only cookie cho phía client
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14days')
    })

    res.status(StatusCodes.OK).json(result)
  } catch {
    next(new ApiError(StatusCodes.FORBIDDEN, 'Please login to continue'))
  }
}

export const userController = {
  create,
  verifyAccount,
  login,
  logout,
  refreshToken
}
