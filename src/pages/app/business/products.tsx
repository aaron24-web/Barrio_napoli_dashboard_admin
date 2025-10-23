import { Helmet } from 'react-helmet-async'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState, useEffect } from 'react'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pagination } from '@/components/pagination'
import { Checkbox } from '@/components/ui/checkbox'

const initialCategories = ['Pizzas', 'Bebidas', 'Postres']

const initialAddons = [
  { id: 1, name: 'Queso Extra', price: 10, availability: true, category: 'Pizzas' },
  { id: 2, name: 'Peperoni', price: 15, availability: true, category: 'Pizzas' },
  { id: 3, name: 'Masa Delgada', price: 0, availability: false, category: 'Pizzas' },
  { id: 4, name: 'Hielo', price: 2, availability: true, category: 'Bebidas' },
]

const productsData = [
  { id: 1, name: 'Pizza Napolitana', price: 150, availability: true, category: 'Pizzas', addons: [1, 2] },
  { id: 2, name: 'Pizza Diavola', price: 160, availability: true, category: 'Pizzas', addons: [1, 2] },
  { id: 3, name: 'Pizza Margherita', price: 140, availability: false, category: 'Pizzas', addons: [1] },
  { id: 4, name: 'Coca-Cola', price: 20, availability: true, category: 'Bebidas', addons: [4] },
  { id: 5, name: 'Tiramisú', price: 50, availability: true, category: 'Postres', addons: [] },
]

export function Products() {
  const [products, setProducts] = useState(productsData)
  const [categories, setCategories] = useState(() => {
    const storedCategories = localStorage.getItem('categories')
    return storedCategories ? JSON.parse(storedCategories).map(c => c.name) : initialCategories
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
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter(p => availabilityFilter === 'all' || (availabilityFilter === 'available' && p.availability) || (availabilityFilter === 'unavailable' && !p.availability))

  const paginatedProducts = filteredProducts.slice((page - 1) * productsPerPage, page * productsPerPage)

  function handleCreateProduct(newProduct: any) {
    setProducts([...products, { ...newProduct, id: products.length + 1 }])
    setIsDialogOpen(false)
  }

  function handleUpdateProduct(updatedProduct: any) {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p))
    setEditingProduct(null)
    setIsDialogOpen(false)
  }

  function handleDeleteProduct(id: number) {
    setProducts(products.filter(p => p.id !== id))
  }

  function handleAvailabilityChange(id: number, availability: boolean) {
    setProducts(products.map(p => p.id === id ? { ...p, availability } : p))
  }

  return (
    <>
      <Helmet title="Productos" />
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Productos</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingProduct(null)}>Crear Producto</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Editar Producto' : 'Crear Producto'}</DialogTitle>
              </DialogHeader>
              <ProductForm
                product={editingProduct}
                onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
                onCancel={() => setIsDialogOpen(false)}
                categories={categories}
                addons={addons}
              />
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center gap-2">
          <Input placeholder="Buscar productos..." value={search} onChange={e => setSearch(e.target.value)} />
          <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
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
              {paginatedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <Switch
                      checked={product.availability}
                      onCheckedChange={(checked) => handleAvailabilityChange(product.id, checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => { setEditingProduct(product); setIsDialogOpen(true); }}>Editar</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">Eliminar</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. El producto se eliminará permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>Eliminar</AlertDialogAction>
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
  const [name, setName] = useState(product?.name || '')
  const [price, setPrice] = useState(product?.price || '')
  const [category, setCategory] = useState(product?.category || categories[0])
  const [selectedAddons, setSelectedAddons] = useState<number[]>(product?.addons || [])

  const availableAddons = addons.filter(a => a.category === category)

  function handleAddonToggle(addonId: number) {
    setSelectedAddons(prev => prev.includes(addonId) ? prev.filter(id => id !== addonId) : [...prev, addonId])
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({ id: product?.id, name, price: parseInt(price), category, availability: product?.availability || false, addons: selectedAddons })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="price">Precio</Label>
        <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="category">Categoría</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Complementos</Label>
        <div className="space-y-2">
          {availableAddons.map(addon => (
            <div key={addon.id} className="flex items-center space-x-2">
              <Checkbox
                id={`addon-${addon.id}`}
                checked={selectedAddons.includes(addon.id)}
                onCheckedChange={() => handleAddonToggle(addon.id)}
              />
              <label htmlFor={`addon-${addon.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {addon.name} (+${addon.price})
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  )
}
