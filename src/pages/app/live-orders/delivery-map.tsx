import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function DeliveryMap() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Mapa de Repartidores Activos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-[400px] items-center justify-center rounded-md bg-muted">
          <p className="text-muted-foreground">Mapa de repartidores en tiempo real (próximamente)</p>
        </div>
      </CardContent>
    </Card>
  )
}
