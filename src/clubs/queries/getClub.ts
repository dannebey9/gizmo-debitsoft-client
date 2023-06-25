import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetClub = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Поле id обязательно для заполнения"),
})

export default resolver.pipe(resolver.zod(GetClub), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const club = await db.club.findFirst({ where: { id } })

  if (!club) throw new NotFoundError()

  return club
})
