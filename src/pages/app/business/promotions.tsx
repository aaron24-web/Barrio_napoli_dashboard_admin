import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'

import { Pagination } from '@/components/pagination'
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
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { PromotionForm } from './promotion-form'

const promotionsData = [
  {
    id: 1,
    name: 'Pizza 2x1',
    description: 'Compra una pizza y llévate la segunda gratis',
    type: 'Oferta Especial',
    conditions: 'Aplica solo en pizzas seleccionadas',
    startDate: new Date(2024, 10, 1),
    endDate: new Date(2024, 10, 15),
    availability: true,
    products: [1, 2],
  },
  {
    id: 2,
    name: 'Combo Amigos',
    description: '2 pizzas grandes + 1 refresco de 2L',
    type: 'Combo',
    conditions: 'No aplica con otras promociones',
    startDate: new Date(2024, 10, 1),
    endDate: new Date(2024, 10, 31),
    availability: true,
    products: [1, 2, 4],
  },
  {
    id: 3,
    name: 'DTO10',
    description: '10% de descuento en tu compra total',
    type: 'Cupón',
    conditions: 'Válido solo en compras mayores a $200',
    startDate: new Date(2024, 11, 1),
    endDate: new Date(2024, 11, 31),
    availability: false,
    products: [],
  },
  {
    id: 4,
    name: '20% en Pizzas',
    description: '20% de descuento en todas las pizzas',
    type: 'Descuento',
    conditions: 'No aplica con otras promociones',
    startDate: new Date(2024, 11, 1),
    endDate: new Date(2024, 11, 15),
    availability: true,
    products: [1, 2, 3],
    discount: 20,
  },
]

const initialProducts = [
  {
    id: 1,
    name: 'Pizza Napolitana',
    price: 150,
    availability: true,
    category: 'Pizzas',
    addons: [1, 2],
  },
  {
    id: 2,
    name: 'Pizza Diavola',
    price: 160,
    availability: true,
    category: 'Pizzas',
    addons: [1, 2],
  },
  {
    id: 3,
    name: 'Pizza Margherita',
    price: 140,
    availability: false,
    category: 'Pizzas',
    addons: [1],
  },
  {
    id: 4,
    name: 'Coca-Cola',
    price: 20,
    availability: true,
    category: 'Bebidas',
    addons: [4],
  },
  {
    id: 5,
    name: 'Tiramisú',
    price: 50,
    availability: true,
    category: 'Postres',
    addons: [],
  },
]

export function Promotions() {
  const [promotions, setPromotions] = useState(promotionsData)
  const [products, setProducts] = useState(() => {
    const storedProducts = localStorage.getItem('products')
    return storedProducts ? JSON.parse(storedProducts) : initialProducts
  })
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

  function handleCreatePromotion(newPromotion: any) {
    setPromotions([
      ...promotions,
      { ...newPromotion, id: promotions.length + 1 },
    ])
    setIsDialogOpen(false)
  }

  function handleUpdatePromotion(updatedPromotion: any) {
    setPromotions(
      promotions.map((p) =>
        p.id === updatedPromotion.id ? updatedPromotion : p,
      ),
    )
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                promotion={editingPromotion}
                onSubmit={
                  editingPromotion
                    ? handleUpdatePromotion
                    : handleCreatePromotion
                }
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
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead>Disponibilidad</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPromotions.map((promotion) => (
                <TableRow key={promotion.id}>
                  <TableCell>{promotion.name}</TableCell>
                  <TableCell>{promotion.description}</TableCell>
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
