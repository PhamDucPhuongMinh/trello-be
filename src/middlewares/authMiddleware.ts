import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import { JwtProvider } from '~/providers/JwtProvider'
import ApiError from '~/utils/ApiError'

const isAuthorized = async (req: Request, res: Response, next: NextFunction) => {
  // Lấy access token từ request cookie phía client
  const clientAccessToken = req.cookies?.accessToken
  if (!clientAccessToken) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized - Access token not found'))
    return
  }
  try {
    // Kiểm tra token có hợp lệ không
    const accessTokenDecoded = JwtProvider.verifyToken(clientAccessToken, env.ACCESS_TOKEN_SECRET_SIGNATURE)
    // Nếu hợp lệ, lưu thông tin giải mã vào request để sử dụng cho các middleware và controller tiếp theo
    req.jwtDecoded = accessTokenDecoded // Store decoded token in the extended Request type
    next()
  } catch (error: unknown) {
    // Nếu token hết hạn
    if (error instanceof Error && error.message.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Need to refresh token.'))
      return
    } else {
      next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized - Invalid access token'))
      return
    }
  }
}

export const authMiddleware = {
  isAuthorized
}
