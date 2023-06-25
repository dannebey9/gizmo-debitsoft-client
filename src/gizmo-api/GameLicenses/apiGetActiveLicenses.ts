import { z } from "zod"
import { gizmoApi } from "../GizmoApi"
import { getConfigApi, getUrlApi } from "../_credentials/credentials"

export const LicenseSchema = z.object({
  application: z.string(),
  executable: z.string(),
  licenseKeyId: z.number(),
  licenseKey: z.string(),
  hostId: z.number(),
  hostname: z.string(),
  userId: z.number(),
  username: z.string(),
  reservationId: z.number(),
})

const TAG = "[apiGetActiveLicense.ts]"

const ApiResponseSchema = z.object({
  version: z.nullable(z.unknown()),
  result: z.array(LicenseSchema),
  httpStatusCode: z.number(),
  message: z.nullable(z.unknown()),
  isError: z.boolean(),
})

export const apiGetActiveLicense = async (userId: number) => {
  try {
    const { headers, url } = await getConfigApi(userId)
    const response = await gizmoApi.get(`${url}licenses/keys/reserved/info`, { headers })

    // Ky автоматически парсит ответ в JSON, если это возможно
    const data = await response.json()

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
