// lib/sendgrid/index.ts
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

const FROM = {
  email: process.env.SENDGRID_FROM_EMAIL!,
  name: process.env.SENDGRID_FROM_NAME || 'STRATIQ',
}

// ── Base Email Template ───────────────────────────────────
function baseTemplate(content: string, preheader: string = '') {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>STRATIQ</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #080b0f; color: #E6EDF3; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .logo { font-size: 20px; font-weight: 700; letter-spacing: 0.3em; color: #E6EDF3; margin-bottom: 40px; }
    .logo span { color: #3B82F6; }
    .card { background: #1C1F26; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 40px; }
    h1 { font-size: 24px; font-weight: 600; color: #E6EDF3; margin-bottom: 16px; line-height: 1.3; }
    p { font-size: 15px; line-height: 1.7; color: #8B98A8; margin-bottom: 16px; }
    .btn { display: inline-block; background: #3B82F6; color: #fff !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; margin: 24px 0; }
    .divider { border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 32px 0; }
    .footer { margin-top: 40px; font-size: 13px; color: #4A5568; text-align: center; }
    .footer a { color: #3B82F6; text-decoration: none; }
    .badge { display: inline-block; background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.2); color: #3B82F6; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 20px; }
    .metric { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 16px 20px; margin: 8px 0; }
    .metric-label { font-size: 12px; color: #4A5568; text-transform: uppercase; letter-spacing: 0.08em; }
    .metric-value { font-size: 20px; font-weight: 600; color: #E6EDF3; margin-top: 4px; }
  </style>
</head>
<body>
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>` : ''}
  <div class="wrapper">
    <div class="logo">S T R A T<span>I</span>Q</div>
    <div class="card">
      ${content}
    </div>
    <div class="footer">
      <p style="margin-bottom:8px;">© ${new Date().getFullYear()} STRATIQ · Decision Intelligence Platform</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}">stratiq.io</a> · <a href="${process.env.NEXT_PUBLIC_APP_URL}/privacy">Privacy</a> · <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`
}

// ── Welcome Email ─────────────────────────────────────────
export async function sendWelcomeEmail(to: string, firstName: string) {
  const content = `
    <div class="badge">Welcome</div>
    <h1>Your strategic advantage starts now.</h1>
    <p>Welcome to STRATIQ, ${firstName}. You've joined a platform built for those who take high-stakes decisions seriously.</p>
    <p>STRATIQ gives you structured frameworks to model decisions, simulate scenarios, and understand risk before you commit.</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="btn">Open Your Dashboard</a>
    <hr class="divider">
    <p style="font-size:13px;">Here's how to get started:<br>
    <strong style="color:#E6EDF3;">1.</strong> Create your first Decision<br>
    <strong style="color:#E6EDF3;">2.</strong> Define your options and variables<br>
    <strong style="color:#E6EDF3;">3.</strong> Run a Scenario Simulation<br>
    <strong style="color:#E6EDF3;">4.</strong> Export your executive report</p>
  `

  await sgMail.send({
    to,
    from: FROM,
    subject: 'Welcome to STRATIQ – Your Decision Intelligence Platform',
    html: baseTemplate(content, 'Your strategic advantage starts now.'),
  })
}

// ── Subscription Confirmation ─────────────────────────────
export async function sendSubscriptionConfirmation(to: string, firstName: string, tier: string, amount: string, nextBilling: string) {
  const content = `
    <div class="badge">Subscription Active</div>
    <h1>Your ${tier} plan is active.</h1>
    <p>Thank you, ${firstName}. Your STRATIQ subscription has been confirmed.</p>
    <div class="metric">
      <div class="metric-label">Plan</div>
      <div class="metric-value">${tier}</div>
    </div>
    <div class="metric">
      <div class="metric-label">Amount</div>
      <div class="metric-value">${amount}</div>
    </div>
    <div class="metric">
      <div class="metric-label">Next Billing Date</div>
      <div class="metric-value">${nextBilling}</div>
    </div>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/account" class="btn">Manage Subscription</a>
  `

  await sgMail.send({
    to,
    from: FROM,
    subject: `STRATIQ ${tier} Plan – Subscription Confirmed`,
    html: baseTemplate(content, `Your ${tier} plan is now active.`),
  })
}

// ── Simulation Complete ───────────────────────────────────
export async function sendSimulationComplete(to: string, firstName: string, decisionTitle: string, recommendedOption: string, confidence: number) {
  const content = `
    <div class="badge">Simulation Complete</div>
    <h1>Your simulation is ready.</h1>
    <p>Hi ${firstName}, your scenario simulation for <strong style="color:#E6EDF3;">"${decisionTitle}"</strong> has completed.</p>
    <div class="metric">
      <div class="metric-label">Recommended Option</div>
      <div class="metric-value">${recommendedOption}</div>
    </div>
    <div class="metric">
      <div class="metric-label">Confidence Score</div>
      <div class="metric-value">${confidence}%</div>
    </div>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/decisions" class="btn">View Full Analysis</a>
    <hr class="divider">
    <p style="font-size:13px;color:#4A5568;">STRATIQ does not make decisions for you. It models them. Use this analysis as one input within your broader decision-making process.</p>
  `

  await sgMail.send({
    to,
    from: FROM,
    subject: `Simulation Complete: "${decisionTitle}"`,
    html: baseTemplate(content, `Simulation complete. Confidence: ${confidence}%`),
  })
}

// ── Password Reset ────────────────────────────────────────
export async function sendPasswordReset(to: string, resetUrl: string) {
  const content = `
    <h1>Reset your password.</h1>
    <p>We received a request to reset the password associated with this email address.</p>
    <p>Click below to set a new password. This link expires in 1 hour.</p>
    <a href="${resetUrl}" class="btn">Reset Password</a>
    <hr class="divider">
    <p style="font-size:13px;color:#4A5568;">If you didn't request this, you can safely ignore this email. Your password will remain unchanged.</p>
  `

  await sgMail.send({
    to,
    from: FROM,
    subject: 'STRATIQ – Reset Your Password',
    html: baseTemplate(content, 'Reset your STRATIQ password.'),
  })
}

// ── Payment Receipt ───────────────────────────────────────
export async function sendPaymentReceipt(to: string, firstName: string, amount: string, date: string, invoiceUrl: string) {
  const content = `
    <div class="badge">Payment Receipt</div>
    <h1>Payment confirmed.</h1>
    <p>Hi ${firstName}, your payment to STRATIQ has been processed successfully.</p>
    <div class="metric">
      <div class="metric-label">Amount Charged</div>
      <div class="metric-value">${amount}</div>
    </div>
    <div class="metric">
      <div class="metric-label">Date</div>
      <div class="metric-value">${date}</div>
    </div>
    <a href="${invoiceUrl}" class="btn">View Invoice</a>
  `

  await sgMail.send({
    to,
    from: FROM,
    subject: 'STRATIQ – Payment Receipt',
    html: baseTemplate(content, `Payment of ${amount} confirmed.`),
  })
}
