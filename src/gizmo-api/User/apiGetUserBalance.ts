import { z } from "zod"
import ky from "ky"
import { gizmoApi } from "../GizmoApi"
import { getConfigApi, getUrlApi } from "../_credentials/credentials"

export const UserBalanceSchema = z.object({
  userId: z.number(),
  deposits: z.number(),
  points: z.number(),
  onInvoices: z.number(),
  onInvoicedUsage: z.number(),
  onUninvoicedUsage: z.number(),
  timeProduct: z.number(),
  timeFixed: z.number(),
  availableTime: z.number(),
  availableCreditedTime: z.number(),
  balance: z.number(),
  timeProductBalance: z.number(),
  usageBalance: z.number(),
  totalOutstanding: z.number(),
})

const ApiResponseSchema = z.object({
  version: z.nullable(z.unknown()),
  result: UserBalanceSchema,
  httpStatusCode: z.number(),
  message: z.nullable(z.unknown()),
  isError: z.boolean(),
})

const TAG = "[apiGetUserBalance.ts]"

export const apiGetUserBalance = async (userIdGizmo, userIdDebit) => {
  try {
    const { headers, url } = await getConfigApi(userIdDebit)
    const response = await gizmoApi.get(`${url}users/${userIdGizmo}/balance`, { headers })

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
