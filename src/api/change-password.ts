import { api } from '@/lib/axios'

export interface ChangePasswordBody {
  currentPassword: string
  newPassword: string
}

export async function changePassword({
  currentPassword,
  newPassword,
}: ChangePasswordBody) {
  await api.put('/admin/password', { currentPassword, newPassword })
}
