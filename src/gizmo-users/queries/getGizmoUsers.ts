import { resolver } from "@blitzjs/rpc"
import { apiGetUsers } from "../../gizmo-api/User/apiGetUsers"

interface GetGizmoUsersInput {
  startingAfter?: number
  endingBefore?: number
  limit?: number
  username: string
}

export default resolver.pipe(
  resolver.authorize(),
  async ({ startingAfter, limit, username, endingBefore }: GetGizmoUsersInput, { session }) => {
    const users = await apiGetUsers(startingAfter, endingBefore, limit, username, session.userId)

    return {
      users: users.result.data,
      nextCursor: users.result.meta.nextCursor,
      previousCursor: users.result.meta.previousCursor,
    }
  }
)
