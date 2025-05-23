'use client'

import { useLoadingStore } from '@/store/loadingStore'
import BlackHoleSpinner from '@/components/ui/BlackHoleSpinner'

export function LoaderOverlay() {
  const isLoading = useLoadingStore((s) => s.isLoading)
  return isLoading ? <BlackHoleSpinner /> : null
}
