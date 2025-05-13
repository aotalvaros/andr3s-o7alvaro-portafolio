'use client'

import { useLoadingStore } from '@/store/loadingStore'
import Spinner from '@/components/ui/spinner'

export function LoaderOverlay() {
  const isLoading = useLoadingStore((s) => s.isLoading)
  return isLoading ? <Spinner /> : null
}
