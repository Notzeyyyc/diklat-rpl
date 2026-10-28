// ponytail: rate limit in-memory 10 req/menit/IP — cukup utk single-instance Nitro.
const WINDOW_MS = 60_000
const MAX = 10

const hits = new Map<string, number[]>()

// bersihkan entri kadaluarsa biar Map gak bengkak
setInterval(() => {
  const cutoff = Date.now() - WINDOW_MS
  for (const [ip, times] of hits) {
    const alive = times.filter((t) => t > cutoff)
    if (alive.length === 0) hits.delete(ip)
    else hits.set(ip, alive)
  }
}, WINDOW_MS).unref?.()

export const rateLimit = (ip: string): boolean => {
  const now = Date.now()
  const cutoff = now - WINDOW_MS
  const times = (hits.get(ip) ?? []).filter((t) => t > cutoff)
  if (times.length >= MAX) return false
  times.push(now)
  hits.set(ip, times)
  return true
}

export const clientIp = (event: { node: { req: { socket: { remoteAddress?: string } } } }) =>
  event.node.req.socket.remoteAddress ?? 'unknown'
