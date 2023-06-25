import { z } from "zod"
import ky from "ky"
import { gizmoApi } from "../GizmoApi"
import { getConfigApi, getUrlApi } from "../_credentials/credentials"

const User = z.object({
  id: z.number(),
  guid: z.string(),
  isGuest: z.boolean(),
  username: z.string(),
  email: z.string().nullable(),
  userGroupId: z.number(),
  isNegativeBalanceAllowed: z.boolean().nullable(),
  isPersonalInfoRequested: z.boolean(),
  enableDate: z.string().nullable(),
  disabledDate: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  birthDate: z.string().nullable(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  country: z.string().nullable(),
  postCode: z.string().nullable(),
  phone: z.string().nullable(),
  mobilePhone: z.string().nullable(),
  sex: z.number(),
  isDeleted: z.boolean(),
  isDisabled: z.boolean(),
  smartCardUid: z.string().nullable(),
  identification: z.string().nullable(),
})

const Meta = z.object({
  nextCursor: z.number(),
  previousCursor: z.number(),
})

const Data = z.object({
  data: z.array(User),
  meta: Meta,
})

const ApiResponse = z.object({
  version: z.unknown().nullable(),
  result: Data,
  httpStatusCode: z.number(),
  message: z.string().nullable(),
  isError: z.boolean(),
})

export const apiGetUsers = async (startingAfter, endingBefore, limit, username, userIdDebit) => {
  try {
    const { headers, url } = await getConfigApi(userIdDebit)
    const response = await gizmoApi.get(`${url}v2.0/users`, {
      headers,
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
    const validationResult = ApiResponse.safeParse(data)

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
