import { EventEmitter } from 'node:events'

declare const globalThis: Record<string, unknown> & { __diklatBus?: EventEmitter }

// EventBus in-memory untuk SSE. Publish setelah INSERT/UPDATE sukses.
export const bus: EventEmitter =
  globalThis.__diklatBus ??
  (globalThis.__diklatBus = new EventEmitter().setMaxListeners(0))

export type BusEvent = { type: 'progress' | 'scores'; teamId: string; positionId: number; score?: number; at: string }

export const publish = (event: Omit<BusEvent, 'at'>) =>
  bus.emit('event', { ...event, at: new Date().toISOString() })
