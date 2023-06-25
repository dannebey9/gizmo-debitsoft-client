import { z } from "zod"
import { gizmoApi } from "../GizmoApi"
import { ShiftsInput } from "../../queries/shifts"
import { getConfigApi, getUrlApi } from "../_credentials/credentials"

const ShiftDetailSchema = z.object({
  paymentMethodName: z.string(),
  startCash: z.number(),
  sales: z.number(),
  deposits: z.number(),
  withdrawals: z.number(),
  refunds: z.number(),
  payIns: z.number(),
  payOuts: z.number(),
  expected: z.number(),
  actual: z.number(),
  difference: z.number(),
})

export const ShiftSchema = z.object({
  shiftId: z.number(),
  isActive: z.boolean(),
  startCash: z.number(),
  registerId: z.number(),
  registerName: z.string(),
  operatorName: z.string(),
  endedByOperatorName: z.string().nullable(),
  startTime: z.string(),
  endTime: z.string().nullable(),
  durationMinutes: z.number(),
  duration: z.string(),
  expected: z.number(),
  actual: z.number(),
  difference: z.number(),
  sales: z.number(),
  deposits: z.number(),
  withdrawals: z.number(),
  refunds: z.number(),
  details: z.array(ShiftDetailSchema).nullable(),
})

const ApiResponseSchema = z.object({
  version: z.nullable(z.unknown()),
  result: z.object({
    operatorId: z.nullable(z.unknown()),
    operatorName: z.nullable(z.unknown()),
    registerId: z.nullable(z.unknown()),
    registerName: z.nullable(z.unknown()),
    shiftsLogReportType: z.number(),
    shifts: z.array(ShiftSchema),
    totalExpectedExcludingStartCashActive: z.number(),
    totalDuration: z.string(),
    totalExpectedExcludingStartCash: z.number(),
    totalDifference: z.number(),
    name: z.nullable(z.unknown()),
    dateFrom: z.string(),
    dateTo: z.string(),
    companyName: z.nullable(z.unknown()),
    reportType: z.number(),
  }),
  httpStatusCode: z.number(),
  message: z.nullable(z.unknown()),
  isError: z.boolean(),
})

const QuerySchema = z.object({
  OperatorId: z.number().int().optional(),
  RegisterId: z.number().int().optional(),
  shiftsLogReportType: z.number().refine((val) => val === 2, {
    message: "ShiftsLogReportType должен быть равен 2",
  }),
  DateFrom: z.string().refine(
    (value) => {
      const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d{3})?Z$/
      return regex.test(value)
    },
    {
      message: "Invalid DateFrom format",
    }
  ),
  DateTo: z.string().refine(
    (value) => {
      const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d{3})?Z$/
      return regex.test(value)
    },
    {
      message: "Invalid DateTo format",
    }
  ),
})

type QueryParams = z.infer<typeof QuerySchema>

const TAG = "[apiGetShifts.ts]"

export const apiGetShifts = async (queryParams: ShiftsInput, userId: number) => {
  try {
    const { headers, url } = await getConfigApi(userId)
    const response = gizmoApi.get(`${url}reports/shiftslog`, {
      headers,
      searchParams: queryParams,
    })

    // Ky автоматически парсит ответ в JSON, если это возможно
    const data = await response.json()

    console.log(TAG, data)

    // Проверьте ответ, используя схему zod
    const validationResult = ApiResponseSchema.safeParse(data)

    if (validationResult.success) {
      return validationResult.data // Вернуть валидированные данные
    } else {
      console.error(`${TAG} Validation error:`, validationResult.error)
      throw new Error(`${TAG} API data validation failed.`)
    }
  } catch (error) {
    console.error(`${TAG} API request error:`, error)
    throw error
  }
}
