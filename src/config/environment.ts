import 'dotenv/config'

export const env = {
  MONGO_URI: process.env.MONGO_URI || '',
  DATABASE_NAME: process.env.DATABASE_NAME || '',
  APP_HOST: process.env.HOST || 'localhost',
  APP_PORT: Number(process.env.PORT) || 8080,
  BUILD_MODE: process.env.BUILD_MODE || 'production',

  BREVO_API_KEY: process.env.BREVO_API_KEY || '',
  ADMIN_EMAIL_ADDRESS: process.env.ADMIN_EMAIL_ADDRESS || '',
  ADMIN_EMAIL_NAME: process.env.ADMIN_EMAIL_NAME || '',

  WEBSITE_DOMAIN_DEVELOPMENT: process.env.WEBSITE_DOMAIN_DEVELOPMENT || 'http://localhost:3000',
  WEBSITE_DOMAIN_PRODUCTION: process.env.WEBSITE_DOMAIN_PRODUCTION || '',

  ACCESS_TOKEN_SECRET_SIGNATURE: process.env.ACCESS_TOKEN_SECRET_SIGNATURE || '',
  ACCESS_TOKEN_LIFE: process.env.ACCESS_TOKEN_LIFE || '',

  REFRESH_TOKEN_SECRET_SIGNATURE: process.env.REFRESH_TOKEN_SECRET_SIGNATURE || '',
  REFRESH_TOKEN_LIFE: process.env.REFRESH_TOKEN_LIFE || ''
}
