// src/core/hooks/useAuth.ts
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import * as AuthService from '@/features/auth/api/auth.service'

export const useSignInMutation = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: AuthService.signIn,
    onSuccess: () => {
      navigate('/')
    },
    onError: () => {
      toast.error('Credenciales inválidas.')
    },
  })
}

export const useSignOutMutation = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: AuthService.signOut,
    onSuccess: () => {
      navigate('/sign-in')
    },
  })
}

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: AuthService.forgotPassword,
    onSuccess: () => {
      toast.success(
        'Si existe una cuenta con este correo, se ha enviado un enlace de recuperación.',
      )
    },
    onError: () => {
      toast.error('Ocurrió un error. Por favor, inténtalo de nuevo.')
    },
  })
}

export const useResetPasswordMutation = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: AuthService.resetPassword,
    onSuccess: () => {
      toast.success('Contraseña actualizada con éxito.')
      navigate('/sign-in')
    },
    onError: () => {
      toast.error('Ocurrió un error. Por favor, inténtalo de nuevo.')
    },
  })
}

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: AuthService.changePassword,
    onSuccess: () => {
      toast.success('Contraseña actualizada con éxito.')
    },
    onError: () => {
      toast.error(
        'Error al actualizar la contraseña, por favor intente de nuevo.',
      )
    },
  })
}
