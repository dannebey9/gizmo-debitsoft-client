import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetClubsInput
  extends Pick<Prisma.ClubFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetClubsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: clubs,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.club.count({ where }),
      query: (paginateArgs) => db.club.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      clubs,
      nextPage,
      hasMore,
      count,
    }
  }
)
