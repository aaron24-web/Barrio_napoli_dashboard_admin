import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'

import { getOrderDetails } from '@/api/get-order-details'
import { getOrders } from '@/api/get-orders'
import { DeliveryPersonInfo } from '@/pages/app/live-orders/delivery-person-info'
import { OrderDetails } from '@/pages/app/orders/order-details'

import { DeliveryMap } from '../live-orders/delivery-map'
import { IncomingOrdersList } from '../live-orders/incoming-orders-list'
import { OrderActionsPanel } from '../live-orders/order-actions-panel'

export interface DeliveryPerson {
  id: string
  name: string
  vehicle: string
  orderId: string
  address: string
}

export function Dashboard() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [selectedDeliveryPerson, setSelectedDeliveryPerson] =
    useState<DeliveryPerson | null>(null)

  const { data: orders } = useQuery({
    queryKey: [
      'orders',
      1,
      null,
      null,
      ['pending', 'processing', 'delivering'],
    ],
    queryFn: () =>
      getOrders({
        pageIndex: 1,
        status: 'pending,processing,delivering',
      }),
    refetchInterval: 5000,
    staleTime: 0,
 // Refresh every 5 seconds
  })

  useEffect(() => {
    if (
      orders &&
      orders.orders.length > 0 &&
      !selectedOrderId &&
      !selectedDeliveryPerson
    ) {
      setSelectedOrderId(orders.orders[0].orderId)
    }
  }, [orders, selectedOrderId, selectedDeliveryPerson])

  const { data: selectedOrder } = useQuery({
    queryKey: ['order', selectedOrderId],
    queryFn: () => getOrderDetails({ orderId: selectedOrderId! }),
    enabled: !!selectedOrderId,
  })

  function handleSelectOrder(orderId: string) {
    setSelectedOrderId(orderId)
    setSelectedDeliveryPerson(null) // Close delivery person info
  }

  function handleSelectDeliveryPerson(person: DeliveryPerson) {
    setSelectedDeliveryPerson(person)
    setSelectedOrderId(null) // Close order details
  }

  return (
    <>
      <Helmet title="Panel de control" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Panel de control</h1>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <IncomingOrdersList
              orders={orders}
              onSelectOrder={handleSelectOrder}
            />
          </div>
          <div className="col-span-6">
            <DeliveryMap onSelectDeliveryPerson={handleSelectDeliveryPerson} />
          </div>
          <div className="col-span-3 flex flex-col gap-4">
            {selectedOrder && (
              <>
                <OrderActionsPanel
                  orderId={selectedOrder.id}
                  status={selectedOrder.status}
                />
                <OrderDetails order={selectedOrder} />
              </>
            )}
            {selectedDeliveryPerson && (
              <DeliveryPersonInfo person={selectedDeliveryPerson} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
