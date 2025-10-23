import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'

export function SalesReport() {
  const navigate = useNavigate()

  // Simulated data
  const dailyRevenue = 1250.75
  const weeklyRevenue = 8500.50
  const monthlyRevenue = 32100.25

  return (
    <Card className="cursor-pointer" onClick={() => navigate('/reports/sales')}>
      <CardHeader>
        <CardTitle>Reporte de Ventas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Ventas del día:</p>
          <p className="text-lg font-bold">
            {dailyRevenue.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Ventas de la semana:</p>
          <p className="text-lg font-bold">
            {weeklyRevenue.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Ventas del mes:</p>
          <p className="text-lg font-bold">
            {monthlyRevenue.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
