import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteClubSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteClubSchema),
  resolver.authorize(),
  async ({ id }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const club = await db.club.deleteMany({ where: { userId: ctx.session.userId } })

    return club
  }
)
