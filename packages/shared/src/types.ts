export interface Team {
  id: string
  name: string
  createdAt: string
  completedPositions: number[]
}

export interface Score {
  id: string
  teamId: string
  positionId: number
  score: number
  notes?: string
  judgeId?: string
  createdAt: string
}

export type ProgressEvent = {
  type: 'progress'
  teamId: string
  positionId: number
  at: string
}

export type ScoreEvent = {
  type: 'scores'
  teamId: string
  positionId: number
  score: number
  at: string
}

export type PingEvent = { type: 'ping' }

export type RealtimeEvent = ProgressEvent | ScoreEvent | PingEvent
