import type { RealtimeEvent } from '@diklat/shared'

/**
 * Subscribe SSE /api/events (client-only). Auto-reconnect bawaan EventSource.
 * Fallback: setelah 3x error, tutup ES dan polling 5 detik via onPoll.
 * Cleanup otomatis saat scope (komponen) dispose.
 */
export const useRealtime = (onEvent: (e: RealtimeEvent) => void, onPoll?: () => void) => {
  if (import.meta.server) return

  let es: EventSource | null = null
  let pollTimer: ReturnType<typeof setInterval> | null = null
  let errors = 0

  const startPolling = () => {
    if (pollTimer || !onPoll) return
    pollTimer = setInterval(onPoll, 5_000)
    onPoll()
  }

  es = new EventSource('/api/events')
  es.onmessage = (msg) => {
    try {
      const e = JSON.parse(msg.data) as RealtimeEvent
      if (e.type !== 'ping') onEvent(e)
    } catch { /* korup → skip */ }
  }
  es.onerror = () => {
    errors += 1
    if (errors >= 3) {
      es?.close()
      es = null
      startPolling()
    }
  }

  onUnmounted(() => {
    es?.close()
    if (pollTimer) clearInterval(pollTimer)
  })
}
