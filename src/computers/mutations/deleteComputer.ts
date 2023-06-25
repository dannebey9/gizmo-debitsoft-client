import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteComputerSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteComputerSchema),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const computer = await db.computer.deleteMany({ where: { id } })

    return computer
  }
)
