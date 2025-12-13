import { type DeliveryPerson } from '@/entities/delivery/model/delivery.model'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'

interface DeliveryPersonInfoProps {
  person: DeliveryPerson | null
}

export function DeliveryPersonInfo({ person }: DeliveryPersonInfoProps) {
  if (!person) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Asignar Repartidor</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-4 text-center text-muted-foreground">
          Selecciona un repartidor para ver su información.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asignar Repartidor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>
          <span className="font-semibold">Nombre:</span> {person.name}
        </p>
        <p>
          <span className="font-semibold">Vehículo:</span> {person.vehicle}
        </p>
        <p>
          <span className="font-semibold">Pedido:</span> {person.orderId}
        </p>
        <p>
          <span className="font-semibold">Dirección:</span> {person.address}
        </p>
      </CardContent>
    </Card>
  )
}
