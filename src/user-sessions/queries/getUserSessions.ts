import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

// interface GetUserSessionsInput
//   extends Pick<Prisma.UserSessionFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(resolver.authorize(), async () => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  // const {
  //   items: userSessions,
  //   hasMore,
  //   nextPage,
  //   count,
  // } = await paginate({
  //   skip,
  //   take,
  //   count: () => db.userSession.count({ where }),
  //   query: (paginateArgs) => db.userSession.findMany({ ...paginateArgs, where, orderBy }),
  // })
  // return {
  //   userSessions,
  //   nextPage,
  //   hasMore,
  //   count,
  // }
})
