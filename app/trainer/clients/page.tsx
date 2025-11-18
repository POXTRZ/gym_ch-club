'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { CHNavbar } from '@/components/ch-navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, User, Dumbbell, TrendingUp, Calendar } from 'lucide-react'

interface Client {
  id: string
  name: string
  email: string
  status: 'CHECKED_IN' | 'NOT_PRESENT'
  membershipStatus: 'ACTIVE' | 'EXPIRED'
  lastWorkout?: string
  assignedRoutines: number
  weight?: number
  goals?: string
}

export default function TrainerClientsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'CHECKED_IN' | 'NOT_PRESENT'>('ALL')

  const [clients] = useState<Client[]>([
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan@example.com',
      status: 'CHECKED_IN',
      membershipStatus: 'ACTIVE',
      lastWorkout: '2025-01-16',
      assignedRoutines: 3,
      weight: 75,
      goals: 'Aumentar masa muscular',
    },
    {
      id: '2',
      name: 'María González',
      email: 'maria@example.com',
      status: 'CHECKED_IN',
      membershipStatus: 'ACTIVE',
      lastWorkout: '2025-01-16',
      assignedRoutines: 3,
      weight: 62,
      goals: 'Perder peso',
    },
    {
      id: '3',
      name: 'Pedro Ramírez',
      email: 'pedro@example.com',
      status: 'NOT_PRESENT',
      membershipStatus: 'ACTIVE',
      lastWorkout: '2025-01-15',
      assignedRoutines: 2,
      weight: 80,
      goals: 'Mejorar resistencia',
    },
    {
      id: '4',
      name: 'Ana Martínez',
      email: 'ana@example.com',
      status: 'NOT_PRESENT',
      membershipStatus: 'ACTIVE',
      lastWorkout: '2025-01-14',
      assignedRoutines: 3,
      weight: 58,
      goals: 'Tonificar',
    },
  ])

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'TRAINER')) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen ch-gradient flex items-center justify-center">
        <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'ALL' || client.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const checkedInCount = clients.filter((c) => c.status === 'CHECKED_IN').length

  return (
    <div className="min-h-screen ch-gradient">
      <CHNavbar user={user} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Mis Clientes
          </h1>
          <p className="text-muted-foreground">
            Gestiona y asigna rutinas a tus clientes
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Clientes</p>
                  <p className="text-3xl font-bold text-foreground">{clients.length}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">En el Gimnasio</p>
                  <p className="text-3xl font-bold text-primary">{checkedInCount}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Dumbbell className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Rutinas Asignadas</p>
                  <p className="text-3xl font-bold text-foreground">
                    {clients.reduce((sum, c) => sum + c.assignedRoutines, 0)}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-input border-border"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === 'ALL' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('ALL')}
                >
                  Todos
                </Button>
                <Button
                  variant={filterStatus === 'CHECKED_IN' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('CHECKED_IN')}
                >
                  Presentes
                </Button>
                <Button
                  variant={filterStatus === 'NOT_PRESENT' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('NOT_PRESENT')}
                >
                  Ausentes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clients Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredClients.map((client) => (
            <Card key={client.id} className="bg-card border-border hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-foreground">{client.name}</CardTitle>
                      <CardDescription className="text-muted-foreground">{client.email}</CardDescription>
                    </div>
                  </div>
                  <Badge
                    className={
                      client.status === 'CHECKED_IN'
                        ? 'bg-green-500/20 text-green-400 border-green-500/50'
                        : 'bg-muted text-muted-foreground border-muted'
                    }
                  >
                    {client.status === 'CHECKED_IN' ? 'En el gym' : 'Ausente'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Peso</p>
                    <p className="font-semibold text-foreground">{client.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rutinas</p>
                    <p className="font-semibold text-foreground">{client.assignedRoutines}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Objetivo</p>
                    <p className="font-semibold text-foreground">{client.goals}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Último entrenamiento</p>
                    <p className="font-semibold text-foreground">
                      {client.lastWorkout ? new Date(client.lastWorkout).toLocaleDateString('es-MX') : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button asChild variant="outline" className="flex-1">
                    <Link href={`/trainer/routines?client=${client.id}`}>
                      <Dumbbell className="mr-2 h-4 w-4" />
                      Asignar Rutina
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link href={`/trainer/progress/${client.id}`}>
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Ver Progreso
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No se encontraron clientes</p>
          </div>
        )}
      </main>
    </div>
  )
}
