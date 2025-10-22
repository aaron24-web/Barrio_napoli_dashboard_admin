import { Link, Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="grid min-h-screen grid-cols-2 antialiased">
      <div
        className="flex h-full flex-col justify-between border-r border-foreground/5 p-10 text-muted-foreground bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(/Fondo_Napoli_Login.jpg)` }}
      >
        <div className="flex items-center gap-3 text-lg font-medium text-foreground">
          <img src="/Barrio_Napoli_Logo.png" alt="Barrio Napoli Logo" className="h-8 w-8" />
          <span className="font-semibold text-xl">Barrio Napoli</span>
        </div>
        <footer className="text-sm">Paínel do parceiro &copy; Barrio Napoli - {new Date().getFullYear()}</footer>
      </div>

      <div className="relative flex flex-col items-center justify-center">
        <Outlet />
      </div>
    </div>
  )
}
