'use client'

import { useRouter } from 'next/navigation'
import { osveziSesiju } from '@/components/useSesija'

export default function OdjaviDugme({ className }: { className?: string }) {
  const router = useRouter()
  return (
    <button
      type="button"
      className={className ?? 'btn btn-tertiary'}
      onClick={async () => {
        await fetch('/api/auth/odjava', { method: 'POST' })
        await osveziSesiju()
        router.push('/')
        router.refresh()
      }}
    >
      Odjava
    </button>
  )
}
