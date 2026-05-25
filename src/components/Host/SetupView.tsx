'use client'

import { ArrowLeft } from 'lucide-react'

import { IdentityForm } from '@/components/IdentityForm'
import { Button } from '@/components/ui/button'

interface Props {
  name: string
  onNameChange: (v: string) => void
  avatar: string | null
  onAvatarChange: (v: string) => void
  onContinue: () => void
  onBack?: () => void
}

export function SetupView({
  name,
  onNameChange,
  avatar,
  onAvatarChange,
  onContinue,
  onBack,
}: Props) {
  const canContinue = Boolean(name.trim() && avatar)

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6">
      {onBack && (
        <Button type="outline" onClick={onBack} className="self-start px-4 py-2 text-sm">
          <ArrowLeft size={14} /> Wróć
        </Button>
      )}

      <IdentityForm
        name={name}
        onNameChange={onNameChange}
        avatar={avatar}
        onAvatarChange={onAvatarChange}
        onEnter={() => canContinue && onContinue()}
      />

      <Button type="primary" disabled={!canContinue} onClick={onContinue} className="w-full">
        Dalej
      </Button>
    </div>
  )
}
