// JEDNO źródło prawdy dla cen wyświetlanych w aplikacji.
//
// ⚠️ Te kwoty MUSZĄ odpowiadać cenom skonfigurowanym w Stripe (STRIPE_MONTHLY_PRICE_ID,
//    STRIPE_LIFETIME_PRICE_ID). Realna kwota pobierana od użytkownika pochodzi ze Stripe,
//    a wg §7 regulaminu wyświetlona cena jest wiążąca — przy zmianie ceny w Stripe
//    zaktualizuj też te wartości, inaczej UI po cichu pokaże złą kwotę.

import type { StripePlanId } from '@/lib/stripe'

export interface PlanPricing {
  /** Kwota brutto z walutą, np. „19,99 zł". */
  amount: string
  /** Okres / sposób rozliczenia, np. „/ mies." albo „jednorazowo". */
  period: string
  /** Pełny opis rozliczenia pod ceną. */
  billingLabel: string
}

export const PRICING: Record<StripePlanId, PlanPricing> = {
  monthly: {
    amount: '19,99 zł',
    period: '/ mies.',
    billingLabel: 'za miesięczną subskrypcję',
  },
  lifetime: {
    amount: '69 zł',
    period: 'jednorazowo',
    billingLabel: 'jednorazowo za lifetime dostęp',
  },
}

/** Informacja o charakterze ceny pokazywana przed zakupem (transparentność dla konsumenta). */
export const PRICE_VAT_NOTE =
  'Cena końcowa do zapłaty, w PLN. Sprzedawca korzysta ze zwolnienia z VAT (do ceny nie jest ' +
  'doliczany podatek VAT). Bez ukrytych ani cyklicznych opłat poza wybranym planem.'
