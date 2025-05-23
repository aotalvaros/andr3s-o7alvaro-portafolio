import { useLoadingStore } from '@/store/loadingStore'

export const loadingController = {
  start: () => useLoadingStore.getState().setLoading(true),
  stop: () => useLoadingStore.getState().setLoading(false)
}