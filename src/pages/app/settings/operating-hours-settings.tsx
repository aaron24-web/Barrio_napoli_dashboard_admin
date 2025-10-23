import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export function OperatingHoursSettings() {
  const daysOfWeek = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ];

  const [dayEnabled, setDayEnabled] = useState<Record<string, boolean>>(
    daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: true }), {})
  );

  const handleToggleDay = (day: string) => {
    setDayEnabled((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Horario de Operación</CardTitle>
        <CardDescription>
          Define los horarios de apertura y cierre para cada día de la semana.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {daysOfWeek.map((day) => (
          <div key={day} className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`enable-${day.toLowerCase()}`}
                checked={dayEnabled[day]}
                onCheckedChange={() => handleToggleDay(day)}
              />
              <Label htmlFor={`enable-${day.toLowerCase()}`}>{day}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                id={`${day.toLowerCase()}-open`}
                type="time"
                defaultValue="09:00"
                disabled={!dayEnabled[day]}
              />
              <span>-</span>
              <Input
                id={`${day.toLowerCase()}-close`}
                type="time"
                defaultValue="22:00"
                disabled={!dayEnabled[day]}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
