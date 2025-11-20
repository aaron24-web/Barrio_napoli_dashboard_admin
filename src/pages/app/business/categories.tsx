import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Helmet } from 'react-helmet-async'
import { z } from 'zod'

import { ImageUploader } from '@/components/image-uploader'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const initialCategories = [
  {
    id: 1,
    name: 'Pizzas',
    imageUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?Text=Pizzas',
  },
  {
    id: 2,
    name: 'Bebidas',
    imageUrl: 'https://via.placeholder.com/150/FF0000/FFFFFF?Text=Bebidas',
  },
  {
    id: 3,
    name: 'Postres',
    imageUrl: 'https://via.placeholder.com/150/00FF00/FFFFFF?Text=Postres',
  },
]

const categoryFormSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  image: z.instanceof(File).optional(),
})

type CategoryFormValues = z.infer<typeof categoryFormSchema>

export function Categories() {
  const [categories, setCategories] = useState(() => {
    const storedCategories = localStorage.getItem('categories')
    return storedCategories ? JSON.parse(storedCategories) : initialCategories
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any | null>(null)

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories))
  }, [categories])

  function handleCategorySubmit(data: any) {
    if (editingCategory) {
      const imageUrl = data.image
        ? URL.createObjectURL(data.image)
        : editingCategory.imageUrl
      setCategories(
        categories.map((c) =>
          c.id === editingCategory.id
            ? { ...editingCategory, ...data, imageUrl }
            : c,
        ),
      )
    } else {
      const imageUrl = data.image ? URL.createObjectURL(data.image) : null
      setCategories([
        ...categories,
        { ...data, id: categories.length + 1, imageUrl },
      ])
    }
    setEditingCategory(null)
    setIsDialogOpen(false)
  }

  function handleDeleteCategory(id: number) {
    setCategories(categories.filter((c) => c.id !== id))
  }

  return (
    <>
      <Helmet title="Categorías" />
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Gestión de Categorías
          </h1>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              if (!open) setEditingCategory(null)
              setIsDialogOpen(open)
            }}
          >
            <DialogTrigger asChild>
              <Button onClick={() => setEditingCategory(null)}>
                Crear Categoría
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? 'Editar Categoría' : 'Crear Categoría'}
                </DialogTitle>
              </DialogHeader>
              <CategoryForm
                key={editingCategory?.id || 'new'}
                category={editingCategory}
                onSubmit={handleCategorySubmit}
                onCancel={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Imagen</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    {category.imageUrl && (
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                    )}
                  </TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={() => {
                        setEditingCategory(category)
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
                            Esta acción no se puede deshacer. La categoría se
                            eliminará permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteCategory(category.id)}
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
      </div>
    </>
  )
}

function CategoryForm({ category, onSubmit, onCancel }) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name || '',
    },
  })

  function handleFormSubmit(data: CategoryFormValues) {
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
                  initialImageUrl={category?.imageUrl}
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
