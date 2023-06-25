import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
import { apiGetUser } from "../../gizmo-api/User/apiGetUser"

const GetGizmoUser = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.zod(GetGizmoUser),
  resolver.authorize(),
  async ({ id }, { session }) => {
    const gizmoUser = await apiGetUser(id, session.userId)

    if (!gizmoUser) throw new NotFoundError()

    return gizmoUser
  }
)
