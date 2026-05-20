'use client'

import { BookOpen, Brain, LogOut, Settings, SlidersHorizontal } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { useState } from 'react'

import { AccountTab, PaymentStatusBanner } from './AccountTab'
import { GameSettingsTab } from './GameSettingsTab'
import { NeverTab, QuizTab } from './QuestionTabs'
import { type CheckoutState, panelButtonHover, type PanelTab } from './shared'

export function PanelContent() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<PanelTab>('quiz')
  const [visitedTabs, setVisitedTabs] = useState<PanelTab[]>(['quiz'])
  const checkoutState = ['success', 'cancelled'].includes(searchParams.get('checkout') ?? '')
    ? (searchParams.get('checkout') as CheckoutState)
    : null
  const openTab = (tab: PanelTab) => {
    setActiveTab(tab)
    setVisitedTabs((prev) => (prev.includes(tab) ? prev : [...prev, tab]))
  }

  const tabs: Array<{
    id: PanelTab
    label: string
    description: string
    icon: typeof Brain
    color: string
  }> = [
    {
      id: 'quiz',
      label: 'Quiz o Pannie Młodej',
      description: 'własne pytania z odpowiedziami',
      icon: Brain,
      color: 'var(--neon-pink)',
    },
    {
      id: 'never',
      label: 'Nigdy przenigdy',
      description: 'własne wyznania dokładane do talii',
      icon: BookOpen,
      color: 'var(--sheriff-pink)',
    },
    {
      id: 'account',
      label: 'Konto i PRO',
      description: 'subskrypcja, dane i hasło',
      icon: Settings,
      color: '#a78bfa',
    },
    {
      id: 'settings',
      label: 'Ustawienia gier',
      description: 'czasy, timery i globalne wartości',
      icon: SlidersHorizontal,
      color: '#34d399',
    },
  ]

  return (
    <div className="flex min-h-dvh w-full flex-col">
      <div
        className="relative z-10 shrink-0 border-b"
        style={{ borderColor: 'rgba(255,220,180,0.1)' }}
      >
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <h1
            className="shimmer-text text-xl tracking-normal"
            style={{ fontFamily: 'var(--font-app)' }}
          >
            Panel szeryfa
          </h1>
          <div className="flex items-center gap-3">
            {session?.user?.name && (
              <span className="text-text-muted hidden text-xs sm:block">{session.user.name}</span>
            )}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors"
              {...panelButtonHover(
                {
                  borderColor: 'rgba(255,220,180,0.15)',
                  color: 'rgba(255,220,180,0.55)',
                  backgroundColor: 'transparent',
                },
                {
                  borderColor: 'rgba(239,68,68,0.35)',
                  color: '#fca5a5',
                  backgroundColor: 'rgba(239,68,68,0.08)',
                }
              )}
            >
              <LogOut size={12} />
              Wyloguj
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-8">
        <PaymentStatusBanner checkoutState={checkoutState} />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tabs.map((tab) => {
            const active = activeTab === tab.id
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => openTab(tab.id)}
                className="flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-colors"
                {...panelButtonHover(
                  {
                    backgroundColor: active ? 'rgba(255,16,240,0.1)' : 'rgba(13,8,24,0.35)',
                    borderColor: active ? tab.color : 'rgba(255,220,180,0.12)',
                  },
                  {
                    backgroundColor: active ? 'rgba(255,16,240,0.14)' : 'rgba(255,220,180,0.07)',
                    borderColor: active ? tab.color : 'rgba(255,220,180,0.24)',
                  }
                )}
              >
                <Icon size={17} style={{ color: tab.color }} />
                <span className="min-w-0">
                  <span className="text-text-primary block text-xs font-bold tracking-normal uppercase">
                    {tab.label}
                  </span>
                  <span className="text-text-muted block text-xs">{tab.description}</span>
                </span>
              </button>
            )
          })}
        </div>

        {visitedTabs.includes('quiz') && (
          <div className={activeTab === 'quiz' ? 'block' : 'hidden'}>
            <QuizTab />
          </div>
        )}
        {visitedTabs.includes('never') && (
          <div className={activeTab === 'never' ? 'block' : 'hidden'}>
            <NeverTab />
          </div>
        )}
        {visitedTabs.includes('account') && (
          <div className={activeTab === 'account' ? 'block' : 'hidden'}>
            <AccountTab />
          </div>
        )}
        {visitedTabs.includes('settings') && (
          <div className={activeTab === 'settings' ? 'block' : 'hidden'}>
            <GameSettingsTab />
          </div>
        )}
      </div>
    </div>
  )
}
