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

/** POST /api/auth/login */
export interface LoginRequest { username: string; password: string }
export interface SessionUser { username: string; role: 'admin' | 'ketua' }

/** GET /api/admin/overview */
export interface TeamOverview {
  teamId: string
  name: string
  completedPositions: number[]
  /** positionId → skor terakhir */
  scores: Record<number, { score: number; notes?: string; judge?: string; at: string }>
  total: number
}
export interface OverviewResponse {
  teams: TeamOverview[]
  stats: { totalTeams: number; activeTeams: number; completedTeams: number; avgScore: number; scoresCount: number }
}

/** POST /api/scores */
export interface SubmitScoreRequest { teamId: string; positionId: number; score: number; notes?: string }

/** GET /api/events (SSE) — tiap `data:` = RealtimeEvent */
export type SseEvent = RealtimeEvent

export type { Team, Score, RealtimeEvent }
