// src/core/models/auth.model.ts
import { z } from 'zod'

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type SignInParams = z.infer<typeof signInSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

export type ForgotPasswordParams = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z
  .object({
    token: z.string(),
    password: z.string().min(6),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['password_confirmation'],
  })

export type ResetPasswordParams = z.infer<typeof resetPasswordSchema>

export const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string(),
})

export type ChangePasswordParams = z.infer<typeof changePasswordSchema>
