import { z } from "zod"
import ky from "ky"
import { encodedCredentials, getUrlApi } from "../_credentials/credentials"
import { gizmoApi } from "../GizmoApi"

const OperatorSchema = z.object({
  id: z.number(),
  guid: z.string(),
  username: z.string(),
  email: z.nullable(z.string()),
  firstName: z.nullable(z.string()),
  lastName: z.nullable(z.string()),
  birthDate: z.nullable(z.unknown()),
  address: z.nullable(z.unknown()),
  city: z.nullable(z.unknown()),
  country: z.nullable(z.string()),
  postCode: z.nullable(z.unknown()),
  phone: z.nullable(z.unknown()),
  mobilePhone: z.nullable(z.unknown()),
  sex: z.number(),
  isDeleted: z.boolean(),
  isDisabled: z.boolean(),
  smartCardUid: z.nullable(z.unknown()),
  identification: z.nullable(z.unknown()),
})

const ApiResponseSchema = z.object({
  version: z.nullable(z.unknown()),
  result: z.object({
    data: z.array(OperatorSchema),
    meta: z.object({
      nextCursor: z.number(),
      previousCursor: z.number(),
    }),
  }),
  httpStatusCode: z.number(),
  message: z.nullable(z.unknown()),
  isError: z.boolean(),
})

export const apiGetOperators = async (
  startingAfter,
  endingBefore,
  limit,
  username,
  userId: number
) => {
  try {
    const urlApi = await getUrlApi(userId)
    const response = await gizmoApi.get(`${urlApi}v2.0/operators`, {
      searchParams: {
        Username: username,
        StartingAfter: startingAfter,
        EndingBefore: endingBefore,
        Limit: limit,
      },
    })

    // Ky автоматически парсит ответ в JSON, если это возможно
    const data = await response.json()

    console.log(data)

    // Проверьте ответ, используя схему zod
    const validationResult = ApiResponseSchema.safeParse(data)

    if (validationResult.success) {
      return validationResult.data // Вернуть валидированные данные
    } else {
      console.error("Validation error:", validationResult.error)
      throw new Error("API data validation failed.")
    }
  } catch (error) {
    console.error("API request error:", error)
    throw error
  }
}
