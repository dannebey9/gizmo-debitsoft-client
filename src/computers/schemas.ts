import { z } from "zod"

export const CreateComputerSchema = z.object({
  // template: __fieldName__: z.__zodType__(),
})
export const UpdateComputerSchema = z.object({
  id: z.number(),
  // template: __fieldName__: z.__zodType__(),
})

export const DeleteComputerSchema = z.object({
  id: z.number(),
})
