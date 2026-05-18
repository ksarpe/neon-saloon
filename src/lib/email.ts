type SendPasswordResetEmailInput = {
  to: string
  resetUrl: string
}

type ResendEmailResponse = {
  id?: string
  message?: string
  error?: { message?: string }
}

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM)
}

export async function sendPasswordResetEmail(input: SendPasswordResetEmailInput) {
  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV !== 'production') {
      console.info(`[password-reset] ${input.to}: ${input.resetUrl}`)
      return { delivered: false, devUrl: input.resetUrl }
    }

    throw new Error('Email provider is not configured')
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to: input.to,
      subject: 'Reset hasła w Last Rodeo',
      html: buildPasswordResetEmail(input.resetUrl),
      text: buildPasswordResetText(input.resetUrl),
    }),
  })

  const payload = (await response.json().catch(() => ({}))) as ResendEmailResponse
  if (!response.ok) {
    throw new Error(payload.error?.message ?? payload.message ?? 'Failed to send email')
  }

  return { delivered: true, id: payload.id }
}

function buildPasswordResetEmail(resetUrl: string) {
  return `
    <div style="font-family:Arial,sans-serif;background:#0d0818;color:#fff;padding:32px">
      <div style="max-width:520px;margin:0 auto;border:1px solid rgba(255,220,180,.18);border-radius:16px;padding:28px;background:#160d25">
        <h1 style="margin:0 0 12px;color:#f94aff">Reset hasła</h1>
        <p style="line-height:1.6;color:#d8c9e8">
          Dostaliśmy prośbę o zmianę hasła do Twojego konta Last Rodeo.
          Link jest ważny przez 30 minut.
        </p>
        <p style="margin:28px 0">
          <a href="${resetUrl}" style="display:inline-block;background:#f94aff;color:#fff;text-decoration:none;font-weight:700;border-radius:12px;padding:14px 18px">
            Ustaw nowe hasło
          </a>
        </p>
        <p style="font-size:13px;line-height:1.5;color:#9d8faf">
          Jeśli to nie Ty, zignoruj tę wiadomość. Twoje hasło nie zostanie zmienione.
        </p>
      </div>
    </div>
  `
}

function buildPasswordResetText(resetUrl: string) {
  return [
    'Reset hasła w Last Rodeo',
    '',
    'Dostaliśmy prośbę o zmianę hasła do Twojego konta.',
    'Link jest ważny przez 30 minut:',
    resetUrl,
    '',
    'Jeśli to nie Ty, zignoruj tę wiadomość.',
  ].join('\n')
}
