// ponytail: hanya 1 file state — sumber kebenaran = API/DB; localStorage cuma simpan team_id.
import type { Team } from '@diklat/shared'

interface GameState {
  teamId: string | null
  teamName: string
  completedPos: number[]
  totalPos: number
}

const STORAGE_KEY = 'diklat-team-id'

export const useGameState = () => {
  // useState = SSR-safe, hydration aman: server render default, client diisi plugin
  const state = useState<GameState>('game-state', () => ({
    teamId: null,
    teamName: '',
    completedPos: [],
    totalPos: 5,
  }))

  const isPosCompleted = (pos: number) => state.value.completedPos.includes(pos)

  // Sequential: pos 1 selalu buka; pos n buka kalau n-1 selesai.
  const isPosAvailable = (pos: number) =>
    pos === 1 || state.value.completedPos.includes(pos - 1)

  const isValidPos = (pos: number) =>
    Number.isInteger(pos) && pos >= 1 && pos <= state.value.totalPos

  const progress = computed(() => state.value.completedPos.length)

  /** Registrasi regu → POST /api/teams. 409 = nama sudah ada → ambil id-nya dari daftar. */
  const registerGroup = async (name: string) => {
    const clean = name.trim().toUpperCase()
    try {
      const res = await $fetch<{ id: string; name: string }>('/api/teams', {
        method: 'POST',
        body: { name: clean },
      })
      state.value.teamId = res.id
      state.value.teamName = res.name
    } catch (err: unknown) {
      const status = (err as { statusCode?: number }).statusCode
      if (status !== 409) throw err
      const teams = await $fetch<Team[]>('/api/teams')
      const existing = teams.find((t) => t.name === clean)
      if (!existing) throw err
      state.value.teamId = existing.id
      state.value.teamName = existing.name
      state.value.completedPos = existing.completedPositions
    }
    if (import.meta.client && state.value.teamId) {
      localStorage.setItem(STORAGE_KEY, state.value.teamId)
    }
    return state.value.teamId
  }

  /** Dipanggil plugin client sekali: restore sesi dari localStorage + GET /api/teams. */
  const loadFromApi = async () => {
    if (import.meta.server) return
    const teamId = localStorage.getItem(STORAGE_KEY)
    if (!teamId) return
    try {
      const teams = await $fetch<Team[]>('/api/teams')
      const team = teams.find((t) => t.id === teamId)
      if (!team) {
        localStorage.removeItem(STORAGE_KEY)
        return
      }
      state.value.teamId = team.id
      state.value.teamName = team.name
      state.value.completedPos = team.completedPositions
    } catch { // API down → pakai state default, refresh lewat realtime fallback
    }
  }

  /** Sinkron lokal setelah verify sukses (sumber kebenaran tetap DB). */
  const completePos = (pos: number) => {
    if (!state.value.completedPos.includes(pos)) state.value.completedPos.push(pos)
  }

  return {
    state,
    registerGroup,
    loadFromApi,
    completePos,
    isPosCompleted,
    isPosAvailable,
    isValidPos,
    progress,
  }
}
