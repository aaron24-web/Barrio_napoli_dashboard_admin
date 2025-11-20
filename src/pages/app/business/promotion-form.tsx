import { zodResolver } from '@hookform/resolvers/zod'
import { memo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { DateRange } from 'react-day-picker'

import { ImageUploader } from '@/components/image-uploader'
import { Button } from '@/components/ui/button'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { MultiSelect } from '@/components/ui/multi-select'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const promotionFormSchema = z
  .object({
    name: z.string().min(3, 'El nombre es requerido.'),
    description: z.string().optional(),
    type: z.string(),
    code: z.string().optional(),
    discount: z.coerce.number().optional(),
    products: z.array(z.string()),
    conditions: z.string().optional(),
    dateRange: z
      .object({
        from: z.date().optional(),
        to: z.date().optional(),
      })
      .optional(),
    image: z.instanceof(File).optional(),
  })
  .refine(
    (data) => {
      if (data.type === 'Cupón' && (!data.code || data.code.length < 3)) {
        return false
      }
      return true
    },
    {
      message: 'El código es requerido para los cupones (mín. 3 caracteres).',
      path: ['code'],
    },
  )

type PromotionFormValues = z.infer<typeof promotionFormSchema>

function PromotionFormComponent({
  promotion,
  onSubmit,
  onCancel,
  productOptions,
}) {
  const form = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionFormSchema),
    defaultValues: {
      name: promotion?.name || '',
      description: promotion?.description || '',
      type: promotion?.type || 'Oferta Especial',
      code: promotion?.code || '',
      discount: promotion?.discount || undefined,
      products: promotion?.products?.map(String) || [],
      conditions: promotion?.conditions || '',
      dateRange: {
        from: promotion?.startDate ? new Date(promotion.startDate) : undefined,
        to: promotion?.endDate ? new Date(promotion.endDate) : undefined,
      },
    },
  })

  const type = form.watch('type')

  function handleFormSubmit(data: PromotionFormValues) {
    onSubmit({
      id: promotion?.id,
      ...data,
      startDate: data.dateRange?.from,
      endDate: data.dateRange?.to,
      availability: promotion?.availability || false,
      products: data.products.map(Number),
    })
  }

  function generateCouponCode() {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase()
    form.setValue('code', code)
  }

  // Handler explícito para MultiSelect
  function handleProductChange(selectedProducts: string[]) {
    form.setValue('products', selectedProducts)
  }

  // Handler explícito para DateRangePicker
  function handleDateChange(dateRange: DateRange | undefined) {
    form.setValue('dateRange', dateRange)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ImageUploader
                  onFileSelected={(file) => field.onChange(file)}
                  initialImageUrl={promotion?.imageUrl}
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Oferta Especial">Oferta Especial</SelectItem>
                  <SelectItem value="Combo">Combo</SelectItem>
                  <SelectItem value="Cupón">Cupón</SelectItem>
                  <SelectItem value="Descuento">Descuento</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {type === 'Cupón' && (
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código del Cupón</FormLabel>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={generateCouponCode}
                  >
                    Generar
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {type === 'Descuento' && (
          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Porcentaje de Descuento</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="products"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Productos</FormLabel>
              <FormControl>
                <MultiSelect
                  options={productOptions}
                  selected={field.value}
                  onChange={handleProductChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="conditions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Condiciones</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateRange"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duración</FormLabel>
              <FormControl>
                <DateRangePicker
                  date={field.value}
                  onDateChange={handleDateChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Guardar</Button>
        </div>
      </form>
    </Form>
  )
}

export const PromotionForm = memo(PromotionFormComponent)
