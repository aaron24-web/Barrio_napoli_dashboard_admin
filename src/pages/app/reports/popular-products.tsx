import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function PopularProducts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Productos Más Vendidos</CardTitle>
      </CardHeader>
      <CardContent>
        {/* List or table for popular products */}
        <p>Aquí irá la lista de productos más vendidos.</p>
      </CardContent>
    </Card>
  )
}
