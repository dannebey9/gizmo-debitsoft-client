import { z } from "zod"

export const email = z
  .string()
  .email("Неверный формат электронной почты")
  .transform((str) => str.toLowerCase().trim())

export const password = z
  .string()
  .min(10, "Пароль должен содержать минимум 10 символов")
  .max(100, "Пароль не должен превышать 100 символов")
  .transform((str) => str.trim())

export const Signup = z
  .object({
    email,
    password,
    passwordConfirmation: z.string(),
    verificationCode: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Пароли не совпадают",
    path: ["passwordConfirmation"], // set the path of the error
  })

export const Login = z.object({
  email,
  password: z.string(),
})

export const ForgotPassword = z.object({
  email,
})

export const ResetPassword = z
  .object({
    password: password,
    passwordConfirmation: password,
    token: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Пароли не совпадают",
    path: ["passwordConfirmation"], // set the path of the error
  })

export const ChangePassword = z.object({
  currentPassword: z.string(),
  newPassword: password,
})
