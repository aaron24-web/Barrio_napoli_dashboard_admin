import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ShippingSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración de Envío</CardTitle>
        <CardDescription>
          Defina el radio de cobertura y las tarifas de envío.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="coverage-radius">Radio de Cobertura (km)</Label>
          <Input id="coverage-radius" type="number" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fixed-rate">Tarifa de Envío Fija</Label>
          <Input id="fixed-rate" type="number" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="variable-rate">Tarifa Variable por Km</Label>
          <Input id="variable-rate" type="number" />
        </div>
      </CardContent>
    </Card>
  );
}
