'use client'

interface PurchaseConsentProps {
  checked: boolean
  onChange: (checked: boolean) => void
  id?: string
}

/**
 * Wymagana prawnie zgoda konsumenta przed rozpoczęciem świadczenia treści cyfrowych.
 * Bez jej odznaczenia nie wolno uruchamiać checkoutu — patrz §8 Regulaminu
 * (art. 38 ustawy o prawach konsumenta — utrata prawa odstąpienia).
 */
export function PurchaseConsent({ checked, onChange, id = 'purchase-consent' }: PurchaseConsentProps) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 text-left text-xs leading-relaxed transition-colors"
      style={{
        borderColor: checked ? 'rgba(255,16,240,0.4)' : 'var(--saloon-border)',
        background: checked ? 'rgba(255,16,240,0.06)' : 'rgba(13,8,24,0.35)',
        color: 'rgba(240,223,192,0.78)',
      }}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--neon-pink)]"
      />
      <span>
        Wyrażam zgodę na rozpoczęcie świadczenia (dostępu PRO) natychmiast po zakupie, przed upływem
        14-dniowego terminu odstąpienia, i przyjmuję do wiadomości, że w związku z tym{' '}
        <strong>tracę prawo odstąpienia</strong> od umowy po jej pełnym wykonaniu. Akceptuję{' '}
        <a
          href="/regulamin"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
          style={{ color: 'var(--neon-pink)' }}
          onClick={(event) => event.stopPropagation()}
        >
          Regulamin
        </a>{' '}
        i{' '}
        <a
          href="/polityka-prywatnosci"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
          style={{ color: 'var(--neon-pink)' }}
          onClick={(event) => event.stopPropagation()}
        >
          Politykę prywatności
        </a>
        .
      </span>
    </label>
  )
}
