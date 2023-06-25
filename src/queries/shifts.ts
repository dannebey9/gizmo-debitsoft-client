import { resolver } from "@blitzjs/rpc"
import { z } from "zod"
import { apiGetShifts, ShiftSchema } from "../gizmo-api/Shift/apiGetShifts"
import { gizmoApi } from "../gizmo-api/GizmoApi"

const Shifts = z.array(ShiftSchema)

export const ShiftsInputSchema = z
  .object({
    OperatorId: z.number().optional(),
    DateFrom: z.string().refine((value) => {
      const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d{3})?Z$/
      return regex.test(value)
    }, "Неправильный формат DateFrom"),
    DateTo: z.string().refine((value) => {
      const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d{3})?Z$/
      return regex.test(value)
    }, "Неправильный формат DateTo"),
  })
  .superRefine((obj) => {
    const { DateFrom, DateTo } = obj

    const fromDate = new Date(DateFrom)
    const toDate = new Date(DateTo)
    const oneMonth = 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
    const diff = toDate.getTime() - fromDate.getTime()

    if (diff > oneMonth) {
      throw new Error("Интервал между DateFrom и DateTo не должен превышать один месяц")
    }

    return obj
  })

export type ShiftsInput = z.infer<typeof ShiftsInputSchema>

export default resolver.pipe(
  resolver.zod(ShiftsInputSchema),
  resolver.authorize(),
  async (input: ShiftsInput, { session }) => {
    const shifts = await apiGetShifts(input, session.userId)
    // Дальнейшая обработка
    return shifts.result.shifts
  }
)
