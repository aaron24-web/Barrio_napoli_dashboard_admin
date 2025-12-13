import { useState } from 'react'

import { useGetProfileQuery } from '@/entities/user/model/useUser'
import { Button } from '@/shared/ui/button'
import { Label } from '@/shared/ui/label'
import { Skeleton } from '@/shared/ui/skeleton'

interface AdminProfileSummaryProps {
  onEdit: () => void
}

export function AdminProfileSummary({ onEdit }: AdminProfileSummaryProps) {
  const { data: profile, isLoading, isError } = useGetProfileQuery()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Nombre del Administrador</Label>
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Label>Correo Electrónico</Label>
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-red-500">
        Error al cargar el perfil del administrador.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del Administrador</Label>
        <p id="name" className="text-lg font-medium">
          {profile?.name}
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Correo Electrónico</Label>
        <p id="email" className="text-lg font-medium">
          {profile?.email}
        </p>
      </div>
      <div className="flex justify-end">
        <Button onClick={onEdit}>Editar Perfil</Button>
      </div>
    </div>
  )
}
