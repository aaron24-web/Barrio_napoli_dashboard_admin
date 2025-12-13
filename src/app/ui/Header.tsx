import { BarChart, Briefcase, Cog, Home, UtensilsCrossed } from 'lucide-react'

import { ThemeToggle } from '@/app/providers/theme-toggle'
import { AccountMenu } from '@/features/auth/ui/account-menu'
import { NavLink } from '@/shared/ui/nav-link'
import { Separator } from '@/shared/ui/separator'

export function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center gap-6 px-6">
        <img
          src="/Barrio_Napoli_Logo.png"
          alt="Barrio Napoli Logo"
          className="h-8 w-8"
        />

        <Separator orientation="vertical" className="h-6" />

        <nav className="flex items-center space-x-4 lg:space-x-6">
          <NavLink to="/">
            <Home className="h-4 w-4" />
            Inicio
          </NavLink>
          <NavLink to="/business/menu">
            <UtensilsCrossed className="h-4 w-4" />
            Gestión del Menú
          </NavLink>
          <NavLink to="/delivery-men">
            <Briefcase className="h-4 w-4" />
            Gestión de repartidores
          </NavLink>
          <NavLink to="/settings">
            <Cog className="h-4 w-4" />
            Configuración
          </NavLink>
          <NavLink to="/reports">
            <BarChart className="h-4 w-4" />
            Reportes
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <AccountMenu />
        </div>
      </div>
    </div>
  )
}
