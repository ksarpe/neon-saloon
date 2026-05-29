'use client'

import { FileText, Loader2, Megaphone, Send, ShieldAlert } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { COMPANY } from '@/config/company'

type Mode = 'marketing' | 'service'

type SendResult = { test: boolean; total: number; sent: number; failed: number }

const ENDPOINT: Record<Mode, string> = {
  marketing: '/api/marketing/send',
  service: '/api/admin/service-email/send',
}

// Gotowy szablon powiadomienia o zmianie regulaminu (tryb serwisowy, do wszystkich).
// Pola z [nawiasami] admin uzupełnia przed wysyłką.
const TERMS_UPDATE_TEMPLATE = {
  subject: `Aktualizacja regulaminu ${COMPANY.brand}`,
  heading: 'Zmieniamy regulamin',
  body: [
    `Informujemy, że z dniem [DATA] wchodzi w życie nowy regulamin serwisu ${COMPANY.brand}.`,
    'Najważniejsze zmiany: [krótko opisz, co się zmienia].',
    `Jeśli nie akceptujesz nowych warunków, możesz przed tą datą zrezygnować z konta — w ustawieniach konta lub pisząc do nas na ${COMPANY.email}. Dalsze korzystanie z serwisu po wejściu zmian w życie oznacza ich akceptację.`,
    'Pełną treść nowego regulaminu znajdziesz pod przyciskiem poniżej.',
  ].join('\n\n'),
  ctaLabel: 'Zobacz nowy regulamin',
  ctaUrl: `${COMPANY.url}/regulamin`,
}

// Akapity rozdzielamy pustą linią — tak jak czyta je odbiorca.
function toParagraphs(value: string): string[] {
  return value
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+$/g, '').trim())
    .filter(Boolean)
}

export function AdminMailingForm() {
  const [mode, setMode] = useState<Mode>('marketing')
  const [subject, setSubject] = useState('')
  const [heading, setHeading] = useState('')
  const [bodyText, setBodyText] = useState('')
  const [ctaLabel, setCtaLabel] = useState('')
  const [ctaUrl, setCtaUrl] = useState('')
  const [testEmail, setTestEmail] = useState('')

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<SendResult | null>(null)

  function applyTermsTemplate() {
    setMode('service')
    setSubject(TERMS_UPDATE_TEMPLATE.subject)
    setHeading(TERMS_UPDATE_TEMPLATE.heading)
    setBodyText(TERMS_UPDATE_TEMPLATE.body)
    setCtaLabel(TERMS_UPDATE_TEMPLATE.ctaLabel)
    setCtaUrl(TERMS_UPDATE_TEMPLATE.ctaUrl)
    setError(null)
    setResult(null)
  }

  async function send(test: boolean) {
    setError(null)
    setResult(null)

    const paragraphs = toParagraphs(bodyText)
    if (!subject.trim() || !heading.trim() || paragraphs.length === 0) {
      setError('Uzupełnij temat, nagłówek i treść (co najmniej jeden akapit).')
      return
    }
    if (ctaLabel.trim() !== '' && ctaUrl.trim() === '') {
      setError('Podaj adres URL przycisku albo usuń jego etykietę.')
      return
    }
    if (test && !testEmail.trim()) {
      setError('Podaj adres e-mail do wysyłki testowej.')
      return
    }
    if (!test) {
      const audience = mode === 'marketing' ? 'wszystkich z zgodą marketingową' : 'WSZYSTKICH użytkowników'
      if (!window.confirm(`Wysłać kampanię do ${audience}? Tej operacji nie da się cofnąć.`)) {
        return
      }
    }

    const payload: Record<string, unknown> = {
      subject: subject.trim(),
      heading: heading.trim(),
      paragraphs,
      test,
    }
    if (ctaLabel.trim() && ctaUrl.trim()) {
      payload.cta = { label: ctaLabel.trim(), url: ctaUrl.trim() }
    }
    if (test) payload.testEmail = testEmail.trim()

    setBusy(true)
    try {
      const response = await fetch(ENDPOINT[mode], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = (await response.json().catch(() => ({}))) as Partial<SendResult> & {
        error?: string
      }
      if (!response.ok) {
        setError(data.error ?? 'Nie udało się wysłać wiadomości.')
        return
      }
      setResult({
        test: Boolean(data.test),
        total: data.total ?? 0,
        sent: data.sent ?? 0,
        failed: data.failed ?? 0,
      })
    } catch {
      setError('Błąd sieci — spróbuj ponownie.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col gap-6 px-4 py-10">
      <header className="flex flex-col gap-1">
        <h1 className="text-text-primary text-2xl font-bold">Panel mailingowy</h1>
        <p className="text-text-muted text-sm">
          Wysyłka kampanii marketingowych i powiadomień serwisowych.
        </p>
      </header>

      <ModeTabs mode={mode} onChange={setMode} />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={applyTermsTemplate}
          className="flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors"
          style={{
            borderColor: 'rgba(255,220,180,0.2)',
            backgroundColor: 'rgba(255,220,180,0.05)',
            color: 'rgba(255,220,180,0.8)',
          }}
        >
          <FileText size={14} />
          Wstaw szablon: zmiana regulaminu
        </button>
      </div>

      <p
        className="rounded-xl border px-4 py-3 text-[13px] leading-relaxed"
        style={{
          borderColor: 'rgba(255,220,180,0.18)',
          backgroundColor: 'rgba(255,220,180,0.04)',
          color: 'rgba(255,220,180,0.8)',
        }}
      >
        {mode === 'marketing' ? (
          <>
            <strong>Marketing</strong> — trafia tylko do użytkowników z zaznaczoną zgodą
            marketingową. Każda wiadomość zawiera link wypisania.
          </>
        ) : (
          <>
            <strong>Serwisowe</strong> (np. zmiana regulaminu) — trafia do{' '}
            <strong>wszystkich</strong> użytkowników niezależnie od zgody. Nie wolno umieszczać tu
            treści promocyjnych.
          </>
        )}
      </p>

      <Field label="Temat wiadomości">
        <Input value={subject} onChange={setSubject} placeholder="np. Aktualizacja regulaminu" />
      </Field>

      <Field label="Nagłówek w treści">
        <Input value={heading} onChange={setHeading} placeholder="np. Zmieniamy regulamin" />
      </Field>

      <Field label="Treść (oddziel akapity pustą linią)">
        <textarea
          value={bodyText}
          onChange={(e) => setBodyText(e.target.value)}
          rows={8}
          className="text-text-primary placeholder:text-text-muted w-full rounded-xl border-2 bg-transparent px-4 py-3 text-sm transition-all focus:outline-none"
          style={{ borderColor: 'rgba(255,220,180,0.18)', backgroundColor: 'rgba(255,220,180,0.04)' }}
          placeholder="Pierwszy akapit…&#10;&#10;Drugi akapit…"
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Etykieta przycisku (opcjonalnie)">
          <Input value={ctaLabel} onChange={setCtaLabel} placeholder="np. Zobacz regulamin" />
        </Field>
        <Field label="URL przycisku (opcjonalnie)">
          <Input value={ctaUrl} onChange={setCtaUrl} placeholder="https://lastrodeo.pl/regulamin" />
        </Field>
      </div>

      <Field label="Adres do wysyłki testowej">
        <Input value={testEmail} onChange={setTestEmail} placeholder="ty@przyklad.pl" />
      </Field>

      {error && (
        <p
          className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm"
          style={{ backgroundColor: 'rgba(248,113,113,0.12)', color: '#fca5a5' }}
        >
          <ShieldAlert size={16} /> {error}
        </p>
      )}

      {result && (
        <p
          className="rounded-xl px-4 py-3 text-sm"
          style={{ backgroundColor: 'rgba(110,231,183,0.12)', color: '#6ee7b7' }}
        >
          {result.test ? 'Wysłano test. ' : 'Wysłano kampanię. '}
          Odbiorcy: {result.total} • dostarczono: {result.sent} • błędy: {result.failed}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <Button type="outline" onClick={() => send(true)} disabled={busy}>
          {busy ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          Wyślij test
        </Button>
        <Button type="primary" onClick={() => send(false)} disabled={busy}>
          {busy ? <Loader2 size={18} className="animate-spin" /> : <Megaphone size={18} />}
          {mode === 'marketing' ? 'Wyślij kampanię' : 'Wyślij do wszystkich'}
        </Button>
      </div>
    </div>
  )
}

function ModeTabs({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  const tabs: { id: Mode; label: string }[] = [
    { id: 'marketing', label: 'Marketing' },
    { id: 'service', label: 'Serwisowe' },
  ]
  return (
    <div
      className="flex gap-1 rounded-xl p-1"
      style={{ backgroundColor: 'rgba(255,220,180,0.06)' }}
    >
      {tabs.map((tab) => {
        const active = mode === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className="flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all"
            style={{
              background: active ? 'linear-gradient(135deg,var(--neon-pink),#c800c8)' : 'transparent',
              color: active ? '#fff' : 'rgba(255,220,180,0.7)',
            }}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-text-muted text-[11px] font-semibold uppercase">{label}</label>
      {children}
    </div>
  )
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="text-text-primary placeholder:text-text-muted w-full rounded-xl border-2 bg-transparent px-4 py-3 text-sm font-semibold transition-all focus:outline-none"
      style={{ borderColor: 'rgba(255,220,180,0.18)', backgroundColor: 'rgba(255,220,180,0.04)' }}
    />
  )
}
