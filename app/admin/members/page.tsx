'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { CHNavbar } from '@/components/ch-navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/data-table'
import { User, Mail, Phone, Calendar, Shield } from 'lucide-react'
import { toast } from 'sonner'
import type { User as UserType } from '@/lib/types'

export default function AdminMembersPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [members, setMembers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchMembers()
    }
  }, [user])

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members')
      const data = await response.json()
      if (data.success) {
        setMembers(data.data)
      }
    } catch (error) {
      toast.error('Error al cargar miembros')
    } finally {
      setLoading(false)
    }
  }

  if (isLoading || !user || loading) {
    return (
      <div className="min-h-screen ch-gradient flex items-center justify-center">
        <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      'ADMIN': 'bg-red-500/20 text-red-500',
      'TRAINER': 'bg-blue-500/20 text-blue-500',
      'EMPLOYEE': 'bg-yellow-500/20 text-yellow-500',
      'CLIENT': 'bg-green-500/20 text-green-500',
    }
    
    const names: Record<string, string> = {
      'ADMIN': 'Administrador',
      'TRAINER': 'Entrenador',
      'EMPLOYEE': 'Empleado',
      'CLIENT': 'Cliente',
    }
    
    return <Badge className={styles[role]}>{names[role]}</Badge>
  }

  const columns = [
    {
      key: 'name',
      label: 'Miembro',
      render: (member: UserType) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">{member.name}</p>
            <p className="text-sm text-muted-foreground">{member.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Rol',
      render: (member: UserType) => getRoleBadge(member.role),
    },
    {
      key: 'phone',
      label: 'Teléfono',
      render: (member: UserType) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>{member.phone || 'N/A'}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (member: UserType) => (
        <Badge className={member.isActive ? 'bg-green-500/20 text-green-500' : 'bg-destructive/20 text-destructive'}>
          {member.isActive ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Fecha de Registro',
      render: (member: UserType) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{new Date(member.createdAt).toLocaleDateString('es-MX')}</span>
        </div>
      ),
    },
  ]

  const clients = members.filter(m => m.role === 'CLIENT')
  const staff = members.filter(m => m.role !== 'CLIENT')

  return (
    <div className="min-h-screen ch-gradient">
      <CHNavbar user={user} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Gestión de Miembros
          </h1>
          <p className="text-muted-foreground">
            Administra todos los usuarios del sistema
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Usuarios</p>
                  <p className="text-2xl font-bold text-foreground">{members.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Clientes</p>
                  <p className="text-2xl font-bold text-foreground">{clients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Personal</p>
                  <p className="text-2xl font-bold text-foreground">{staff.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Activos</p>
                  <p className="text-2xl font-bold text-foreground">
                    {members.filter(m => m.isActive).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de miembros */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Todos los Miembros</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={members}
              columns={columns}
              searchable
              searchPlaceholder="Buscar por nombre, email o teléfono..."
            />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
