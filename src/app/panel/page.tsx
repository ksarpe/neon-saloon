import { Loader2 } from 'lucide-react'
import { Suspense } from 'react'

import { PanelContent } from '@/components/Panel/PanelContent'

export default function PanelPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh w-full items-center justify-center">
          <Loader2 size={26} className="animate-spin" style={{ color: 'var(--neon-pink)' }} />
        </div>
      }
    >
      <PanelContent />
    </Suspense>
  )
}
