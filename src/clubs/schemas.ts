import { z } from "zod"

export const CreateClubSchema = z.object({
  url: z.string(),
  username: z.string(),
  password: z.string(),
})
export const UpdateClubSchema = z.object({
  id: z.number(),
  url: z.string(),
  username: z.string(),
  password: z.string(),
})

export const DeleteClubSchema = z.object({
  id: z.number(),
})
