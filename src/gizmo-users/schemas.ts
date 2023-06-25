import { z } from "zod"

export const CreateGizmoUserSchema = z.object({
  // template: __fieldName__: z.__zodType__(),
})
export const UpdateGizmoUserSchema = z.object({
  id: z.number(),
  // template: __fieldName__: z.__zodType__(),
})

export const DeleteGizmoUserSchema = z.object({
  id: z.number(),
})
