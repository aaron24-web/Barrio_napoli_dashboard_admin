import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AvailabilityControl() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Control de Disponibilidad</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Activar o desactivar productos con un simple interruptor (toggle).</p>
      </CardContent>
    </Card>
  )
}
