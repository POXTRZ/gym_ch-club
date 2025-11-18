'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { CHNavbar } from '@/components/ch-navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/data-table'
import { User, Mail, Phone, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import type { User as UserType } from '@/lib/types'

export default function TrainerClientsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [clients, setClients] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'TRAINER')) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchClients()
    }
  }, [user])

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/members?role=CLIENT')
      const data = await response.json()
      if (data.success) {
        setClients(data.data)
      }
    } catch (error) {
      toast.error('Error al cargar clientes')
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

  const columns = [
    {
      key: 'name',
      label: 'Cliente',
      render: (client: UserType) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">{client.name}</p>
            <p className="text-sm text-muted-foreground">{client.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Teléfono',
      render: (client: UserType) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>{client.phone || 'N/A'}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (client: UserType) => (
        <Badge className={client.isActive ? 'bg-green-500/20 text-green-500' : 'bg-destructive/20 text-destructive'}>
          {client.isActive ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Miembro desde',
      render: (client: UserType) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{new Date(client.createdAt).toLocaleDateString('es-MX')}</span>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen ch-gradient">
      <CHNavbar user={user} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Mis Clientes
          </h1>
          <p className="text-muted-foreground">
            Gestiona y monitorea a tus clientes asignados
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Clientes</p>
                  <p className="text-2xl font-bold text-foreground">{clients.length}</p>
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
                    {clients.filter(c => c.isActive).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Inactivos</p>
                  <p className="text-2xl font-bold text-foreground">
                    {clients.filter(c => !c.isActive).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Lista de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={clients}
              columns={columns}
              searchable
              searchPlaceholder="Buscar cliente por nombre o email..."
            />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
