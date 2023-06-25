import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteGizmoUserSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteGizmoUserSchema),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const gizmoUser = await db.gizmoUser.deleteMany({ where: { id } })

    return gizmoUser
  }
)
