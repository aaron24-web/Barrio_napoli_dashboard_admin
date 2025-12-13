import { zodResolver } from '@hookform/resolvers/zod'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { resetPasswordSchema } from '@/features/auth/model/auth.model'
import { useResetPasswordMutation } from '@/features/auth/model/useAuth'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>

export function ResetPassword() {
  const [searchParams] = useSearchParams()

  const token = searchParams.get('token')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token ?? '',
    },
  })

  const { mutateAsync: resetPassword, isPending } = useResetPasswordMutation()

  async function handleResetPassword(data: ResetPasswordForm) {
    if (!token) {
      toast.error('Token no válido. Por favor, solicita un nuevo enlace.')
      return
    }

    await resetPassword({
      token,
      password: data.password,
      password_confirmation: data.password_confirmation,
    })
  }

  return (
    <>
      <Helmet title="Restablecer contraseña" />
      <div className="p-8">
        <div className="flex w-[350px] flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Restablecer Contraseña
            </h1>
            <p className="text-sm text-muted-foreground">
              Introduce tu nueva contraseña.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(handleResetPassword)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="password">Nueva contraseña</Label>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password_confirmation">
                Confirmar nueva contraseña
              </Label>
              <Input
                id="password_confirmation"
                type="password"
                {...register('password_confirmation')}
              />
              {errors.password_confirmation && (
                <p className="text-sm text-red-500">
                  {errors.password_confirmation.message}
                </p>
              )}
            </div>

            <Button disabled={isPending} className="w-full" type="submit">
              Restablecer contraseña
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
