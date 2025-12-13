import { Helmet } from 'react-helmet-async'
import { useState } from 'react'

import {
  useCreateDeliveryManMutation,
  useDeleteDeliveryManMutation,
  useGetDeliveryMenQuery,
  useToggleDeliveryManStatusMutation,
  useUpdateDeliveryManMutation,
} from '@/entities/delivery/model/useDelivery'
import { type DeliveryMan } from '@/entities/delivery/model/delivery.model'
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

import { CreateDeliveryMan } from './create-delivery-man'

export function DeliveryMen() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDeliveryMan, setEditingDeliveryMan] =
    useState<DeliveryMan | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const deliveryMenPerPage = 10

  const { data: deliveryMenData, isLoading: isLoadingDeliveryMen } =
    useGetDeliveryMenQuery()
  const { mutateAsync: createDeliveryManFn } = useCreateDeliveryManMutation()
  const { mutateAsync: updateDeliveryManFn } = useUpdateDeliveryManMutation()
  const { mutateAsync: deleteDeliveryManFn } = useDeleteDeliveryManMutation()
  const { mutateAsync: toggleDeliveryManStatusFn } =
    useToggleDeliveryManStatusMutation()

  const deliveryMen = deliveryMenData?.deliveryMen ?? []

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

  async function handleCreateOrUpdateDeliveryMan(data: {
    name: string
    phone: string
    image?: File | null
    id?: string
  }) {
    // En un caso real, aquí se subiría la imagen a un servicio de almacenamiento
    // y se obtendría una URL. Para la simulación, creamos una URL local.
    const payload: any = {
      name: data.name,
      phone: data.phone,
    }

    if (editingDeliveryMan) {
      await updateDeliveryManFn({
        id: editingDeliveryMan.id,
        payload,
      })
    } else {
      await createDeliveryManFn(payload)
    }

    setEditingDeliveryMan(null)
    setIsDialogOpen(false)
  }

  async function handleDeleteDeliveryMan(id: string) {
    await deleteDeliveryManFn(id)
  }

  async function handleToggleStatus(id: string, checked: boolean) {
    const newStatus = checked ? 'active' : 'inactive'
    await toggleDeliveryManStatusFn({ id, status: newStatus })
  }

  if (isLoadingDeliveryMen) {
    return <div>Cargando repartidores...</div> // TODO: Replace with a skeleton loader
  }

  return (
    <>
      <Helmet title="Gestión de repartidores" />
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Gestión de repartidores
          </h1>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              if (!open) setEditingDeliveryMan(null)
              setIsDialogOpen(open)
            }}
          >
            <DialogTrigger asChild>
              <Button onClick={() => setEditingDeliveryMan(null)}>
                Agregar Repartidor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingDeliveryMan
                    ? 'Editar Repartidor'
                    : 'Agregar Repartidor'}
                </DialogTitle>
              </DialogHeader>
              <CreateDeliveryMan
                onCreate={handleCreateOrUpdateDeliveryMan}
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                <TableHead className="w-24">Imagen</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedDeliveryMen.map((deliveryMan) => (
                <TableRow key={deliveryMan.id}>
                  <TableCell>
                    {deliveryMan.imageUrl && (
                      <img
                        src={deliveryMan.imageUrl}
                        alt={deliveryMan.name}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                    )}
                  </TableCell>
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
                            onClick={() =>
                              handleDeleteDeliveryMan(deliveryMan.id)
                            }
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
