import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { ArrowRight, Loader2, Search, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { approveOrder } from '@/api/approve-order'
import { cancelOrder } from '@/api/cancel-order'
import { deliveryOrder } from '@/api/delivery-order'
import { dispatchOrder } from '@/api/dispatch-order'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'

import { OrderDetails } from './order-details'
import { OrderStatus } from '@/components/order-status'

interface OrderTableRowProps {
  order: {
    orderId: string
    createdAt: string
    status: 'pending' | 'canceled' | 'processing' | 'delivering' | 'delivered'
    customerName: string
    total: number
  }
}

export function OrderTableRow({ order }: OrderTableRowProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const queryClient = useQueryClient()

  const { mutateAsync: cancelOrderFn, isPending: isCancellingOrder } =
    useMutation({
      mutationFn: cancelOrder,
      async onSuccess() {
        queryClient.invalidateQueries({ queryKey: ['orders'] })
        toast.success('Pedido cancelado con éxito.')
      },
      onError() {
        toast.error('Error al cancelar el pedido, por favor intente de nuevo.')
      },
    })

  const { mutateAsync: approveOrderFn, isPending: isApprovingOrder } =
    useMutation({
      mutationFn: approveOrder,
      async onSuccess() {
        queryClient.invalidateQueries({ queryKey: ['orders'] })
        toast.success(`Pedido ${order.orderId} aceptado con éxito.`)
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
      async onSuccess() {
        queryClient.invalidateQueries({ queryKey: ['orders'] })
        toast.success(`Pedido ${order.orderId} enviado.`)
      },
      onError() {
        toast.error('Error al enviar el pedido, por favor intente de nuevo.')
      },
    })

  const { mutateAsync: deliverOrderFn, isPending: isDeliveringOrder } =
    useMutation({
      mutationFn: deliveryOrder,
      async onSuccess() {
        queryClient.invalidateQueries({ queryKey: ['orders'] })
        toast.success(`Pedido ${order.orderId} entregado.`)
      },
      onError() {
        toast.error('Error al entregar el pedido, por favor intente de nuevo.')
      },
    })

  return (
    <TableRow>
      <TableCell>
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              <Search className="h-3 w-3" />
              <span className="sr-only">Detalles del pedido</span>
            </Button>
          </DialogTrigger>
          <OrderDetails open={isDetailsOpen} orderId={order.orderId} />
        </Dialog>
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {order.orderId}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatDistanceToNow(order.createdAt, {
          locale: es,
          addSuffix: true,
        })}
      </TableCell>
      <TableCell>
        <OrderStatus status={order.status} />
      </TableCell>
      <TableCell className="font-medium">{order.customerName}</TableCell>
      <TableCell className="font-medium">
        {(order.total / 100).toLocaleString('es-MX', {
          style: 'currency',
          currency: 'MXN',
        })}
      </TableCell>
      <TableCell>
        {order.status === 'pending' && (
          <Button
            onClick={() => approveOrderFn({ orderId: order.orderId })}
            disabled={isApprovingOrder}
            variant="outline"
            size="xs"
          >
            {isApprovingOrder ? (
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            ) : (
              <ArrowRight className="mr-2 h-3 w-3" />
            )}
            Aceptar
          </Button>
        )}

        {order.status === 'accepted' && (
          <Button
            onClick={() => dispatchOrderFn({ orderId: order.orderId })}
            disabled={isDispatchingOrder}
            variant="outline"
            size="xs"
          >
            <ArrowRight className="mr-2 h-3 w-3" />
            En reparto
          </Button>
        )}

        {order.status === 'delivering' && (
          <Button
            onClick={() => deliverOrderFn({ orderId: order.orderId })}
            disabled={isDeliveringOrder}
            variant="outline"
            size="xs"
          >
            <ArrowRight className="mr-2 h-3 w-3" />
            Entregado
          </Button>
        )}
      </TableCell>
      <TableCell>
        <Button
          disabled={
            !['pending', 'processing', 'accepted'].includes(order.status) ||
            isCancellingOrder
          }
          onClick={() => cancelOrderFn({ orderId: order.orderId })}
          variant="ghost"
          size="xs"
        >
          <X className="mr-2 h-3 w-3" />
          Cancelar
        </Button>
      </TableCell>
    </TableRow>
  )
}
