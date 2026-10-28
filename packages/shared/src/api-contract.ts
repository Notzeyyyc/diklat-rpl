import type { Team, Score, RealtimeEvent } from './types'

/** POST /api/teams */
export interface RegisterTeamRequest {
  name: string
}
export interface RegisterTeamResponse {
  id: string
  name: string
}

/** GET /api/teams */
export type TeamsListResponse = Team[]

/** POST /api/pos/:id/verify */
export interface VerifyPosRequest {
  teamId: string
  password: string
}
export interface VerifyPosResponse {
  ok: true
  positionId: number
}

export type ApiError = { error: string }

/** GET /api/events (SSE) — tiap `data:` = RealtimeEvent */
export type SseEvent = RealtimeEvent

export type { Team, Score, RealtimeEvent }
