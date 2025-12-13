// src/core/hooks/useDelivery.ts
import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import * as DeliveryService from '@/entities/delivery/api/delivery.service'

export const useGetDeliveryMenQuery = () => {
  return useQuery({
    queryKey: ['delivery-men'],
    queryFn: DeliveryService.getDeliveryMen,
  })
}

export const useCreateDeliveryManMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: DeliveryService.createDeliveryMan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-men'] })
      toast.success('Repartidor creado con éxito.')
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Error al crear el repartidor, por favor intente de nuevo.')
      }
    },
  })
}

export const useUpdateDeliveryManMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: { name: string; phone: string }
    }) => DeliveryService.updateDeliveryMan(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-men'] })
      toast.success('Repartidor actualizado con éxito.')
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error(
          'Error al actualizar el repartidor, por favor intente de nuevo.',
        )
      }
    },
  })
}

export const useDeleteDeliveryManMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: DeliveryService.deleteDeliveryMan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-men'] })
      toast.success('Repartidor eliminado con éxito.')
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Error al eliminar el repartidor, por favor intente de nuevo.')
      }
    },
  })
}

export const useToggleDeliveryManStatusMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string
      status: 'active' | 'inactive'
    }) => DeliveryService.toggleDeliveryManStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-men'] })
      toast.success('Estado del repartidor actualizado con éxito.')
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error(
          'Error al actualizar el estado del repartidor, por favor intente de nuevo.',
        )
      }
    },
  })
}

export const useAssignDeliveryManMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: DeliveryService.assignDeliveryMan,
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order-details', orderId] })
      toast.success('Repartidor asignado con éxito.')
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Error al asignar el repartidor, por favor intente de nuevo.')
      }
    },
  })
}
