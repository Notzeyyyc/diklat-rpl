import type { RealtimeEvent } from '@diklat/shared'
import { bus } from '../utils/bus'

// SSE stream: event `progress` & `scores`, heartbeat ping tiap 25s.
export default defineEventHandler((event) => {
  setResponseHeaders(event, {
    'content-type': 'text/event-stream',
    'cache-control': 'no-cache',
    connection: 'keep-alive',
    'x-accel-buffering': 'no',
  })
  event.node.req.socket.setTimeout(0)

  const send = (data: RealtimeEvent) =>
    event.node.res.write(`data: ${JSON.stringify(data)}\n\n`)

  const onEvent = (e: RealtimeEvent) => send(e)
  bus.on('event', onEvent)

  const heartbeat = setInterval(() => send({ type: 'ping' }), 25_000)
  send({ type: 'ping' }) // flush headers + keep test/client dari nunggu 25s pertama

  event.node.req.on('close', () => {
    clearInterval(heartbeat)
    bus.off('event', onEvent)
  })
})
