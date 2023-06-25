import { z } from "zod"
import ky from "ky"
import { gizmoApi } from "../GizmoApi"
import { getUrlApi } from "../_credentials/credentials"

export const UserSessionSchema = z.object({
  userId: z.number(),
  hostId: z.number(),
  state: z.number(),
  span: z.number(),
  billedSpan: z.number(),
  pendTime: z.nullable(z.unknown()),
  pendSpan: z.number(),
  endTime: z.nullable(z.unknown()),
  slot: z.number(),
  pendSpanTotal: z.number(),
  pauseSpan: z.number(),
  pauseSpanTotal: z.number(),
  createdById: z.number(),
  createdTime: z.string(),
  id: z.number(),
})

const ApiResponse = z.object({
  version: z.nullable(z.unknown()),
  result: z.array(UserSessionSchema),
  httpStatusCode: z.number(),
  message: z.nullable(z.unknown()),
  isError: z.boolean(),
})

const TAG = "[apiGetUserActiveSessions.ts]"

export const apiGetUserActiveSessions = async (userId) => {
  try {
    const urlApi = await getUrlApi(userId)
    const response = await gizmoApi.get(`${urlApi}usersessions/active`)

    // Ky автоматически парсит ответ в JSON, если это возможно
    const data = await response.json()

    console.log(TAG, data)

    // Проверьте ответ, используя схему zod
    const validationResult = ApiResponse.safeParse(data)

    if (validationResult.success) {
      return validationResult.data // Вернуть валидированные данные
    } else {
      console.error(`${TAG}Validation error:`, validationResult.error)
      throw new Error("API data validation failed.")
    }
  } catch (error) {
    console.error("API request error:", error)
    throw error
  }
}
