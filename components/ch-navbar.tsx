'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface NavbarProps {
  user?: {
    name: string
    role: 'CLIENT' | 'EMPLOYEE' | 'TRAINER' | 'ADMIN'
    avatar?: string
  }
}

export function CHNavbar({ user }: NavbarProps) {
  const pathname = usePathname()

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log('[v0] Logout clicked')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-8gY1DHpsxOJRx4mlidSHIgsoaCsFxD.png" 
              alt="CH Club" 
              className="h-10 w-10 object-contain"
            />
            <span className="text-xl font-bold text-foreground">CH Club</span>
          </Link>

          {/* Navigation */}
          {user && (
            <nav className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-4">
                {user.role === 'CLIENT' && (
                  <>
                    <Link 
                      href="/client/dashboard"
                      className={`text-sm font-medium transition-colors hover:text-primary ${
                        pathname === '/client/dashboard' ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      Mi Perfil
                    </Link>
                    <Link 
                      href="/client/routines"
                      className={`text-sm font-medium transition-colors hover:text-primary ${
                        pathname === '/client/routines' ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      Rutinas
                    </Link>
                  </>
                )}
                
                {user.role === 'EMPLOYEE' && (
                  <>
                    <Link 
                      href="/employee/checkin"
                      className={`text-sm font-medium transition-colors hover:text-primary ${
                        pathname === '/employee/checkin' ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      Check-in
                    </Link>
                    <Link 
                      href="/employee/inventory"
                      className={`text-sm font-medium transition-colors hover:text-primary ${
                        pathname === '/employee/inventory' ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      Inventario
                    </Link>
                  </>
                )}

                {user.role === 'TRAINER' && (
                  <>
                    <Link 
                      href="/trainer/clients"
                      className={`text-sm font-medium transition-colors hover:text-primary ${
                        pathname === '/trainer/clients' ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      Clientes
                    </Link>
                    <Link 
                      href="/trainer/routines"
                      className={`text-sm font-medium transition-colors hover:text-primary ${
                        pathname === '/trainer/routines' ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      Asignar Rutinas
                    </Link>
                  </>
                )}

                {user.role === 'ADMIN' && (
                  <>
                    <Link 
                      href="/admin/dashboard"
                      className={`text-sm font-medium transition-colors hover:text-primary ${
                        pathname === '/admin/dashboard' ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      href="/admin/reports"
                      className={`text-sm font-medium transition-colors hover:text-primary ${
                        pathname === '/admin/reports' ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      Reportes
                    </Link>
                  </>
                )}
              </div>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    {user.avatar ? (
                      <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                        <User className="h-5 w-5 text-primary-foreground" />
                      </div>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.role}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}
