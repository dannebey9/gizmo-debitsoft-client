import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteUserSessionSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteUserSessionSchema),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    // const userSession = await db.userSession.deleteMany({ where: { id } })
    //
    // return userSession
  }
)
