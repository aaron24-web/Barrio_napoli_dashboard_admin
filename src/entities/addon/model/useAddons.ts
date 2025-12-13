// src/core/hooks/useAddons.ts
import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  createAddon,
  deleteAddon,
  getAddons,
  toggleAddonAvailability,
  updateAddon,
} from '@/entities/addon/api/addon.service'
import {
  type CreateAddonPayload,
  type UpdateAddonPayload,
} from '@/entities/addon/model/addon.model'

export const useAddons = () => {
  return useQuery({
    queryKey: ['addons'],
    queryFn: getAddons,
  })
}

export const useCreateAddon = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateAddonPayload) => createAddon(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addons'] })
      toast.success('Complemento creado con éxito.')
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Error al crear el complemento.')
      }
    },
  })
}

export const useUpdateAddon = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateAddonPayload) => updateAddon(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addons'] })
      toast.success('Complemento actualizado con éxito.')
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Error al actualizar el complemento.')
      }
    },
  })
}

export const useDeleteAddon = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (addonId: string) => deleteAddon(addonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addons'] })
      toast.success('Complemento eliminado con éxito.')
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Error al eliminar el complemento.')
      }
    },
  })
}

export const useToggleAddonAvailability = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ addonId, status }: { addonId: string; status: boolean }) =>
      toggleAddonAvailability(addonId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addons'] })
      toast.success('Disponibilidad del complemento actualizada con éxito.')
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Error al actualizar la disponibilidad del complemento.')
      }
    },
  })
}
