// Client-only: restore sesi regu sekali saat app load (fix hydration mismatch —
// state server selalu default, client isi setelah mount).
export default defineNuxtPlugin(async () => {
  const { loadFromApi } = useGameState()
  await loadFromApi()
})
