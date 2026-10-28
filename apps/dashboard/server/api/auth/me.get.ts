import { useStaffSession } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const session = await useStaffSession(event)
  return session.data.user ?? null
})
