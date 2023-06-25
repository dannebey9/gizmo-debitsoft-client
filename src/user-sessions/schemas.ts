import { z } from "zod"

export const CreateUserSessionSchema = z.object({
  // template: __fieldName__: z.__zodType__(),
})
export const UpdateUserSessionSchema = z.object({
  id: z.number(),
  // template: __fieldName__: z.__zodType__(),
})

export const DeleteUserSessionSchema = z.object({
  id: z.number(),
})
