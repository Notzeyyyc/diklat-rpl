interface GameState {
  groupName: string
  teamName: string
  currentPos: number | null
  completedPos: number[]
  totalPos: number
}

const STORAGE_KEY = 'diklat-game-state'

export const useGameState = () => {
  // useState = SSR-safe, ga bocor antar request (beda dgn reactive di module scope)
  const state = useState<GameState>('game-state', () => ({
    groupName: '',
    teamName: '',
    currentPos: null,
    completedPos: [],
    totalPos: 5,
  }))

  // Persist ke sessionStorage biar reload ga reset. Client-only.
  if (import.meta.client) {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        Object.assign(state.value, JSON.parse(saved))
      } catch {
        // korup → abaikan, pakai default
      }
    }
    watch(state, (val) => {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(val))
    }, { deep: true })
  }

  const registerGroup = (name: string) => {
    state.value.groupName = name
    state.value.teamName = name.toUpperCase()
  }

  const selectPos = (pos: number) => {
    state.value.currentPos = pos
  }

  const completePos = (pos: number) => {
    if (!state.value.completedPos.includes(pos)) {
      state.value.completedPos.push(pos)
    }
  }

  const isPosCompleted = (pos: number) => state.value.completedPos.includes(pos)

  // Sequential: pos 1 selalu buka; pos n buka kalau n-1 selesai.
  const isPosAvailable = (pos: number) =>
    pos === 1 || state.value.completedPos.includes(pos - 1)

  // Route guard: id valid = integer 1..totalPos
  const isValidPos = (pos: number) =>
    Number.isInteger(pos) && pos >= 1 && pos <= state.value.totalPos

  const progress = computed(() => state.value.completedPos.length)

  return {
    state,
    registerGroup,
    selectPos,
    completePos,
    isPosCompleted,
    isPosAvailable,
    isValidPos,
    progress,
  }
}
