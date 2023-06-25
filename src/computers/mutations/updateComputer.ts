import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateComputerSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateComputerSchema),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const computer = await db.computer.update({ where: { id }, data })

    return computer
  }
)
