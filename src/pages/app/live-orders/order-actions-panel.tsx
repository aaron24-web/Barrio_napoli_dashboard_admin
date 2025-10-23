import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowRight, X } from 'lucide-react'

import { approveOrder } from '@/api/approve-order'
import { cancelOrder } from '@/api/cancel-order'
import { deliveryOrder } from '@/api/delivery-order'
import { dispatchOrder } from '@/api/dispatch-order'
import { GetOrderDetailsResponse } from '@/api/get-order-details'
import { GetOrdersResponse } from '@/api/get-orders'
import { Button } from '@/components/ui/button'

interface OrderActionsPanelProps {
  orderId: string
  status: 'pending' | 'canceled' | 'processing' | 'delivering' | 'delivered'
}

export function OrderActionsPanel({ orderId, status }: OrderActionsPanelProps) {
  const queryClient = useQueryClient()

  function updateOrderStatusOnCache(orderId: string, status: OrderStatus) {
    const ordersListCache = queryClient.getQueriesData<GetOrdersResponse>({
      queryKey: ['orders'],
    })

    ordersListCache.forEach(([cacheKey, cacheData]) => {
      if (!cacheData) {
        return
      }

      queryClient.setQueryData<GetOrdersResponse>(cacheKey, {
        ...cacheData,
        orders: cacheData.orders.map((order) => {
          if (order.orderId === orderId) {
            return { ...order, status }
          }

          return order
        }),
      })
    })
  }

  const { mutateAsync: cancelOrderFn, isPending: isCancellingOrder } =
    useMutation({
      mutationFn: cancelOrder,
      async onSuccess(_, { orderId }) {
        updateOrderStatusOnCache(orderId, 'canceled')
      },
    })

  const { mutateAsync: approveOrderFn, isPending: isApprovingOrder } =
    useMutation({
      mutationFn: approveOrder,
      async onSuccess(_, { orderId }) {
        updateOrderStatusOnCache(orderId, 'processing')
      },
    })

  const { mutateAsync: dispatchOrderFn, isPending: isDispatchingOrder } =
    useMutation({
      mutationFn: dispatchOrder,
      async onSuccess(_, { orderId }) {
        updateOrderStatusOnCache(orderId, 'delivering')
      },
    })

  const { mutateAsync: deliverOrderFn, isPending: isDeliveringOrder } =
    useMutation({
      mutationFn: deliveryOrder,
      async onSuccess(_, { orderId }) {
        updateOrderStatusOnCache(orderId, 'delivered')
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
