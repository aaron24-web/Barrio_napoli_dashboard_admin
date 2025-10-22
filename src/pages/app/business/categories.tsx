import { Helmet } from 'react-helmet-async'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState, useEffect } from 'react'

const initialCategories = [
  { id: 1, name: 'Pizzas' },
  { id: 2, name: 'Bebidas' },
  { id: 3, name: 'Postres' },
]

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

  function handleCreateCategory(newCategory: any) {
    setCategories([...categories, { ...newCategory, id: categories.length + 1 }])
    setIsDialogOpen(false)
  }

  function handleUpdateCategory(updatedCategory: any) {
    setCategories(categories.map(c => c.id === updatedCategory.id ? updatedCategory : c))
    setEditingCategory(null)
    setIsDialogOpen(false)
  }

  function handleDeleteCategory(id: number) {
    setCategories(categories.filter(c => c.id !== id))
  }

  return (
    <>
      <Helmet title="Categorías" />
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Categorías</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingCategory(null)}>Crear Categoría</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCategory ? 'Editar Categoría' : 'Crear Categoría'}</DialogTitle>
              </DialogHeader>
              <CategoryForm
                category={editingCategory}
                onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
                onCancel={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => { setEditingCategory(category); setIsDialogOpen(true); }}>Editar</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">Eliminar</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. La categoría se eliminará permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteCategory(category.id)}>Eliminar</AlertDialogAction>
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
  const [name, setName] = useState(category?.name || '')

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({ id: category?.id, name })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  )
}
