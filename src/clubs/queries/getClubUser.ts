import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import z from "zod"

const ResponseSchema = z
  .object({
    id: z.number(),
    url: z.string(),
    username: z.string(),
    password: z.string(),
  })
  .nullable()

// Тип из zod

export type IClubUser = z.infer<typeof ResponseSchema>

export default resolver.pipe(resolver.authorize(), async (_i, c) => {
  const club = await db.club.findFirst({
    where: { userId: c.session.userId },
    select: { id: true, url: true, username: true, password: true },
  })

  if (!club) return null

  return club
})
