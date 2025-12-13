import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Helmet } from 'react-helmet-async'
import { z } from 'zod'

import { ImageUploader } from '@/features/image-uploader/ui/image-uploader'
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
import { Checkbox } from '@/shared/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Pagination } from '@/shared/ui/pagination'
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

// Mock data (manteniendo la estructura existente)
const initialCategories = []
const initialAddons = []
const productsData = []

const productFormSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  price: z.coerce.number().min(0, 'El precio debe ser un número positivo.'),
  category: z.string(),
  addons: z.array(z.number()).optional(),
  image: z.instanceof(File).optional(),
})

type ProductFormValues = z.infer<typeof productFormSchema>

export function Products() {
  const [products, setProducts] = useState(productsData)
  const [categories, setCategories] = useState(() => {
    const storedCategories = localStorage.getItem('categories')
    return storedCategories
      ? JSON.parse(storedCategories).map((c) => c.name)
      : initialCategories
  })
  const [addons, setAddons] = useState(() => {
    const storedAddons = localStorage.getItem('addons')
    return storedAddons ? JSON.parse(storedAddons) : initialAddons
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any | null>(null)
  const [search, setSearch] = useState('')
  const [availabilityFilter, setAvailabilityFilter] = useState('all')
  const [page, setPage] = useState(1)
  const productsPerPage = 10

  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter(
      (p) =>
        availabilityFilter === 'all' ||
        (availabilityFilter === 'available' && p.availability) ||
        (availabilityFilter === 'unavailable' && !p.availability),
    )

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage,
  )

  function handleProductSubmit(data: any) {
    if (editingProduct) {
      // Lógica de actualización
      const imageUrl = data.image
        ? URL.createObjectURL(data.image)
        : editingProduct.imageUrl
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? { ...editingProduct, ...data, imageUrl }
            : p,
        ),
      )
    } else {
      // Lógica de creación
      const imageUrl = data.image ? URL.createObjectURL(data.image) : null
      setProducts([
        ...products,
        {
          ...data,
          id: products.length + 1,
          availability: true,
          imageUrl,
        },
      ])
    }
    setEditingProduct(null)
    setIsDialogOpen(false)
  }

  function handleDeleteProduct(id: number) {
    setProducts(products.filter((p) => p.id !== id))
  }

  function handleAvailabilityChange(id: number, availability: boolean) {
    setProducts(products.map((p) => (p.id === id ? { ...p, availability } : p)))
  }

  return (
    <>
      <Helmet title="Productos" />
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Gestión de Productos
          </h1>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              if (!open) setEditingProduct(null)
              setIsDialogOpen(open)
            }}
          >
            <DialogTrigger asChild>
              <Button onClick={() => setEditingProduct(null)}>
                Crear Producto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Editar Producto' : 'Crear Producto'}
                </DialogTitle>
              </DialogHeader>
              <ProductForm
                key={editingProduct?.id || 'new'}
                product={editingProduct}
                onSubmit={handleProductSubmit}
                onCancel={() => setIsDialogOpen(false)}
                categories={categories}
                addons={addons}
              />
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Buscar productos..."
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
              {paginatedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                    )}
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <Switch
                      checked={product.availability}
                      onCheckedChange={(checked) =>
                        handleAvailabilityChange(product.id, checked)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={() => {
                        setEditingProduct(product)
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
                            Esta acción no se puede deshacer. El producto se
                            eliminará permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteProduct(product.id)}
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
          totalCount={filteredProducts.length}
          perPage={productsPerPage}
          onPageChange={(page) => setPage(page + 1)}
        />
      </div>
    </>
  )
}

function ProductForm({ product, onSubmit, onCancel, categories, addons }) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name || '',
      price: product?.price || 0,
      category: product?.category || categories[0],
      addons: product?.addons || [],
    },
  })

  const selectedCategory = form.watch('category')
  const availableAddons = addons.filter((a) => a.category === selectedCategory)

  function handleFormSubmit(data: ProductFormValues) {
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
                  initialImageUrl={product?.imageUrl}
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
              <FormLabel>Categoría</FormLabel>
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

        <FormField
          control={form.control}
          name="addons"
          render={() => (
            <FormItem>
              <FormLabel>Complementos</FormLabel>
              <div className="space-y-2">
                {availableAddons.map((addon) => (
                  <FormField
                    key={addon.id}
                    control={form.control}
                    name="addons"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(addon.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...(field.value || []),
                                      addon.id,
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== addon.id,
                                      ),
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {addon.name} (+${addon.price})
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
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
