import { env } from '~/config/environment'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const brevo = require('@getbrevo/brevo')
const apiInstance = new brevo.TransactionalEmailsApi()

const apiKey = apiInstance.authentications['apiKey']
apiKey.apiKey = env.BREVO_API_KEY

const sendSmtpEmail = new brevo.SendSmtpEmail()

const sendEmail = async (to: string, subject: string, htmlContent: string) => {
  sendSmtpEmail.subject = subject
  sendSmtpEmail.htmlContent = htmlContent
  sendSmtpEmail.sender = { name: env.ADMIN_EMAIL_NAME, email: env.ADMIN_EMAIL_ADDRESS }
  sendSmtpEmail.to = [{ email: to }]

  return apiInstance.sendTransacEmail(sendSmtpEmail)
}

export const BrevoProvider = {
  sendEmail
}
