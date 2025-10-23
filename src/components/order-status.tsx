export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'canceled'
  | 'processing'
  | 'delivering'
  | 'delivered'

interface OrderStatusProps {
  status: OrderStatus
}

const orderStatusMap: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  accepted: 'Aceptado',
  processing: 'En preparación',
  delivering: 'En reparto',
  delivered: 'Entregado',
  canceled: 'Cancelado',
}

const orderStatusColorMap: Record<OrderStatus, string> = {
  pending: 'bg-slate-400',
  accepted: 'bg-blue-500',
  processing: 'bg-amber-500',
  delivering: 'bg-amber-500',
  delivered: 'bg-emerald-500',
  canceled: 'bg-rose-500',
}

export function OrderStatus({ status }: OrderStatusProps) {
  return (
    <div className="flex items-center gap-2">
      {status === 'pending' && (
        <span
          data-testid="badge"
          className="h-2 w-2 rounded-full bg-slate-400"
        />
      )}

      {status === 'canceled' && (
        <span
          data-testid="badge"
          className="h-2 w-2 rounded-full bg-rose-500"
        />
      )}

      {status === 'delivered' && (
        <span
          data-testid="badge"
          className="h-2 w-2 rounded-full bg-emerald-500"
        />
      )}

      {['processing', 'delivering'].includes(status) && (
        <span
          data-testid="badge"
          className="h-2 w-2 rounded-full bg-amber-500"
        />
      )}

      <span className="font-medium text-muted-foreground">
        {orderStatusMap[status]}
      </span>
    </div>
  )
}
