import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { toast } from 'sonner'

import { type DeliveryPerson } from '@/entities/delivery/model/delivery.model'
import { useGetOrdersQuery } from '@/entities/order/model/useOrders'
import { type OrderStatusType } from '@/entities/order/model/order.model'
import { Button } from '@/shared/ui/button'
import { DeliveryMap } from '@/widgets/delivery-map/delivery-map'
import { DeliveryPersonInfo } from '@/widgets/delivery-person-info/delivery-person-info'
import { IncomingOrdersList } from '@/widgets/incoming-orders-list/incoming-orders-list'
import { OrderActionsPanel } from '@/widgets/order-actions-panel/order-actions-panel'
import { OrderDetails } from '@/widgets/order-details/order-details'

export function Dashboard() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [selectedDeliveryPerson, setSelectedDeliveryPerson] =
    useState<DeliveryPerson | null>(null)

  const { data: orders } = useGetOrdersQuery({
    page: 1,
    status: ['pending', 'processing', 'delivering'] as OrderStatusType[],
  })

  useEffect(() => {
    if (
      orders &&
      orders?.results?.length > 0 &&
      !selectedOrderId &&
      !selectedDeliveryPerson
    ) {
      setSelectedOrderId(orders.results[0].orderId)
    }
  }, [orders, selectedOrderId, selectedDeliveryPerson])

  function handleSelectOrder(orderId: string) {
    setSelectedOrderId(orderId)
    setSelectedDeliveryPerson(null) // Close delivery person info
  }

  function handleSelectDeliveryPerson(person: DeliveryPerson) {
    setSelectedDeliveryPerson(person)
    setSelectedOrderId(null) // Close order details
  }

  function handleSimulateNewOrder() {
    // Audio playback for notification sound
    // Note: Browsers may block autoplay until the user interacts with the page.
    new Audio('/SD_ALERT_33.mp3').play()

    toast.success('Nuevo pedido recibido!', {
      description: 'Pedido #12345-abcde acaba de llegar.',
      action: {
        label: 'Ver pedido',
        onClick: () => console.log('Ir al pedido #12345-abcde'),
      },
    })
  }

  return (
    <>
      <Helmet title="Panel de control" />
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Panel de control</h1>
          <Button onClick={handleSimulateNewOrder}>Simular Nuevo Pedido</Button>
        </div>

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
            <OrderActionsPanel
              orderId={selectedOrderId}
              status={
                orders?.results.find((o) => o.orderId === selectedOrderId)
                  ?.status ?? 'pending'
              }
            />
            <OrderDetails orderId={selectedOrderId} />
            <DeliveryPersonInfo person={selectedDeliveryPerson} />
          </div>
        </div>
      </div>
    </>
  )
}
