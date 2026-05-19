'use client'

import { ArrowLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { IdentityForm } from '@/components/IdentityForm'

interface Props {
  value: string
  onChange: (v: string) => void
  avatar: string | null
  onAvatarChange: (v: string) => void
  onSubmit: () => void
  onBack: () => void
}

export function NameInput({ value, onChange, avatar, onAvatarChange, onSubmit, onBack }: Props) {
  const canSubmit = Boolean(value.trim() && avatar)

  return (
    <div className="flex flex-col items-center gap-6">
      <IdentityForm
        name={value}
        onNameChange={onChange}
        avatar={avatar}
        onAvatarChange={onAvatarChange}
        onEnter={() => canSubmit && onSubmit()}
      />

      <div className="flex w-full max-w-xs gap-3">
        <Button type="outline" onClick={onBack} className="flex-1">
          <ArrowLeft size={14} /> Wróć
        </Button>
        <Button
          id="name-continue-btn"
          type="primary"
          disabled={!canSubmit}
          onClick={onSubmit}
          className="flex-1"
        >
          Dalej
        </Button>
      </div>
    </div>
  )
}
