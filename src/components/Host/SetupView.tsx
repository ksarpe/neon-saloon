'use client'

import { ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { IdentityForm } from '@/components/IdentityForm'

interface Props {
  name: string
  onNameChange: (v: string) => void
  avatar: string | null
  onAvatarChange: (v: string) => void
  onContinue: () => void
}

export function SetupView({ name, onNameChange, avatar, onAvatarChange, onContinue }: Props) {
  const canContinue = Boolean(name.trim() && avatar)

  return (
    <div className="mx-auto flex w-full max-w-xs flex-col items-center gap-6">
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
