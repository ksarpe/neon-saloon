import { NextResponse } from 'next/server'

import { authorizeAdmin } from '@/lib/admin-auth'
import { type CampaignBody,parseCampaign } from '@/lib/campaign'
import { sendServiceBatch } from '@/lib/email'
import { prisma } from '@/lib/prisma'
import { normalizeEmail, readLimitedJson, validationErrorResponse } from '@/lib/request-validation'

export const runtime = 'nodejs'

type SendBody = CampaignBody & {
  test?: unknown
  testEmail?: unknown
}

// Powiadomienia serwisowe (np. zmiana regulaminu) trafiają do KAŻDEGO konta —
// niezależnie od zgody marketingowej. To komunikacja związana z umową/obowiązkiem
// informacyjnym, nie marketing.
export async function POST(request: Request) {
  try {
    const authError = await authorizeAdmin(request)
    if (authError) return authError

    const body = await readLimitedJson<SendBody>(request)
    const campaign = parseCampaign(body)

    if (body.test === true) {
      const testEmail = normalizeEmail(body.testEmail, 'testEmail')
      const result = await sendServiceBatch(campaign, [testEmail])
      return NextResponse.json({ test: true, ...result })
    }

    const users = await prisma.user.findMany({ select: { email: true } })
    const emails = users.map((user) => user.email)

    const result = await sendServiceBatch(campaign, emails)
    return NextResponse.json({ test: false, ...result })
  } catch (error) {
    const validationResponse = validationErrorResponse(error)
    if (validationResponse) return validationResponse

    console.error('[POST /api/admin/service-email/send]', error)
    return NextResponse.json({ error: 'Nie udało się wysłać powiadomienia.' }, { status: 500 })
  }
}
