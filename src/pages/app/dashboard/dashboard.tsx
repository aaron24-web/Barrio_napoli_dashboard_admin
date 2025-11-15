import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'

import { DeliveryPersonInfo } from '@/pages/app/live-orders/delivery-person-info'
import { OrderDetails } from '@/pages/app/orders/order-details'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  useAssignDeliveryManMutation,
  useGetDeliveryMenQuery,
} from '@/core/hooks/useDelivery'
import {
  useGetOrderDetailsQuery,
  useGetOrdersQuery,
} from '@/core/hooks/useOrders'
import { DeliveryMan, DeliveryPerson, OrderStatusType } from '@/core/models'

import { DeliveryMap } from '../live-orders/delivery-map'
import { IncomingOrdersList } from '../live-orders/incoming-orders-list'
import { OrderActionsPanel } from '../live-orders/order-actions-panel'

export function Dashboard() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [selectedDeliveryPerson, setSelectedDeliveryPerson] =
    useState<DeliveryPerson | null>(null)
  const [isAssignDriverModalOpen, setIsAssignDriverModalOpen] = useState(false)
  const [driverSearchTerm, setDriverSearchTerm] = useState('')

  const { data: orders } = useGetOrdersQuery({
    page: 1,
    status: ['pending', 'processing', 'delivering'] as OrderStatusType[],
  })

  const { data: deliveryMenData } = useGetDeliveryMenQuery()
  const { mutateAsync: assignDeliveryMan } = useAssignDeliveryManMutation()

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

  const { data: selectedOrder } = useGetOrderDetailsQuery(selectedOrderId!)

  function handleSelectOrder(orderId: string) {
    setSelectedOrderId(orderId)
    setSelectedDeliveryPerson(null) // Close delivery person info
  }

  function handleSelectDeliveryPerson(person: DeliveryPerson) {
    setSelectedDeliveryPerson(person)
    setSelectedOrderId(null) // Close order details
  }

  const filteredDrivers = (deliveryMenData?.deliveryMen ?? []).filter((driver) =>
    driver.name.toLowerCase().includes(driverSearchTerm.toLowerCase()),
  )

  async function handleAssignDriver(driver: DeliveryMan) {
    if (!selectedOrderId) return

    await assignDeliveryMan({
      orderId: selectedOrderId,
      deliveryManId: driver.id,
    })
    setIsAssignDriverModalOpen(false)
  }

  const assignedDriver = (deliveryMenData?.deliveryMen ?? []).find(
    (d) => d.id === selectedOrder?.deliveryManId,
  )

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
                  orderId={selectedOrder.orderId}
                  status={selectedOrder.status}
                />
                <OrderDetails orderId={selectedOrder.orderId} />

                <div className="mt-4 space-y-3">
                  <Dialog
                    open={isAssignDriverModalOpen}
                    onOpenChange={setIsAssignDriverModalOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        {assignedDriver
                          ? 'Cambiar repartidor'
                          : 'Asignar repartidor'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Seleccionar repartidor</DialogTitle>
                      </DialogHeader>
                      <Input
                        placeholder="Buscar repartidor..."
                        value={driverSearchTerm}
                        onChange={(e) => setDriverSearchTerm(e.target.value)}
                        className="mb-4"
                      />
                      <div className="space-y-2">
                        {filteredDrivers?.map((driver) => (
                          <Button
                            key={driver.id}
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => handleAssignDriver(driver)}
                          >
                            {driver.name}
                          </Button>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                  {assignedDriver && (
                    <p className="text-sm font-medium flex items-center gap-2">
                      <span className="text-lg">🚚</span> Repartidor asignado:{' '}
                      {assignedDriver.name}
                    </p>
                  )}
                </div>
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
