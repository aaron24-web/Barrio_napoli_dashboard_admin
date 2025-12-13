import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { ImageUploader } from '@/features/image-uploader/ui/image-uploader'
import { Button } from '@/shared/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import {
  CreateDeliveryManPayload,
  DeliveryMan,
} from '@/core/models/delivery.model'

const createDeliveryManFormSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  phone: z.string().min(1, 'El teléfono es obligatorio'),
  image: z.instanceof(File).optional(),
})

type CreateDeliveryManForm = z.infer<typeof createDeliveryManFormSchema>

interface CreateDeliveryManProps {
  onCreate: (deliveryMan: CreateDeliveryManPayload) => void
  initialData?: DeliveryMan | null
}

export function CreateDeliveryMan({
  onCreate,
  initialData,
}: CreateDeliveryManProps) {
  const form = useForm<CreateDeliveryManForm>({
    resolver: zodResolver(createDeliveryManFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      phone: initialData?.phone || '',
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        phone: initialData.phone,
      })
    }
  }, [initialData, form])

  function onSubmit(data: CreateDeliveryManForm) {
    onCreate(data)
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ImageUploader
                  onFileSelected={(file) => field.onChange(file)}
                  initialImageUrl={initialData?.imageUrl}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {initialData ? 'Guardar Cambios' : 'Agregar Repartidor'}
        </Button>
      </form>
    </Form>
  )
}
