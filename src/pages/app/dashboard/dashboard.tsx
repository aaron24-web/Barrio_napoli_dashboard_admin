import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'

import { getOrderDetails } from '@/api/get-order-details'
import { getOrders } from '@/api/get-orders'
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

interface Driver {
  id: string
  name: string
}

const MOCK_DRIVERS: Driver[] = [
  { id: '1', name: 'Juan Pérez' },
  { id: '2', name: 'María Gómez' },
  { id: '3', name: 'Carlos Ramírez' },
]

export function Dashboard() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [selectedDeliveryPerson, setSelectedDeliveryPerson] =
    useState<DeliveryPerson | null>(null)
  const [isAssignDriverModalOpen, setIsAssignDriverModalOpen] = useState(false)
  const [assignedDriver, setAssignedDriver] = useState<Driver | null>(null)
  const [driverSearchTerm, setDriverSearchTerm] = useState('')

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
    setAssignedDriver(null) // Clear assigned driver for new order
  }

  function handleSelectDeliveryPerson(person: DeliveryPerson) {
    setSelectedDeliveryPerson(person)
    setSelectedOrderId(null) // Close order details
    setAssignedDriver(null) // Clear assigned driver for new order
  }

  const filteredDrivers = MOCK_DRIVERS.filter((driver) =>
    driver.name.toLowerCase().includes(driverSearchTerm.toLowerCase()),
  )

  function handleAssignDriver(driver: Driver) {
    setAssignedDriver(driver)
    setIsAssignDriverModalOpen(false)
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

                <div className="space-y-3">
                  <Dialog
                    open={isAssignDriverModalOpen}
                    onOpenChange={setIsAssignDriverModalOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="w-full">Asignar repartidor</Button>
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
                        {filteredDrivers.map((driver) => (
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
                    <p className="text-sm font-medium">
                      Repartidor asignado: {assignedDriver.name}
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
