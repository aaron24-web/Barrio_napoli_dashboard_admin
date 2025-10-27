import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { assignDeliveryMan } from '@/api/assign-delivery-man'
import { getDeliveryMen } from '@/api/get-delivery-men'
import { GetOrderDetailsResponse } from '@/api/get-order-details'
import { OrderStatus } from '@/components/order-status'
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
import { queryClient } from '@/lib/react-query'

import { OrderDetailsSkeleton } from './order-details-skeleton'

export interface OrderDetailsProps {
  order: GetOrderDetailsResponse
}

const assignDeliveryManSchema = z.object({
  deliveryManId: z.string().nullable(),
})

type AssignDeliveryManSchema = z.infer<typeof assignDeliveryManSchema>

export function OrderDetails({ order }: OrderDetailsProps) {
  const { data: deliveryMen } = useQuery({
    queryKey: ['delivery-men'],
    queryFn: getDeliveryMen,
  })

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<AssignDeliveryManSchema>({
    resolver: zodResolver(assignDeliveryManSchema),
    defaultValues: {
      deliveryManId: order.deliveryMan?.id ?? null,
    },
  })

  const { mutateAsync: assignDeliveryManFn } = useMutation({
    mutationFn: assignDeliveryMan,
    async onSuccess(_, { orderId }) {
      queryClient.invalidateQueries({
        queryKey: ['orders'],
      })
      queryClient.invalidateQueries({
        queryKey: ['order-details', orderId],
      })
    },
  })

  async function handleAssignDeliveryMan(data: AssignDeliveryManSchema) {
    if (!data.deliveryManId) {
      return
    }

    await assignDeliveryManFn({
      orderId: order.id,
      deliveryManId: data.deliveryManId,
    })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Pedido: {order.id}</h2>
      {order ? (
        <div className="space-y-6">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="text-muted-foreground">Estado</TableCell>
                <TableCell className="flex justify-end">
                  <OrderStatus status={order.status} />
                </TableCell>
              </TableRow>
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
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>{item.product.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.product.description}
                      </div>
                      {item.product.notes && (
                        <div className="text-xs text-muted-foreground">
                          Observaciones: {item.product.notes}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      {(item.priceInCents / 100).toLocaleString('es-MX', {
                        style: 'currency',
                        currency: 'MXN',
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      {(
                        (item.priceInCents * item.quantity) /
                        100
                      ).toLocaleString('es-MX', {
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

          {['accepted', 'processing', 'delivering'].includes(order.status) && (
            <form onSubmit={handleSubmit(handleAssignDeliveryMan)}>
              <div className="space-y-3">
                <h2 className="text-lg font-semibold">
                  Asignar repartidor
                </h2>
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
      ) : (
        <OrderDetailsSkeleton />
      )}
    </div>
  )
}
