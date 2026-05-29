import { NextResponse } from 'next/server'

import { authorizeAdmin } from '@/lib/admin-auth'
import { type CampaignBody,parseCampaign } from '@/lib/campaign'
import { type MarketingRecipient, sendMarketingBatch } from '@/lib/email'
import { buildUnsubscribeUrl } from '@/lib/marketing'
import { prisma } from '@/lib/prisma'
import { normalizeEmail, readLimitedJson, validationErrorResponse } from '@/lib/request-validation'

export const runtime = 'nodejs'

type SendBody = CampaignBody & {
  test?: unknown
  testEmail?: unknown
}

export async function POST(request: Request) {
  try {
    const authError = await authorizeAdmin(request)
    if (authError) return authError

    const body = await readLimitedJson<SendBody>(request)
    const campaign = parseCampaign(body)

    // Tryb testowy: wysyłka tylko na wskazany adres (podgląd przed kampanią).
    if (body.test === true) {
      const testEmail = normalizeEmail(body.testEmail, 'testEmail')
      const recipient = await buildTestRecipient(testEmail)
      const result = await sendMarketingBatch(campaign, [recipient])
      return NextResponse.json({ test: true, ...result })
    }

    const users = await prisma.user.findMany({
      where: { marketingConsent: true },
      select: { id: true, email: true },
    })

    const recipients: MarketingRecipient[] = users.map((user) => ({
      email: user.email,
      unsubscribeUrl: buildUnsubscribeUrl(user.id),
    }))

    const result = await sendMarketingBatch(campaign, recipients)
    return NextResponse.json({ test: false, ...result })
  } catch (error) {
    const validationResponse = validationErrorResponse(error)
    if (validationResponse) return validationResponse

    console.error('[POST /api/marketing/send]', error)
    return NextResponse.json({ error: 'Nie udało się wysłać kampanii.' }, { status: 500 })
  }
}

async function buildTestRecipient(email: string): Promise<MarketingRecipient> {
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } })
  // Gdy adres nie należy do konta, generujemy poglądowy token — wypisanie nikogo nie dotknie.
  return {
    email,
    unsubscribeUrl: buildUnsubscribeUrl(user?.id ?? 'preview'),
  }
}
