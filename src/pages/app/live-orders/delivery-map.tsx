import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bike } from 'lucide-react'
import { DeliveryPerson } from '../dashboard/dashboard'

interface DeliveryMapProps {
  onSelectDeliveryPerson: (person: DeliveryPerson) => void
}

const deliveryPeople: DeliveryPerson[] = [
  {
    id: '1',
    name: 'Juan Perez',
    vehicle: 'Motocicleta',
    orderId: 'order-1',
    address: 'Calle Falsa 123',
  },
  {
    id: '2',
    name: 'Maria Rodriguez',
    vehicle: 'Bicicleta',
    orderId: 'order-2',
    address: 'Avenida Siempreviva 742',
  },
  {
    id: '3',
    name: 'Pedro Gomez',
    vehicle: 'Automóvil',
    orderId: 'order-3',
    address: 'Boulevard de los Sueños Rotos',
  },
]

export function DeliveryMap({ onSelectDeliveryPerson }: DeliveryMapProps) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Mapa de Repartidores Activos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[400px] w-full rounded-md bg-muted">
          <img
            src="/maps.png"
            alt="Mapa de la ciudad"
            className="h-full w-full object-cover"
          />
          <div
            className="absolute cursor-pointer" style={{ top: '10%', left: '20%' }}
            onClick={() => onSelectDeliveryPerson(deliveryPeople[0])}
          >
            <Bike className="h-6 w-6 text-blue-500" />
          </div>
          <div
            className="absolute cursor-pointer" style={{ top: '50%', left: '60%' }}
            onClick={() => onSelectDeliveryPerson(deliveryPeople[1])}
          >
            <Bike className="h-6 w-6 text-red-500" />
          </div>
          <div
            className="absolute cursor-pointer" style={{ top: '80%', left: '30%' }}
            onClick={() => onSelectDeliveryPerson(deliveryPeople[2])}
          >
            <Bike className="h-6 w-6 text-green-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
