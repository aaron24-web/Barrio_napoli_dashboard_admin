import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { MultiSelect, MultiSelectOption } from '@/components/ui/multi-select'
import { useState, memo } from 'react'

function PromotionFormComponent({ promotion, onSubmit, onCancel, productOptions }) {
  const [name, setName] = useState(promotion?.name || '')
  const [description, setDescription] = useState(promotion?.description || '')
  const [type, setType] = useState(promotion?.type || 'Oferta Especial')
  const [conditions, setConditions] = useState(promotion?.conditions || '')
  const [dateRange, setDateRange] = useState<any>({ from: promotion?.startDate, to: promotion?.endDate })
  const [selectedProducts, setSelectedProducts] = useState<string[]>(promotion?.products?.map(p => p.toString()) || [])
  const [discount, setDiscount] = useState(promotion?.discount || '')

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({ id: promotion?.id, name, description, type, conditions, startDate: dateRange.from, endDate: dateRange.to, availability: promotion?.availability || false, products: selectedProducts.map(p => parseInt(p)), discount: type === 'Descuento' ? parseInt(discount) : undefined })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="description">Descripción</Label>
        <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="type">Tipo</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Oferta Especial">Oferta Especial</SelectItem>
            <SelectItem value="Combo">Combo</SelectItem>
            <SelectItem value="Cupón">Cupón</SelectItem>
            <SelectItem value="Descuento">Descuento</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {type === 'Descuento' && (
        <div>
          <Label htmlFor="discount">Porcentaje de Descuento</Label>
          <Input id="discount" type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} />
        </div>
      )}
      <div>
        <Label>Productos</Label>
        <MultiSelect
          options={productOptions}
          selected={selectedProducts}
          onChange={setSelectedProducts}
        />
      </div>
      <div>
        <Label htmlFor="conditions">Condiciones</Label>
        <Input id="conditions" value={conditions} onChange={(e) => setConditions(e.target.value)} />
      </div>
      <div>
        <Label>Duración</Label>
        <DateRangePicker date={dateRange} onDateChange={setDateRange} />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  )
}

export const PromotionForm = memo(PromotionFormComponent)
