import { useState } from 'react'
import { Helmet } from 'react-helmet-async'

import { Pagination } from '@/shared/ui/pagination'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/alert-dialog'
import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { Switch } from '@/shared/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table'

import { PromotionForm } from './promotion-form'

const promotionsData = []
const initialProducts = []

export function Promotions() {
  const [promotions, setPromotions] = useState(promotionsData)
  const [products] = useState(initialProducts)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState<any | null>(null)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [page, setPage] = useState(1)
  const promotionsPerPage = 10

  const filteredPromotions = promotions
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => typeFilter === 'all' || p.type === typeFilter)

  const paginatedPromotions = filteredPromotions.slice(
    (page - 1) * promotionsPerPage,
    page * promotionsPerPage,
  )

  function handlePromotionSubmit(data: any) {
    if (editingPromotion) {
      const imageUrl = data.image
        ? URL.createObjectURL(data.image)
        : editingPromotion.imageUrl
      setPromotions(
        promotions.map((p) =>
          p.id === editingPromotion.id
            ? { ...editingPromotion, ...data, imageUrl }
            : p,
        ),
      )
    } else {
      const imageUrl = data.image ? URL.createObjectURL(data.image) : null
      setPromotions([
        ...promotions,
        { ...data, id: promotions.length + 1, availability: true, imageUrl },
      ])
    }
    setEditingPromotion(null)
    setIsDialogOpen(false)
  }

  function handleDeletePromotion(id: number) {
    setPromotions(promotions.filter((p) => p.id !== id))
  }

  function handleAvailabilityChange(id: number, availability: boolean) {
    setPromotions(
      promotions.map((p) => (p.id === id ? { ...p, availability } : p)),
    )
  }

  const productOptions = products.map((p) => ({
    value: p.id.toString(),
    label: p.name,
  }))

  return (
    <>
      <Helmet title="Promociones" />
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Gestión de Promociones
          </h1>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              if (!open) setEditingPromotion(null)
              setIsDialogOpen(open)
            }}
          >
            <DialogTrigger asChild>
              <Button onClick={() => setEditingPromotion(null)}>
                Crear Promoción
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>
                  {editingPromotion ? 'Editar Promoción' : 'Crear Promoción'}
                </DialogTitle>
              </DialogHeader>
              <PromotionForm
                key={editingPromotion?.id || 'new'}
                promotion={editingPromotion}
                onSubmit={handlePromotionSubmit}
                onCancel={() => setIsDialogOpen(false)}
                productOptions={productOptions}
              />
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Buscar promociones..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Oferta Especial">Oferta Especial</SelectItem>
              <SelectItem value="Combo">Combo</SelectItem>
              <SelectItem value="Cupón">Cupón</SelectItem>
              <SelectItem value="Descuento">Descuento</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Imagen</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead>Disponibilidad</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPromotions.map((promotion) => (
                <TableRow key={promotion.id}>
                  <TableCell>
                    {promotion.imageUrl && (
                      <img
                        src={promotion.imageUrl}
                        alt={promotion.name}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                    )}
                  </TableCell>
                  <TableCell>{promotion.name}</TableCell>
                  <TableCell>{promotion.code || 'N/A'}</TableCell>
                  <TableCell>{promotion.type}</TableCell>
                  <TableCell>{`${promotion.startDate.toLocaleDateString()} - ${promotion.endDate.toLocaleDateString()}`}</TableCell>
                  <TableCell>
                    <Switch
                      checked={promotion.availability}
                      onCheckedChange={(checked) =>
                        handleAvailabilityChange(promotion.id, checked)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={() => {
                        setEditingPromotion(promotion)
                        setIsDialogOpen(true)
                      }}
                    >
                      Editar
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          Eliminar
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. La promoción se
                            eliminará permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeletePromotion(promotion.id)}
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Pagination
          pageIndex={page - 1}
          totalCount={filteredPromotions.length}
          perPage={promotionsPerPage}
          onPageChange={(page) => setPage(page + 1)}
        />
      </div>
    </>
  )
}
