import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Helmet } from 'react-helmet-async'
import { z } from 'zod'

import { ImageUploader } from '@/components/image-uploader'
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
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

const initialAddons = [
  {
    id: 1,
    name: 'Queso Extra',
    price: 10,
    availability: true,
    category: 'Pizzas',
    imageUrl: 'https://via.placeholder.com/150/FBC02D/000000?Text=Queso',
  },
  {
    id: 2,
    name: 'Peperoni',
    price: 15,
    availability: true,
    category: 'Pizzas',
    imageUrl: 'https://via.placeholder.com/150/D32F2F/FFFFFF?Text=Peperoni',
  },
]

const initialCategories = ['Pizzas', 'Bebidas', 'Postres']

const addonFormSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  price: z.coerce.number().min(0, 'El precio debe ser un número positivo.'),
  category: z.string(),
  image: z.instanceof(File).optional(),
})

type AddonFormValues = z.infer<typeof addonFormSchema>

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

  function handleAddonSubmit(data: any) {
    if (editingAddon) {
      const imageUrl = data.image
        ? URL.createObjectURL(data.image)
        : editingAddon.imageUrl
      setAddons(
        addons.map((a) =>
          a.id === editingAddon.id
            ? { ...editingAddon, ...data, imageUrl }
            : a,
        ),
      )
    } else {
      const imageUrl = data.image ? URL.createObjectURL(data.image) : null
      setAddons([
        ...addons,
        { ...data, id: addons.length + 1, availability: true, imageUrl },
      ])
    }
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
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              if (!open) setEditingAddon(null)
              setIsDialogOpen(open)
            }}
          >
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
                key={editingAddon?.id || 'new'}
                addon={editingAddon}
                onSubmit={handleAddonSubmit}
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
                <TableHead className="w-24">Imagen</TableHead>
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
                  <TableCell>
                    {addon.imageUrl && (
                      <img
                        src={addon.imageUrl}
                        alt={addon.name}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                    )}
                  </TableCell>
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
  const form = useForm<AddonFormValues>({
    resolver: zodResolver(addonFormSchema),
    defaultValues: {
      name: addon?.name || '',
      price: addon?.price || 0,
      category: addon?.category || categories[0],
    },
  })

  function handleFormSubmit(data: AddonFormValues) {
    onSubmit(data)
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
                  initialImageUrl={addon?.imageUrl}
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
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría a la que pertenece</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
