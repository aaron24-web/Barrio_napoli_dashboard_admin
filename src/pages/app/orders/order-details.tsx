import { zodResolver } from '@hookform/resolvers/zod'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useEffect, useState } from 'react'

import { ChatBox } from '@/components/chat-box'
import { OrderStatus } from '@/components/order-status'
import { Timer } from '@/components/timer'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  useAssignDeliveryManMutation,
  useGetDeliveryMenQuery,
} from '@/core/hooks/useDelivery'
import { useGetOrderDetailsQuery } from '@/core/hooks/useOrders'

import { OrderDetailsSkeleton } from './order-details-skeleton'

export interface OrderDetailsProps {
  orderId: string
}

const assignDeliveryManSchema = z.object({
  deliveryManId: z.string().nullable(),
})

type AssignDeliveryManSchema = z.infer<typeof assignDeliveryManSchema>

export function OrderDetails({ orderId }: OrderDetailsProps) {
  const { data: order } = useGetOrderDetailsQuery(orderId)
  const { data: deliveryMen } = useGetDeliveryMenQuery()
  const { mutateAsync: assignDeliveryManFn } = useAssignDeliveryManMutation()
  const [chatMessages, setChatMessages] = useState(order?.chatHistory || [])

  useEffect(() => {
    setChatMessages(order?.chatHistory || [])
  }, [order])

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<AssignDeliveryManSchema>({
    resolver: zodResolver(assignDeliveryManSchema),
    defaultValues: {
      deliveryManId: order?.deliveryMan?.id ?? null,
    },
  })

  async function handleAssignDeliveryMan(data: AssignDeliveryManSchema) {
    if (!data.deliveryManId || !order) {
      return
    }

    await assignDeliveryManFn({
      orderId: order.orderId,
      deliveryManId: data.deliveryManId,
    })
  }

  function handleSendMessage(message: string) {
    // En una app real, esto sería una mutación a la API
    setChatMessages([
      ...chatMessages,
      {
        sender: 'admin',
        text: message,
        timestamp: new Date().toISOString(),
      },
    ])
  }

  return (
    <div className="space-y-6">
      {order ? (
        <>
          <h2 className="text-lg font-semibold">Pedido: {order.orderId}</h2>
          <div className="space-y-6">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="text-muted-foreground">Estado</TableCell>
                  <TableCell className="flex justify-end">
                    <OrderStatus status={order.status} />
                  </TableCell>
                </TableRow>
                {order.status === 'processing' && order.processingAt && (
                  <TableRow>
                    <TableCell className="text-muted-foreground">
                      En preparación hace
                    </TableCell>
                    <TableCell className="flex justify-end">
                      <Timer startTime={order.processingAt} />
                    </TableCell>
                  </TableRow>
                )}
                {order.status === 'delivering' && order.deliveringAt && (
                  <TableRow>
                    <TableCell className="text-muted-foreground">
                      En reparto hace
                    </TableCell>
                    <TableCell className="flex justify-end">
                      <Timer startTime={order.deliveringAt} />
                    </TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell className="text-muted-foreground">Cliente</TableCell>
                  <TableCell className="flex justify-end">
                    {order.customer.name}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground">
                    Teléfono
                  </TableCell>
                  <TableCell className="flex justify-end">
                    {order.customer.phone ?? 'No informado'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground">
                    Correo electrónico
                  </TableCell>
                  <TableCell className="flex justify-end">
                    {order.customer.email}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground">
                    Realizado hace
                  </TableCell>
                  <TableCell className="flex justify-end">
                    {formatDistanceToNow(order.createdAt, {
                      locale: es,
                      addSuffix: true,
                    })}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Cant.</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {order.orderItems.map((item) => {
                  const addonsTotal =
                    item.addons?.reduce(
                      (acc, addon) => acc + addon.priceInCents,
                      0,
                    ) ?? 0
                  const itemTotal =
                    (item.priceInCents + addonsTotal) * item.quantity

                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium">{item.product.name}</div>
                        {item.addons && item.addons.length > 0 && (
                          <div className="ml-4 mt-1 space-y-1">
                            {item.addons.map((addon) => (
                              <div
                                key={addon.name}
                                className="text-xs text-muted-foreground"
                              >
                                + {addon.name} (
                                {(addon.priceInCents / 100).toLocaleString(
                                  'es-MX',
                                  {
                                    style: 'currency',
                                    currency: 'MXN',
                                  },
                                )}
                                )
                              </div>
                            ))}
                          </div>
                        )}
                        {item.notes && (
                          <div className="mt-2 text-xs text-gray-500">
                            <span className="font-semibold">Nota:</span>{' '}
                            {item.notes}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {(
                          (item.priceInCents + addonsTotal) /
                          100
                        ).toLocaleString('es-MX', {
                          style: 'currency',
                          currency: 'MXN',
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        {(itemTotal / 100).toLocaleString('es-MX', {
                          style: 'currency',
                          currency: 'MXN',
                        })}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total del pedido</TableCell>
                  <TableCell className="text-right font-medium">
                    {(order.totalInCents / 100).toLocaleString('es-MX', {
                      style: 'currency',
                      currency: 'MXN',
                    })}
                  </TableCell>
                </TableRow>
                {order.deliveryMan && (
                  <TableRow>
                    <TableCell colSpan={3}>Repartidor asignado</TableCell>
                    <TableCell className="text-right font-medium">
                      {order.deliveryMan.name}
                    </TableCell>
                  </TableRow>
                )}
              </TableFooter>
            </Table>

            {order.chatHistory && (
              <ChatBox
                messages={chatMessages}
                onSendMessage={handleSendMessage}
              />
            )}

            {['pending', 'accepted', 'processing', 'delivering'].includes(
              order.status,
            ) && (
              <form onSubmit={handleSubmit(handleAssignDeliveryMan)}>
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold">Asignar repartidor</h2>
                  <div className="flex items-center gap-2">
                    <Controller
                      name="deliveryManId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value ?? ''}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar repartidor..." />
                          </SelectTrigger>
                          <SelectContent>
                            {deliveryMen?.deliveryMen.map((deliveryMan) => (
                              <SelectItem
                                key={deliveryMan.id}
                                value={deliveryMan.id}
                              >
                                {deliveryMan.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <Button type="submit" disabled={isSubmitting}>
                      Asignar repartidor
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </>
      ) : (
        <OrderDetailsSkeleton />
      )}
    </div>
  )
}

