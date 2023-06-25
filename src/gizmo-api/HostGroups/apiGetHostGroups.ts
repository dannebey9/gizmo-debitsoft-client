import { z } from "zod"
import { gizmoApi } from "../GizmoApi"
import { getConfigApi, getUrlApi } from "../_credentials/credentials"

export const HostGroupSchema = z.object({
  id: z.number(),
  name: z.string(),
  skinName: z.string().nullable(),
  applicationGroupId: z.number().nullable(),
  securityProfileId: z.number().nullable(),
  defaultGuestGroupId: z.number().nullable(),
})

const ApiResponseSchema = z.object({
  version: z.nullable(z.unknown()),
  result: z.object({
    data: z.array(HostGroupSchema),
    meta: z.object({
      nextCursor: z.number(),
      previousCursor: z.number(),
    }),
  }),
  httpStatusCode: z.number(),
  message: z.nullable(z.string()),
  isError: z.boolean(),
})

const TAG = "[apiGetHostGroups.ts]"

export type HostGroup = z.infer<typeof HostGroupSchema>
export type HostGroupsResponse = z.infer<typeof ApiResponseSchema>

export const apiGetHostGroups = async (userId: number) => {
  try {
    const { headers, url } = await getConfigApi(userId)
    const response = await gizmoApi.get(`${url}v2.0/hostgroups`, { headers })

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
