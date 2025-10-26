import { Helmet } from 'react-helmet-async'
import { useState } from 'react'
import { Search, Plus, Edit, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

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
  const [searchTerm, setSearchTerm] = useState('')
  const [deliveryMen, setDeliveryMen] = useState<DeliveryMan[]>(MOCK_DELIVERY_MEN)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedDeliveryMan, setSelectedDeliveryMan] = useState<DeliveryMan | null>(null)

  const filteredDeliveryMen = deliveryMen.filter((deliveryMan) =>
    deliveryMan.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  function handleCreateDeliveryMan(newDeliveryMan: Omit<DeliveryMan, 'id'>) {
    const id = String(deliveryMen.length + 1)
    setDeliveryMen((prev) => [...prev, { id, ...newDeliveryMan, status: 'active' }])
    setIsCreateModalOpen(false)
  }

  function handleEditDeliveryMan(updatedDeliveryMan: DeliveryMan) {
    setDeliveryMen((prev) =>
      prev.map((deliveryMan) =>
        deliveryMan.id === updatedDeliveryMan.id ? updatedDeliveryMan : deliveryMan,
      ),
    )
    setIsEditModalOpen(false)
    setSelectedDeliveryMan(null)
  }

  function handleDeleteDeliveryMan(id: string) {
    setDeliveryMen((prev) => prev.filter((deliveryMan) => deliveryMan.id !== id))
    setIsDeleteModalOpen(false)
    setSelectedDeliveryMan(null)
  }

  function handleToggleStatus(id: string) {
    setDeliveryMen((prev) =>
      prev.map((deliveryMan) =>
        deliveryMan.id === id
          ? { ...deliveryMan, status: deliveryMan.status === 'active' ? 'inactive' : 'active' }
          : deliveryMan,
      ),
    )
  }

  return (
    <>
      <Helmet title="Gestión de repartidores" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Gestión de repartidores</h1>

        <div className="flex items-center justify-between">
          <form className="flex items-center gap-2">
            <Input
              placeholder="Buscar repartidor..."
              className="w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="button" variant="secondary" className="hidden">
              <Search className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
          </form>

          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Repartidor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Repartidor</DialogTitle>
              </DialogHeader>
              <CreateDeliveryMan onCreate={handleCreateDeliveryMan} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead className="w-[120px]">Estado</TableHead>
                <TableHead className="w-[132px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeliveryMen.map((deliveryMan) => (
                <TableRow key={deliveryMan.id}>
                  <TableCell>{deliveryMan.name}</TableCell>
                  <TableCell>{deliveryMan.phone}</TableCell>
                  <TableCell>
                    <Switch
                      checked={deliveryMan.status === 'active'}
                      onCheckedChange={() => handleToggleStatus(deliveryMan.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Dialog open={isEditModalOpen && selectedDeliveryMan?.id === deliveryMan.id} onOpenChange={setIsEditModalOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="xs"
                          className="mr-2"
                          onClick={() => setSelectedDeliveryMan(deliveryMan)}
                        >
                          <Edit className="h-3 w-3" />
                          <span className="sr-only">Editar repartidor</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Repartidor</DialogTitle>
                        </DialogHeader>
                        {selectedDeliveryMan && (
                          <CreateDeliveryMan
                            onCreate={handleEditDeliveryMan}
                            initialData={selectedDeliveryMan}
                          />
                        )}
                      </DialogContent>
                    </Dialog>

                    <Dialog open={isDeleteModalOpen && selectedDeliveryMan?.id === deliveryMan.id} onOpenChange={setIsDeleteModalOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="xs"
                          onClick={() => setSelectedDeliveryMan(deliveryMan)}
                        >
                          <Trash2 className="h-3 w-3" />
                          <span className="sr-only">Eliminar repartidor</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Eliminar Repartidor</DialogTitle>
                          <DialogDescription>
                            ¿Estás seguro de eliminar a {selectedDeliveryMan?.name}? Esta acción no se puede deshacer.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</Button>
                          <Button variant="destructive" onClick={() => handleDeleteDeliveryMan(deliveryMan.id)}>Eliminar</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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
