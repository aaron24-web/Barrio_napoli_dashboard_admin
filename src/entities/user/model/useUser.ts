// src/core/hooks/useUser.ts
import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import * as UserService from '@/entities/user/api/user.service'
import { type User } from '@/entities/user/model/user.model'

export const useGetProfileQuery = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: UserService.getProfile,
    staleTime: Infinity,
  })
}

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: UserService.updateProfile,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['profile'] })

      const previousProfile = queryClient.getQueryData<User>(['profile'])

      queryClient.setQueryData<User>(['profile'], (old) => {
        if (!old) return undefined
        return { ...old, name: variables.name }
      })

      return { previousProfile }
    },
    onError: (error, _, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(['profile'], context.previousProfile)
      }
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Error al actualizar el perfil, por favor intente de nuevo.')
      }
    },
    onSuccess: () => {
      toast.success('¡Perfil actualizado con éxito!')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}
