import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import { z } from "zod"
import { apiGetFinance } from "../../gizmo-api/finance/apiGetFinance"
import dayjs from "dayjs"
import { apiGetShifts } from "../../gizmo-api/Shift/apiGetShifts"

const GetCash = z.object({
  // This accepts type of undefined, but is required at runtime
  // id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.zod(GetCash),
  resolver.authorize(),
  async ({}, { session }) => {
    const currentDate = dayjs().format("YYYY-MM-DDTHH:mm:ss")
    const shifts = await apiGetShifts(
      { DateFrom: currentDate, DateTo: currentDate },
      session.userId
    )
    const currentShift = shifts?.result?.shifts.find((shift) => shift.endTime === null)
    if (!currentShift) {
      throw new NotFoundError("Shift not found")
    }
    const finance = await apiGetFinance(
      { dateFrom: currentShift.startTime, dateTo: currentDate },
      session.userId
    )

    return { ...finance, currentShift }
  }
)
