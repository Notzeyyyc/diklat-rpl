import { useStaffSession } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const session = await useStaffSession(event)
  await session.clear()
  return { ok: true }
})
