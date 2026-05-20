import type { CSSProperties, MouseEvent } from 'react'

export interface Question {
  id: string
  text: string
  createdAt: string
}

export interface QuizQuestion extends Question {
  answer: string
  options: string[]
}

export const QUESTION_PAGE_SIZE = 10

export type PanelTab = 'quiz' | 'never' | 'account' | 'settings'
export type CheckoutState = 'success' | 'cancelled' | null
export type PaymentStatusKind = 'checking' | 'active' | 'pending' | 'failed' | 'cancelled'
export type PlanId = 'monthly' | 'lifetime'

export interface PaymentStatus {
  kind: PaymentStatusKind
  subscriptionStatus?: string | null
  currentPeriodEnd?: string | null
}

export interface AccountPayload {
  id: string
  email: string
  name: string | null
  createdAt: string
  updatedAt: string
  premium: {
    isPremium: boolean
    status: 'active' | 'pending' | 'failed' | 'free'
    plan: 'monthly' | 'lifetime' | 'free'
    subscriptionStatus: string | null
    currentPeriodEnd: string | null
    canManageBilling: boolean
  }
}

export function formatAccountDate(value: string) {
  return new Intl.DateTimeFormat('pl-PL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

export function panelButtonHover(base: CSSProperties, hover: CSSProperties) {
  return {
    style: base,
    onMouseEnter: (event: MouseEvent<HTMLButtonElement>) => {
      if (!event.currentTarget.disabled) Object.assign(event.currentTarget.style, hover)
    },
    onMouseLeave: (event: MouseEvent<HTMLButtonElement>) => {
      Object.assign(event.currentTarget.style, base)
    },
  }
}
