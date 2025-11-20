import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { toast } from 'sonner'

import { DeliveryPersonInfo } from '@/pages/app/live-orders/delivery-person-info'
import { OrderDetails } from '@/pages/app/orders/order-details'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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

  const assignedDriver = (deliveryMenData?.deliveryMen ?? []).find(
    (d) => d.id === selectedOrder?.deliveryManId,
  )

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
            {selectedOrder && (
              <>
                <OrderActionsPanel
                  orderId={selectedOrder.orderId}
                  status={selectedOrder.status}
                />
                <OrderDetails orderId={selectedOrder.orderId} />

                <div className="mt-4 space-y-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="w-full">
                        {assignedDriver
                          ? 'Cambiar repartidor'
                          : 'Asignar repartidor'}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-[300px] max-h-72 overflow-y-auto"
                      side="bottom"
                      sideOffset={5}
                    >
                      <DropdownMenuLabel>
                        Seleccionar repartidor
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <div className="p-2">
                        <Input
                          placeholder="Buscar repartidor..."
                          value={driverSearchTerm}
                          onChange={(e) =>
                            setDriverSearchTerm(e.target.value)
                          }
                          className="mb-2"
                        />
                      </div>
                      {filteredDrivers?.map((driver) => (
                        <DropdownMenuItem
                          key={driver.id}
                          asChild
                          onSelect={() => handleAssignDriver(driver)}
                        >
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                          >
                            {driver.name}
                          </Button>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

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
