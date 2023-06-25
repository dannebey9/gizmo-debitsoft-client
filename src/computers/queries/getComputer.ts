import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import { apiGetComputer } from "../../gizmo-api/Computer/apiGetComputer"
import { apiGetProcessComputer } from "../../gizmo-api/Computer/apiGetProcessComputer"
import { apiGetUserActiveSessions } from "../../gizmo-api/UserSession/apiGetUserActiveSessions"
import { apiGetUser } from "../../gizmo-api/User/apiGetUser"

export default resolver.pipe(resolver.authorize(), async ({ id }, { session }) => {
  const computer = await apiGetComputer(id, session.userId)
  if (!computer) throw new NotFoundError()

  let process
  try {
    process = await apiGetProcessComputer(id, session.userId)
  } catch (error) {
    process = null
  }
  const sessions = await apiGetUserActiveSessions(session.userId)
  const currSession = sessions.result.find((session) => session.hostId === computer.id)

  if (!currSession) return { ...computer, processes: process, session: undefined }

  const user = await apiGetUser(currSession?.userId, session.userId)

  if (!computer) throw new NotFoundError()

  return {
    ...computer,
    processes: process,
    session: { ...currSession, user: user.result },
  }
})
