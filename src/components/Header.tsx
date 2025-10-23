import { Home, UtensilsCrossed, Cog, Briefcase } from 'lucide-react'

import { AccountMenu } from './account-menu'
import { NavLink } from './nav-link'
import { ThemeToggle } from './theme/theme-toggle'
import { Separator } from './ui/separator'

export function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center gap-6 px-6">
        <img src="/Barrio_Napoli_Logo.png" alt="Barrio Napoli Logo" className="h-8 w-8" />

        <Separator orientation="vertical" className="h-6" />

        <nav className="flex items-center space-x-4 lg:space-x-6">
          <NavLink to="/">
            <Home className="h-4 w-4" />
            Inicio
          </NavLink>
          <NavLink to="/orders">
            <UtensilsCrossed className="h-4 w-4" />
            Pedidos
          </NavLink>
          <NavLink to="/business/products">
            <Briefcase className="h-4 w-4" />
            Negocio
          </NavLink>
          <NavLink to="/settings">
            <Cog className="h-4 w-4" />
            Configuración
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
