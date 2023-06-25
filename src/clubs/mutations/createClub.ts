import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateClubSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateClubSchema),
  resolver.authorize(),
  async (input, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const club = await db.club.create({ data: { ...input, userId: ctx.session.userId } })

    return club
  }
)
