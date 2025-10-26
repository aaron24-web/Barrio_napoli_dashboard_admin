import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface DeliveryMan {
  id: string
  name: string
  phone: string
  status: 'active' | 'inactive'
}

const createDeliveryManFormSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  phone: z.string().min(1, 'El teléfono es obligatorio'),
})

type CreateDeliveryManForm = z.infer<typeof createDeliveryManFormSchema>

interface CreateDeliveryManProps {
  onCreate: (deliveryMan: { name: string; phone: string; status?: 'active' | 'inactive' }) => void
  initialData?: DeliveryMan
}

export function CreateDeliveryMan({ onCreate, initialData }: CreateDeliveryManProps) {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<CreateDeliveryManForm>({
    resolver: zodResolver(createDeliveryManFormSchema),
  })

  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name)
      setValue('phone', initialData.phone)
    }
  }, [initialData, setValue])

  function onSubmit(data: CreateDeliveryManForm) {
    onCreate({
      name: data.name,
      phone: data.phone,
      status: initialData?.status || 'active', // Default to active if not editing
    })
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" {...register('name')} />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono</Label>
        <Input id="phone" type="tel" {...register('phone')} />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
      </div>
      <Button type="submit" className="w-full">{initialData ? 'Guardar Cambios' : 'Agregar Repartidor'}</Button>
    </form>
  )
}
