import { createHash, randomBytes } from 'node:crypto'
import { db } from './db'
export const TEAM_COOKIE = 'diklat-team-token'
const hashToken = (token: string) => createHash('sha256').update(token).digest('hex')
export const issueTeamToken = async (event: any, teamId: string) => {
  const token = randomBytes(32).toString('base64url')
  await db`update teams set access_token_hash = ${hashToken(token)} where id = ${teamId}`
  setCookie(event, TEAM_COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 30, path: '/' })
}
export const requireTeam = async (event: any) => {
  const token = getCookie(event, TEAM_COOKIE)
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Sesi regu diperlukan' })
  const [team] = await db`select id, name from teams where access_token_hash = ${hashToken(token)}`
  if (!team) throw createError({ statusCode: 401, statusMessage: 'Sesi regu tidak valid' })
  return team
}
