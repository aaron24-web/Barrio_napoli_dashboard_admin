import { GetOrdersResponse } from '@/api/get-orders'
import { OrderStatus } from '@/components/order-status'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface IncomingOrdersListProps {
  orders: GetOrdersResponse | undefined
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
            <TableHead className="w-[140px]">Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!orders && (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Cargando pedidos...
              </TableCell>
            </TableRow>
          )}
          {orders &&
            orders.orders.map((order) => (
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
                  <OrderStatus status={order.status} />
                </TableCell>
              </TableRow>
            ))}
          {orders && orders.orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No hay pedidos entrantes.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
