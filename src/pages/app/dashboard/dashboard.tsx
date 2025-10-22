import { Helmet } from 'react-helmet-async'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { getOrderDetails } from '@/api/get-order-details'
import { OrderDetails } from '@/pages/app/orders/order-details'
import { DeliveryMap } from '../live-orders/delivery-map'
import { IncomingOrdersList } from '../live-orders/incoming-orders-list'
import { OrderActionsPanel } from '../live-orders/order-actions-panel'
import { RevenueChart } from './revenue-chart'

export function Dashboard() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  const { data: selectedOrder } = useQuery({
    queryKey: ['order', selectedOrderId],
    queryFn: () => getOrderDetails({ orderId: selectedOrderId! }),
    enabled: !!selectedOrderId,
  })

  return (
    <>
      <Helmet title="Panel de control" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Panel de control</h1>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <IncomingOrdersList onSelectOrder={setSelectedOrderId} />
          </div>
          <div className="col-span-6">
            <DeliveryMap />
          </div>
          {selectedOrderId && selectedOrder && (
            <div className="col-span-3 flex flex-col gap-4">
              <OrderDetails orderId={selectedOrderId} open={true} />
              <OrderActionsPanel orderId={selectedOrderId} status={selectedOrder.status} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          <RevenueChart />
        </div>
      </div>
    </>
  )
}
