import { Helmet } from 'react-helmet-async'
import { useState } from 'react'

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

import { CreateDeliveryMan } from './create-delivery-man'

interface DeliveryMan {
  id: string
  name: string
  phone: string
  status: 'active' | 'inactive'
}

const MOCK_DELIVERY_MEN: DeliveryMan[] = [
  { id: '1', name: 'Juan Pérez', phone: '555-1234', status: 'active' },
  { id: '2', name: 'María Gómez', phone: '555-5678', status: 'inactive' },
  { id: '3', name: 'Carlos Ramírez', phone: '555-9012', status: 'active' },
]

export function DeliveryMen() {
  const [deliveryMen, setDeliveryMen] = useState<DeliveryMan[]>(MOCK_DELIVERY_MEN)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDeliveryMan, setEditingDeliveryMan] = useState<DeliveryMan | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const deliveryMenPerPage = 10

  const filteredDeliveryMen = deliveryMen
    .filter((deliveryMan) =>
      deliveryMan.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter(
      (deliveryMan) =>
        statusFilter === 'all' ||
        (statusFilter === 'active' && deliveryMan.status === 'active') ||
        (statusFilter === 'inactive' && deliveryMan.status === 'inactive'),
    )

  const paginatedDeliveryMen = filteredDeliveryMen.slice(
    (page - 1) * deliveryMenPerPage,
    page * deliveryMenPerPage,
  )

  function handleCreateDeliveryMan(newDeliveryMan: Omit<DeliveryMan, 'id'>) {
    const id = String(deliveryMen.length + 1)
    setDeliveryMen((prev) => [...prev, { id, ...newDeliveryMan, status: 'active' }])
    setIsDialogOpen(false)
  }

  function handleUpdateDeliveryMan(updatedDeliveryMan: DeliveryMan) {
    setDeliveryMen(
      deliveryMen.map((dm) =>
        dm.id === updatedDeliveryMan.id ? updatedDeliveryMan : dm,
      ),
    )
    setEditingDeliveryMan(null)
    setIsDialogOpen(false)
  }

  function handleDeleteDeliveryMan(id: string) {
    setDeliveryMen(deliveryMen.filter((dm) => dm.id !== id))
  }

  function handleToggleStatus(id: string, status: boolean) {
    setDeliveryMen((prev) =>
      prev.map((deliveryMan) =>
        deliveryMan.id === id
          ? { ...deliveryMan, status: status ? 'active' : 'inactive' }
          : deliveryMan,
      ),
    )
  }

  return (
    <>
      <Helmet title="Gestión de repartidores" />
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Gestión de repartidores
          </h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingDeliveryMan(null)}>
                Agregar Repartidor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingDeliveryMan ? 'Editar Repartidor' : 'Agregar Repartidor'}
                </DialogTitle>
              </DialogHeader>
              <CreateDeliveryMan
                onCreate={
                  editingDeliveryMan ? handleUpdateDeliveryMan : handleCreateDeliveryMan
                }
                initialData={editingDeliveryMan}
              />
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Buscar repartidor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedDeliveryMen.map((deliveryMan) => (
                <TableRow key={deliveryMan.id}>
                  <TableCell>{deliveryMan.name}</TableCell>
                  <TableCell>{deliveryMan.phone}</TableCell>
                  <TableCell>
                    <Switch
                      checked={deliveryMan.status === 'active'}
                      onCheckedChange={(checked) =>
                        handleToggleStatus(deliveryMan.id, checked)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={() => {
                        setEditingDeliveryMan(deliveryMan)
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
                            Esta acción no se puede deshacer. El repartidor se
                            eliminará permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteDeliveryMan(deliveryMan.id)}
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
          totalCount={filteredDeliveryMen.length}
          perPage={deliveryMenPerPage}
          onPageChange={(page) => setPage(page + 1)}
        />
      </div>
    </>
  )
}
