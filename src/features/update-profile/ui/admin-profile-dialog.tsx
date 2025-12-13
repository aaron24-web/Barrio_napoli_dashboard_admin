import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { ProfileSettings } from '@/pages/app/settings/profile-settings'

export function AdminProfileDialog() {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Gestión de Perfil de Administrador</DialogTitle>
        <DialogDescription>
          Actualiza los datos de tu cuenta y cambia tu contraseña.
        </DialogDescription>
      </DialogHeader>
      <ProfileSettings />
    </DialogContent>
  )
}
