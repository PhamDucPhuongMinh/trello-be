import 'dotenv/config'

export const env = {
  MONGO_URI: process.env.MONGO_URI || '',
  DATABASE_NAME: process.env.DATABASE_NAME || '',
  APP_HOST: process.env.HOST || 'localhost',
  APP_PORT: Number(process.env.PORT) || 8080
}
