import { ArrowRight, Loader2, X } from 'lucide-react'

import {
  useApproveOrderMutation,
  useCancelOrderMutation,
  useDeliverOrderMutation,
  useDispatchOrderMutation,
  useFinishOrderMutation,
} from '@/entities/order/model/useOrders'
import { OrderStatus } from '@/entities/order/ui/order-status'
import { Button } from '@/shared/ui/button'

interface OrderActionsPanelProps {
  orderId: string
  status: OrderStatus
}

export function OrderActionsPanel({ orderId, status }: OrderActionsPanelProps) {
  const { mutateAsync: cancelOrderFn, isPending: isCancellingOrder } =
    useCancelOrderMutation()

  const { mutateAsync: approveOrderFn, isPending: isApprovingOrder } =
    useApproveOrderMutation()

  const { mutateAsync: dispatchOrderFn, isPending: isDispatchingOrder } =
    useDispatchOrderMutation()

  const { mutateAsync: deliverOrderFn, isPending: isDeliveringOrder } =
    useDeliverOrderMutation()

  const { mutateAsync: finishOrderFn, isPending: isFinishingOrder } =
    useFinishOrderMutation()

  return (
    <div className="flex flex-col gap-2">
      {status === 'pending' && (
        <Button
          onClick={() => approveOrderFn(orderId)}
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
          onClick={() => dispatchOrderFn(orderId)}
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
          onClick={() => deliverOrderFn(orderId)}
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
          onClick={() => finishOrderFn(orderId)}
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
        onClick={() => cancelOrderFn(orderId)}
        variant="ghost"
        size="xs"
      >
        <X className="mr-2 h-3 w-3" />
        Rechazar Pedido
      </Button>
    </div>
  )
}
