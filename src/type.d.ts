import { JwtPayload } from 'jsonwebtoken' // if using this type

declare module 'express-serve-static-core' {
  interface Request {
    jwtDecoded?: JwtPayload | string
  }
}
