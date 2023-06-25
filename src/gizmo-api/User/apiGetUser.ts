import { z } from "zod"
import ky from "ky"
import { gizmoApi } from "../GizmoApi"
import { getConfigApi, getUrlApi } from "../_credentials/credentials"

export const UserSchema = z.object({
  id: z.number(),
  guid: z.string(),
  isGuest: z.boolean(),
  username: z.string(),
  email: z.nullable(z.string()),
  userGroupId: z.number(),
  isNegativeBalanceAllowed: z.nullable(z.boolean()),
  isPersonalInfoRequested: z.boolean(),
  enableDate: z.nullable(z.unknown()),
  disabledDate: z.nullable(z.unknown()),
  firstName: z.string().nullable(),
  lastName: z.nullable(z.string()),
  birthDate: z.nullable(z.unknown()),
  address: z.nullable(z.string()),
  city: z.nullable(z.string()),
  country: z.string().nullable(),
  postCode: z.nullable(z.string()),
  phone: z.nullable(z.string()),
  mobilePhone: z.nullable(z.string()),
  sex: z.number(),
  isDeleted: z.boolean(),
  isDisabled: z.boolean(),
  smartCardUid: z.nullable(z.string()),
  identification: z.nullable(z.string()),
})

// Определение схемы для ответа сервера
const ApiResponseSchema = z.object({
  version: z.nullable(z.unknown()),
  result: UserSchema,
  httpStatusCode: z.number(),
  message: z.nullable(z.unknown()),
  isError: z.boolean(),
})

const TAG = "[apiGetUser.ts]"

export const apiGetUser = async (userIdGizmo, userIdDebit) => {
  try {
    const { headers, url } = await getConfigApi(userIdDebit)
    const response = await gizmoApi.get(`${url}v2.0/users/${userIdGizmo}`, { headers })

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
