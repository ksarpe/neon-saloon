import { NextResponse } from 'next/server'

import { verifyUnsubscribeToken } from '@/lib/marketing'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

// Klik w link „Wypisz się" w wiadomości (GET) — wycofuje zgodę i pokazuje stronę potwierdzenia.
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token') ?? ''
  const ok = await applyUnsubscribe(token)
  return htmlPage(ok)
}

// Jednoklikowe wypisanie wg RFC 8058 (nagłówek List-Unsubscribe-Post). Klient pocztowy
// wysyła POST na ten adres — odpowiadamy statusem, bez treści HTML.
export async function POST(request: Request) {
  const token = new URL(request.url).searchParams.get('token') ?? ''
  const ok = await applyUnsubscribe(token)
  return new NextResponse(null, { status: ok ? 200 : 400 })
}

async function applyUnsubscribe(token: string) {
  let userId: string | null
  try {
    userId = verifyUnsubscribeToken(token)
  } catch (error) {
    console.error('[marketing/unsubscribe] verify failed', error)
    return false
  }

  if (!userId) return false

  // updateMany nie rzuca, gdy konta nie ma — nie ujawniamy, czy adres istnieje.
  await prisma.user.updateMany({
    where: { id: userId },
    data: { marketingConsent: false, marketingConsentAt: null },
  })
  return true
}

function htmlPage(ok: boolean) {
  const title = ok ? 'Wypisano z mailingu' : 'Nie udało się wypisać'
  const message = ok
    ? 'Nie będziesz już otrzymywać od nas wiadomości marketingowych. Możesz w każdej chwili włączyć je ponownie w ustawieniach konta.'
    : 'Link wypisania jest nieprawidłowy lub wygasł. Zgodę możesz też wyłączyć w ustawieniach konta lub pisząc do nas.'

  const body = `<!doctype html>
<html lang="pl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>${title} — Last Rodeo</title>
  </head>
  <body style="margin:0;font-family:Arial,sans-serif;background:#0d0818;color:#f0dfc0;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px">
    <div style="max-width:480px;width:100%;border:1px solid rgba(255,220,180,.18);border-radius:16px;padding:32px;background:#160d25;text-align:center">
      <h1 style="margin:0 0 12px;color:${ok ? '#6ee7b7' : '#f87171'};font-size:22px">${title}</h1>
      <p style="line-height:1.6;color:#d8c9e8;font-size:14px;margin:0 0 24px">${message}</p>
      <a href="/" style="display:inline-block;background:#f94aff;color:#fff;text-decoration:none;font-weight:700;border-radius:12px;padding:12px 20px">Wróć do Last Rodeo</a>
    </div>
  </body>
</html>`

  return new NextResponse(body, {
    status: ok ? 200 : 400,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  })
}
