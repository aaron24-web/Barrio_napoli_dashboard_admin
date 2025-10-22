import { Helmet } from 'react-helmet-async'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { getOrderDetails } from '@/api/get-order-details'
import { OrderDetails } from '@/pages/app/orders/order-details'
import { DeliveryMap } from '../live-orders/delivery-map'
import { IncomingOrdersList } from '../live-orders/incoming-orders-list'
import { OrderActionsPanel } from '../live-orders/order-actions-panel'
import { Dialog } from '@/components/ui/dialog'
import { DeliveryPersonInfo } from '../live-orders/delivery-person-info'

export interface DeliveryPerson {
  id: string
  name: string
  vehicle: string
  orderId: string
  address: string
}

export function Dashboard() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false)
  const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState<DeliveryPerson | null>(null)

  const { data: selectedOrder } = useQuery({
    queryKey: ['order', selectedOrderId],
    queryFn: () => getOrderDetails({ orderId: selectedOrderId! }),
    enabled: !!selectedOrderId,
  })

  function handleSelectOrder(orderId: string) {
    setSelectedOrderId(orderId)
    setIsOrderDetailsOpen(true)
    setSelectedDeliveryPerson(null) // Close delivery person info
  }

  function handleSelectDeliveryPerson(person: DeliveryPerson) {
    setSelectedDeliveryPerson(person)
    setSelectedOrderId(null) // Close order details
    setIsOrderDetailsOpen(false)
  }

  return (
    <>
      <Helmet title="Panel de control" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Panel de control</h1>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <IncomingOrdersList onSelectOrder={handleSelectOrder} />
          </div>
          <div className="col-span-6">
            <DeliveryMap onSelectDeliveryPerson={handleSelectDeliveryPerson} />
          </div>
          <div className="col-span-3 flex flex-col gap-4">
            {selectedOrderId && selectedOrder && (
              <>
                <Dialog open={isOrderDetailsOpen} onOpenChange={setIsOrderDetailsOpen}>
                  <OrderDetails orderId={selectedOrderId} open={isOrderDetailsOpen} />
                </Dialog>
                <OrderActionsPanel orderId={selectedOrderId} status={selectedOrder.status} />
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
