import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateGizmoUserSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateGizmoUserSchema),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const gizmoUser = await db.gizmoUser.create({ data: input })

    return gizmoUser
  }
)
