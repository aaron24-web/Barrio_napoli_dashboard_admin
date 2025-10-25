import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function BillingSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración de Cobro</CardTitle>
        <CardDescription>
          Active o desactive métodos de pago y defina los datos bancarios.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Métodos de Pago</Label>
          <div className="flex items-center space-x-2">
            <Checkbox id="credit-card" />
            <Label htmlFor="credit-card">Tarjeta de Crédito</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="debit-card" />
            <Label htmlFor="debit-card">Tarjeta de Débito</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="cash" />
            <Label htmlFor="cash">Efectivo</Label>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="clabe">Conta CLABE</Label>
          <Input id="clabe" type="text" />
        </div>
      </CardContent>
    </Card>
  )
}
