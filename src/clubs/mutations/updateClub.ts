import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateClubSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateClubSchema),
  resolver.authorize(),
  async ({ id, ...data }, ctx) => {
    const club = await db.club.update({ where: { userId: ctx.session.userId }, data })

    return club
  }
)
