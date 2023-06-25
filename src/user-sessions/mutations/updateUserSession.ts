import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateUserSessionSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateUserSessionSchema),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const userSession = await db.userSession.update({ where: { id }, data })

    return userSession
  }
)
