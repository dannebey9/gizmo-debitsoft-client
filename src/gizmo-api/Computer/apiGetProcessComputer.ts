import { z } from "zod"
import { gizmoApi } from "../GizmoApi"
import { getConfigApi, getUrlApi } from "../_credentials/credentials"

const MainModuleSchema = z.object({
  companyName: z.string().nullable(),
  description: z.string().nullable(),
  moduleName: z.string().nullable(),
  fileName: z.string().nullable(),
  fileVersion: z.string().nullable(),
  iconData: z.string().nullable(),
})

const ProcessStartInfoSchema = z.object({
  arguments: z.string(),
  createNoWindow: z.boolean(),
  fileName: z.string().nullable(),
  password: z.string().nullable(),
  username: z.string().nullable(),
  waitForTermination: z.boolean(),
  waitTimeout: z.number(),
  workingDirectory: z.string(),
})

const ProcessSchema = z.object({
  id: z.number(),
  processName: z.string(),
  processExeName: z.string(),
  parentId: z.number(),
  basePriority: z.number(),
  sessionId: z.number(),
  exitCode: z.number(),
  mainModule: MainModuleSchema,
  startInfo: ProcessStartInfoSchema,
  startTime: z.string(),
  exitTime: z.string(),
  cpuUsage: z.number(),
  totalProcessorTime: z.string(),
  userProcessorTime: z.string(),
  currentDirectory: z.string().nullable(),
  commandLine: z.string().nullable(),
  isAccessible: z.boolean(),
  hookExited: z.boolean(),
  hasExited: z.boolean(),
  processorCount: z.number(),
})

const ApiResponseSchema = z.object({
  version: z.nullable(z.unknown()),
  result: z.array(ProcessSchema),
  httpStatusCode: z.number(),
  message: z.nullable(z.string()),
  isError: z.boolean(),
})

export type Process = z.infer<typeof ProcessSchema>
export type APIResponse = z.infer<typeof ApiResponseSchema>

const TAG = "[apiGetProcessComputer.ts]"

export const apiGetProcessComputer = async (hostId, userId: number) => {
  try {
    const { headers, url } = await getConfigApi(userId)
    const response = await gizmoApi.get(`${url}hostcomputers/${hostId}/process`, { headers }).json()

    const validationResult = ApiResponseSchema.safeParse(response)

    if (validationResult.success) {
      return validationResult.data.result // Return the validated data
    } else {
      console.error(`${TAG} Validation error:`, validationResult.error)
      throw new Error(`${TAG} API data validation failed.`)
    }
  } catch (error) {
    console.error(`${TAG} API request error:`, error)
    throw error // Propagate the error to be handled outside of this function
  }
}
