import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowRight, X } from 'lucide-react'

import { approveOrder } from '@/api/approve-order'
import { cancelOrder } from '@/api/cancel-order'
import { deliveryOrder } from '@/api/delivery-order'
import { dispatchOrder } from '@/api/dispatch-order'
import { GetOrderDetailsResponse } from '@/api/get-order-details'
import { Button } from '@/components/ui/button'

interface OrderActionsPanelProps {
  orderId: string
  status: 'pending' | 'canceled' | 'processing' | 'delivering' | 'delivered'
}

export function OrderActionsPanel({ orderId, status }: OrderActionsPanelProps) {
  const queryClient = useQueryClient()

  const { mutateAsync: cancelOrderFn, isPending: isCancellingOrder } =
    useMutation({
      mutationFn: cancelOrder,
      async onSuccess() {
        queryClient.setQueryData<GetOrderDetailsResponse>(
          ['order', orderId],
          (old) => {
            if (old) {
              return { ...old, status: 'canceled' }
            }
            return old
          },
        )
      },
    })

  const { mutateAsync: approveOrderFn, isPending: isApprovingOrder } =
    useMutation({
      mutationFn: approveOrder,
      async onSuccess() {
        queryClient.setQueryData<GetOrderDetailsResponse>(
          ['order', orderId],
          (old) => {
            if (old) {
              return { ...old, status: 'processing' }
            }
            return old
          },
        )
      },
    })

  const { mutateAsync: dispatchOrderFn, isPending: isDispatchingOrder } =
    useMutation({
      mutationFn: dispatchOrder,
      async onSuccess() {
        queryClient.setQueryData<GetOrderDetailsResponse>(
          ['order', orderId],
          (old) => {
            if (old) {
              return { ...old, status: 'delivering' }
            }
            return old
          },
        )
      },
    })

  const { mutateAsync: deliverOrderFn, isPending: isDeliveringOrder } =
    useMutation({
      mutationFn: deliveryOrder,
      async onSuccess() {
        queryClient.setQueryData<GetOrderDetailsResponse>(
          ['order', orderId],
          (old) => {
            if (old) {
              return { ...old, status: 'delivered' }
            }
            return old
          },
        )
      },
    })

  return (
    <div className="flex flex-col gap-2">
      {status === 'pending' && (
        <Button
          onClick={() => approveOrderFn({ orderId })}
          disabled={isApprovingOrder}
          variant="outline"
          size="xs"
        >
          <ArrowRight className="mr-2 h-3 w-3" />
          Aceptar Pedido
        </Button>
      )}

      {status === 'processing' && (
        <Button
          onClick={() => dispatchOrderFn({ orderId })}
          disabled={isDispatchingOrder}
          variant="outline"
          size="xs"
        >
          <ArrowRight className="mr-2 h-3 w-3" />
          Marcar como en Proceso
        </Button>
      )}

      {status === 'delivering' && (
        <Button
          onClick={() => deliverOrderFn({ orderId })}
          disabled={isDeliveringOrder}
          variant="outline"
          size="xs"
        >
          <ArrowRight className="mr-2 h-3 w-3" />
          Marcar como Finalizado
        </Button>
      )}

      <Button
        disabled={
          !['pending', 'processing'].includes(status) || isCancellingOrder
        }
        onClick={() => cancelOrderFn({ orderId })}
        variant="ghost"
        size="xs"
      >
        <X className="mr-2 h-3 w-3" />
        Cancelar Pedido
      </Button>
    </div>
  )
}
