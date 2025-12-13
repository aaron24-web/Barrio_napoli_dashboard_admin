// src/core/hooks/useAddons.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createAddon,
  deleteAddon,
  getAddons,
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
    },
  })
}

export const useUpdateAddon = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateAddonPayload) => updateAddon(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addons'] })
    },
  })
}

export const useDeleteAddon = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (addonId: string) => deleteAddon(addonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addons'] })
    },
  })
}
