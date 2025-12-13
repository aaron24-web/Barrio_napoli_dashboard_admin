import { zodResolver } from '@hookform/resolvers/zod'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'

import { useForgotPasswordMutation } from '@/features/auth/model/useAuth'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

const forgotPasswordFormSchema = z.object({
  email: z.string().email('E-mail inválido'),
})

type ForgotPasswordForm = z.infer<typeof forgotPasswordFormSchema>

export function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordFormSchema),
  })

  const { mutateAsync: forgotPassword, isPending } =
    useForgotPasswordMutation()

  async function handleForgotPassword(data: ForgotPasswordForm) {
    await forgotPassword({ email: data.email })
  }

  return (
    <>
      <Helmet title="Recuperar contraseña" />
      <div className="p-8">
        <Button variant="ghost" asChild>
          <Link to="/sign-in" className="absolute right-8 top-8">
            Iniciar sesión
          </Link>
        </Button>

        <div className="flex w-[350px] flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Recuperar Contraseña
            </h1>
            <p className="text-sm text-muted-foreground">
              Introduce tu correo electrónico para recibir un enlace de
              recuperación.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(handleForgotPassword)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Tu correo electrónico</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <Button disabled={isPending} className="w-full" type="submit">
              Enviar enlace
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
