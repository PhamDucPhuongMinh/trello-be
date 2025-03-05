import JWT from 'jsonwebtoken'
import ms from 'ms'

const generateToken = (payload: string | Buffer | object, secretKey: string, timeLife: number | ms.StringValue) => {
  return JWT.sign(payload, secretKey, { algorithm: 'HS256', expiresIn: timeLife })
}

const verifyToken = (token: string, secretKey: string) => {
  return JWT.verify(token, secretKey)
}

export const JwtProvider = {
  generateToken,
  verifyToken
}
