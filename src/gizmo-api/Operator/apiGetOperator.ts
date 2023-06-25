import { z } from "zod"
import { gizmoApi } from "../GizmoApi"
import { getUrlApi } from "../_credentials/credentials"

const OperatorSchema = z.object({
  id: z.number(),
  guid: z.string(),
  username: z.string(),
  email: z.nullable(z.string()),
  firstName: z.string(),
  lastName: z.nullable(z.string()),
  birthDate: z.nullable(z.unknown()),
  address: z.nullable(z.unknown()),
  city: z.nullable(z.unknown()),
  country: z.nullable(z.unknown()),
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
  result: OperatorSchema,
  httpStatusCode: z.number(),
  message: z.nullable(z.unknown()),
  isError: z.boolean(),
})

const TAG = "apiGetOperator"

export const apiGetOperator = async (operatorId, userId: number) => {
  try {
    const urlApi = await getUrlApi(userId)
    const response = await gizmoApi.get(`${urlApi}v2.0/operators/${operatorId}`)

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
