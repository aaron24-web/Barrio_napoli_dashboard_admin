import { OrderStatus } from '@/entities/order/ui/order-status'
import { type PaginatedOrders } from '@/entities/order/model/order.model'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table'
import { Timer } from '@/shared/ui/timer'

interface IncomingOrdersListProps {
  orders: PaginatedOrders | undefined
  onSelectOrder: (orderId: string) => void
}

export function IncomingOrdersList({
  orders,
  onSelectOrder,
}: IncomingOrdersListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[64px]"></TableHead>
            <TableHead className="w-[140px]">N.º de orden</TableHead>
            <TableHead className="w-[180px]">Cliente</TableHead>
            <TableHead className="w-[110px]">Tiempo</TableHead>
            <TableHead className="w-[140px]">Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!orders?.results && (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Cargando pedidos...
              </TableCell>
            </TableRow>
          )}
          {orders?.results &&
            orders.results.map((order) => (
              <TableRow
                key={order.orderId}
                onClick={() => onSelectOrder(order.orderId)}
                className="cursor-pointer"
              >
                <TableCell></TableCell>
                <TableCell className="font-mono text-xs font-medium">
                  {order.orderId}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {order.customerName}
                </TableCell>
                <TableCell>
                  <Timer startTime={order.createdAt} />
                </TableCell>
                <TableCell>
                  <OrderStatus status={order.status} />
                </TableCell>
              </TableRow>
            ))}
          {orders?.results && orders.results.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No hay pedidos entrantes.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
