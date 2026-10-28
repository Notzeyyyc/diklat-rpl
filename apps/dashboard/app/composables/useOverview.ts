import type { OverviewResponse, RealtimeEvent } from '@diklat/shared'

/**
 * Data overview admin: fetch awal /api/admin/overview + live update via SSE.
 * Setiap event progress/scores → re-fetch (state kebenaran tetap DB).
 */
export const useOverview = () => {
  const { data: overview, refresh } = useFetch<OverviewResponse>('/api/admin/overview', {
    default: () => ({
      teams: [],
      stats: { totalTeams: 0, activeTeams: 0, completedTeams: 0, avgScore: 0, scoresCount: 0 },
    }),
  })

  const liveEvents = ref<RealtimeEvent[]>([])
  const handleEvent = (e: RealtimeEvent) => {
    liveEvents.value = [e, ...liveEvents.value].slice(0, 30)
    refresh()
  }
  useRealtime(handleEvent, refresh)

  return { overview, liveEvents, refresh }
}
