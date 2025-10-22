import { useQuery } from '@tanstack/react-query'
import { getOrders } from '@/api/get-orders'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { OrderStatus } from '@/components/order-status'

interface IncomingOrdersListProps {
  onSelectOrder: (orderId: string) => void
}

export function IncomingOrdersList({ onSelectOrder }: IncomingOrdersListProps) {
  const { data: result, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['orders', 1, null, null, 'pending'], // Fetching pending orders for now
    queryFn: () =>
      getOrders({
        pageIndex: 0,
        status: 'pending',
      }),
      refetchInterval: 5000, // Refresh every 5 seconds
  })

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
          {isLoadingOrders && (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Cargando pedidos...
              </TableCell>
            </TableRow>
          )}
          {result && result.orders.map((order) => (
            <TableRow key={order.orderId} onClick={() => onSelectOrder(order.orderId)} className="cursor-pointer">
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
          {!isLoadingOrders && result?.orders.length === 0 && (
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
