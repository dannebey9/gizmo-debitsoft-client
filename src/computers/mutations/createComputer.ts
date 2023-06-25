import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateComputerSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateComputerSchema),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    // const computer = await db.computer.create({ data: input })
    // return computer
  }
)
