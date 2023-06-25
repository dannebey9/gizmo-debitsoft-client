import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateUserSessionSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateUserSessionSchema),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const userSession = await db.userSession.create({ data: input })

    return userSession
  }
)
