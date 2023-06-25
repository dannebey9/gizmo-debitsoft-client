import { z } from "zod"
import ky from "ky"
import { gizmoApi } from "../GizmoApi"
import { getConfigApi, getUrlApi } from "../_credentials/credentials"

const HostComputer = z.object({
  windowsName: z.string().nullable(),
  macAddress: z.string().nullable(),
})

const HostEndpoint = z.object({
  maximumUsers: z.number().nullable(),
})

const Computer = z.object({
  id: z.number(),
  hostType: z.number(),
  hostGroupId: z.number().nullable(),
  number: z.number(),
  name: z.string(),
  isOutOfOrder: z.boolean(),
  isLocked: z.boolean(),
  iconId: z.number().nullable(),
  isDeleted: z.boolean(),
  hostComputer: HostComputer.nullable(),
  hostEndpoint: HostEndpoint.nullable(),
})

const ApiResponse = z.object({
  version: z.null(),
  result: Computer,
  httpStatusCode: z.number(),
  message: z.null(),
  isError: z.boolean(),
})

export const apiGetComputer = async (hostId: number, userId: number) => {
  try {
    const { headers, url } = await getConfigApi(userId)
    const response = await gizmoApi.get(`${url}v2.0/hosts/${hostId}`, { headers }).json()

    const validationResult = ApiResponse.safeParse(response)

    if (validationResult.success) {
      return validationResult.data.result // Return the validated data
    } else {
      console.error("Validation error:", validationResult.error)
      throw new Error("API data validation failed.")
    }
  } catch (error) {
    console.error("API request error:", error)
    throw error // Propagate the error to be handled outside of this function
  }
}
