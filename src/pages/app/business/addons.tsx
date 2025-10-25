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
import { Label } from '@/components/ui/label'
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

const initialAddons = [
  {
    id: 1,
    name: 'Queso Extra',
    price: 10,
    availability: true,
    category: 'Pizzas',
  },
  {
    id: 2,
    name: 'Peperoni',
    price: 15,
    availability: true,
    category: 'Pizzas',
  },
  {
    id: 3,
    name: 'Masa Delgada',
    price: 0,
    availability: false,
    category: 'Pizzas',
  },
  { id: 4, name: 'Hielo', price: 2, availability: true, category: 'Bebidas' },
]

const initialCategories = ['Pizzas', 'Bebidas', 'Postres']

export function Addons() {
  const [addons, setAddons] = useState(() => {
    const storedAddons = localStorage.getItem('addons')
    return storedAddons ? JSON.parse(storedAddons) : initialAddons
  })
  const [categories, setCategories] = useState(() => {
    const storedCategories = localStorage.getItem('categories')
    return storedCategories
      ? JSON.parse(storedCategories).map((c) => c.name)
      : initialCategories
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAddon, setEditingAddon] = useState<any | null>(null)
  const [search, setSearch] = useState('')
  const [availabilityFilter, setAvailabilityFilter] = useState('all')
  const [page, setPage] = useState(1)
  const addonsPerPage = 10

  useEffect(() => {
    localStorage.setItem('addons', JSON.stringify(addons))
  }, [addons])

  const filteredAddons = addons
    .filter((a) => a.name.toLowerCase().includes(search.toLowerCase()))
    .filter(
      (a) =>
        availabilityFilter === 'all' ||
        (availabilityFilter === 'available' && a.availability) ||
        (availabilityFilter === 'unavailable' && !a.availability),
    )

  const paginatedAddons = filteredAddons.slice(
    (page - 1) * addonsPerPage,
    page * addonsPerPage,
  )

  function handleCreateAddon(newAddon: any) {
    setAddons([...addons, { ...newAddon, id: addons.length + 1 }])
    setIsDialogOpen(false)
  }

  function handleUpdateAddon(updatedAddon: any) {
    setAddons(addons.map((a) => (a.id === updatedAddon.id ? updatedAddon : a)))
    setEditingAddon(null)
    setIsDialogOpen(false)
  }

  function handleDeleteAddon(id: number) {
    setAddons(addons.filter((a) => a.id !== id))
  }

  function handleAvailabilityChange(id: number, availability: boolean) {
    setAddons(addons.map((a) => (a.id === id ? { ...a, availability } : a)))
  }

  return (
    <>
      <Helmet title="Complementos" />
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Gestión de Complementos
          </h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingAddon(null)}>
                Crear Complemento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingAddon ? 'Editar Complemento' : 'Crear Complemento'}
                </DialogTitle>
              </DialogHeader>
              <AddonForm
                addon={editingAddon}
                onSubmit={editingAddon ? handleUpdateAddon : handleCreateAddon}
                onCancel={() => setIsDialogOpen(false)}
                categories={categories}
              />
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Buscar complementos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            value={availabilityFilter}
            onValueChange={setAvailabilityFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="available">Disponibles</SelectItem>
              <SelectItem value="unavailable">No Disponibles</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Disponibilidad</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAddons.map((addon) => (
                <TableRow key={addon.id}>
                  <TableCell>{addon.name}</TableCell>
                  <TableCell>${addon.price}</TableCell>
                  <TableCell>{addon.category}</TableCell>
                  <TableCell>
                    <Switch
                      checked={addon.availability}
                      onCheckedChange={(checked) =>
                        handleAvailabilityChange(addon.id, checked)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={() => {
                        setEditingAddon(addon)
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
                            Esta acción no se puede deshacer. El complemento se
                            eliminará permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteAddon(addon.id)}
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
          totalCount={filteredAddons.length}
          perPage={addonsPerPage}
          onPageChange={(page) => setPage(page + 1)}
        />
      </div>
    </>
  )
}

function AddonForm({ addon, onSubmit, onCancel, categories }) {
  const [name, setName] = useState(addon?.name || '')
  const [price, setPrice] = useState(addon?.price || '')
  const [category, setCategory] = useState(addon?.category || categories[0])

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({
      id: addon?.id,
      name,
      price: parseInt(price),
      category,
      availability: addon?.availability || false,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="price">Precio</Label>
        <Input
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="category">Categoría</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  )
}
