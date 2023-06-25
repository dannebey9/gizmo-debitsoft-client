import { z } from "zod"
import ky from "ky"
import { gizmoApi } from "../GizmoApi"
import { getUrlApi } from "../_credentials/credentials"

const HostEndpointSchema = z.object({
  maximumUsers: z.number().nullable(),
})

const HostComputerSchema = z.object({
  windowsName: z.string().nullable(),
  macAddress: z.string().nullable(),
})

export const ComputerSchema = z.object({
  id: z.number(),
  hostType: z.number(),
  hostGroupId: z.number().nullable(),
  number: z.number(),
  name: z.string(),
  isOutOfOrder: z.boolean(),
  isLocked: z.boolean(),
  iconId: z.number().nullable(),
  isDeleted: z.boolean(),
  hostComputer: HostComputerSchema.nullable(),
  hostEndpoint: HostEndpointSchema.nullable(),
})

const MetaSchema = z.object({
  nextCursor: z.number(),
  previousCursor: z.number(),
})

const ApiResponse = z.object({
  version: z.unknown().nullable(),
  result: z.object({
    data: z.array(ComputerSchema),
    meta: MetaSchema,
  }),
  httpStatusCode: z.number(),
  message: z.unknown().nullable(),
  isError: z.boolean(),
})

export const apiGetComputers = async (startingAfter, endingBefore, limit, userId: number) => {
  try {
    const urlApi = await getUrlApi(userId)
    const response = await gizmoApi.get(`${urlApi}v2.0/hosts`, {
      searchParams: {
        StartingAfter: startingAfter,
        EndingBefore: endingBefore,
        Limit: limit,
      },
    })

    // Ky автоматически парсит ответ в JSON, если это возможно
    const data = await response.json()

    // Проверьте ответ, используя схему zod
    const validationResult = ApiResponse.safeParse(data)

    if (validationResult.success) {
      return validationResult.data.result // Вернуть валидированные данные
    } else {
      console.error("Validation error:", validationResult.error)
      throw new Error("API data validation failed.")
    }
  } catch (error) {
    console.error("API request error:", error)
    throw error
  }
}
