import { useState } from 'react'

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { ProfileSettings } from '@/pages/app/settings/profile-settings'
import { AdminProfileSummary } from './admin-profile-summary'
import { Button } from '@/shared/ui/button'
import { ArrowLeft } from 'lucide-react'

export function AdminProfileDialog() {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Gestión de Perfil de Administrador</DialogTitle>
        <DialogDescription>
          {isEditing
            ? 'Actualiza los datos de tu cuenta y cambia tu contraseña.'
            : 'Revisa la información de tu perfil de administrador.'}
        </DialogDescription>
      </DialogHeader>

      {isEditing ? (
        <>
          <ProfileSettings />
          <div className="flex justify-start">
            <Button variant="ghost" onClick={() => setIsEditing(false)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </div>
        </>
      ) : (
        <AdminProfileSummary onEdit={() => setIsEditing(true)} />
      )}
    </DialogContent>
  )
}
