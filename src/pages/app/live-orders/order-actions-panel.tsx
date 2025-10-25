import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { ArrowRight, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'

import { approveOrder } from '@/api/approve-order'
import { cancelOrder } from '@/api/cancel-order'
import { deliveryOrder } from '@/api/delivery-order'
import { dispatchOrder } from '@/api/dispatch-order'
import { GetOrdersResponse } from '@/api/get-orders'
import { OrderStatus } from '@/components/order-status'
import { Button } from '@/components/ui/button'

interface OrderActionsPanelProps {
  orderId: string
  status: OrderStatus
}

export function OrderActionsPanel({ orderId, status }: OrderActionsPanelProps) {
  const queryClient = useQueryClient()

  function updateOrderStatusOnCache(orderId: string, status: OrderStatus) {
    const queryKey = [
      'orders',
      1,
      null,
      null,
      ['pending', 'processing', 'delivering'],
    ]
    const ordersListCache = queryClient.getQueryData<GetOrdersResponse>(queryKey)

    if (ordersListCache) {
      queryClient.setQueryData<GetOrdersResponse>(queryKey, {
        ...ordersListCache,
        orders: ordersListCache.orders.map((order) => {
          if (order.orderId === orderId) {
            return { ...order, status }
          }
          return order
        }),
      })
    }
  }

  const { mutateAsync: cancelOrderFn, isPending: isCancellingOrder } =
    useMutation({
      mutationFn: cancelOrder,
      async onSuccess(_, { orderId }) {
        updateOrderStatusOnCache(orderId, 'canceled')
        queryClient.invalidateQueries({ queryKey: ['order', orderId] })
        toast.success('Pedido cancelado con éxito.')
      },
      onError() {
        toast.error('Error al cancelar el pedido, por favor intente de nuevo.')
      },
    })

  const { mutateAsync: approveOrderFn, isPending: isApprovingOrder } =
    useMutation({
      mutationFn: approveOrder,
      async onSuccess(_, { orderId }) {
        updateOrderStatusOnCache(orderId, 'accepted')
        queryClient.invalidateQueries({ queryKey: ['order', orderId] })
        toast.success(`Pedido ${orderId} aceptado con éxito.`)
      },
      onError(error: AxiosError) {
        if (error.response?.status === 409) {
          toast.error('Este pedido ya fue actualizado por otro operador.')
        } else {
          toast.error('Error al aceptar el pedido, por favor intente de nuevo.')
        }
      },
    })

  const { mutateAsync: dispatchOrderFn, isPending: isDispatchingOrder } =
    useMutation({
      mutationFn: dispatchOrder,
      async onSuccess(_, { orderId }) {
        updateOrderStatusOnCache(orderId, 'processing')
        queryClient.invalidateQueries({ queryKey: ['order', orderId] })
        toast.success(`Pedido ${orderId} en proceso.`)
      },
      onError() {
        toast.error('Error al procesar el pedido, por favor intente de nuevo.')
      },
    })

  const { mutateAsync: deliverOrderFn, isPending: isDeliveringOrder } =
    useMutation({
      mutationFn: deliveryOrder,
      async onSuccess(_, { orderId }) {
        updateOrderStatusOnCache(orderId, 'delivering')
        queryClient.invalidateQueries({ queryKey: ['order', orderId] })
        toast.success(`Pedido ${orderId} en reparto.`)
      },
      onError() {
        toast.error('Error al entregar el pedido, por favor intente de nuevo.')
      },
    })

  const { mutateAsync: finishOrderFn, isPending: isFinishingOrder } =
    useMutation({
      mutationFn: deliveryOrder, // This should be a new function to finish the order
      async onSuccess(_, { orderId }) {
        updateOrderStatusOnCache(orderId, 'delivered')
        queryClient.invalidateQueries({ queryKey: ['order', orderId] })
        toast.success(`Pedido ${orderId} finalizado.`)
      },
      onError() {
        toast.error('Error al finalizar el pedido, por favor intente de nuevo.')
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
          {isApprovingOrder ? (
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          ) : (
            <ArrowRight className="mr-2 h-3 w-3" />
          )}
          Aceptar Pedido
        </Button>
      )}

      {status === 'accepted' && (
        <Button
          onClick={() => dispatchOrderFn({ orderId })}
          disabled={isDispatchingOrder}
          variant="outline"
          size="xs"
        >
          {isDispatchingOrder ? (
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          ) : (
            <ArrowRight className="mr-2 h-3 w-3" />
          )}
          En Proceso
        </Button>
      )}

      {status === 'processing' && (
        <Button
          onClick={() => deliverOrderFn({ orderId })}
          disabled={isDeliveringOrder}
          variant="outline"
          size="xs"
        >
          {isDeliveringOrder ? (
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          ) : (
            <ArrowRight className="mr-2 h-3 w-3" />
          )}
          En Reparto
        </Button>
      )}

      {status === 'delivering' && (
        <Button
          onClick={() => finishOrderFn({ orderId })}
          disabled={isFinishingOrder}
          variant="outline"
          size="xs"
        >
          {isFinishingOrder ? (
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          ) : (
            <ArrowRight className="mr-2 h-3 w-3" />
          )}
          Finalizado
        </Button>
      )}

      <Button
        disabled={
          !['pending', 'accepted', 'processing'].includes(status) ||
          isCancellingOrder
        }
        onClick={() => cancelOrderFn({ orderId })}
        variant="ghost"
        size="xs"
      >
        <X className="mr-2 h-3 w-3" />
        Rechazar Pedido
      </Button>
    </div>
  )
}
