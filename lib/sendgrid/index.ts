export const sendEmail = async (data: {
  to: string
  subject: string
  html: string
  from?: string
}) => {
  console.log('Mock Email Sent:', data.subject, 'to', data.to)
  return { success: true }
}

export const sendWelcomeEmail = async (email: string, name: string) => {
  return sendEmail({
    to: email,
    subject: 'Welcome to STRATIQ',
    html: `<p>Hello ${name}, welcome aboard!</p>`,
  })
}

export const sendResetPasswordEmail = async (email: string, token: string) => {
  return sendEmail({
    to: email,
    subject: 'Reset your STRATIQ password',
    html: `<p>Use this link to reset your password: /auth/reset-password?token=${token}</p>`,
  })
}
