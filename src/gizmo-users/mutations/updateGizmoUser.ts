import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateGizmoUserSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateGizmoUserSchema),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    // const gizmoUser = await db.gizmoUser.update({ where: { id }, data })
    // return gizmoUser
  }
)
