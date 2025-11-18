'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { CHNavbar } from '@/components/ch-navbar'
import { StatsCard } from '@/components/stats-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Calendar, TrendingUp, Dumbbell, CreditCard, Activity, Target } from 'lucide-react'
import Link from 'next/link'

export default function ClientDashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [clientData] = useState({
    membership: {
      plan: 'Premium Mensual',
      status: 'ACTIVE',
      startDate: '2025-01-01',
      endDate: '2025-02-01',
      daysRemaining: 15,
    },
    physicalData: {
      weight: 75,
      height: 175,
      lastUpdate: '2025-01-15',
    },
    checkIns: {
      thisMonth: 18,
      goal: 20,
    },
    nextPayment: {
      amount: 500,
      dueDate: '2025-02-01',
    },
  })

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'CLIENT')) {
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

  const checkInProgress = (clientData.checkIns.thisMonth / clientData.checkIns.goal) * 100

  return (
    <div className="min-h-screen ch-gradient">
      <CHNavbar user={user} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Bienvenido, {user.name}
          </h1>
          <p className="text-muted-foreground">
            Aquí está tu resumen de actividad en CH Club
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Check-ins este mes"
            value={`${clientData.checkIns.thisMonth}/${clientData.checkIns.goal}`}
            description="Asistencias registradas"
            icon={Calendar}
          />
          <StatsCard
            title="Peso Actual"
            value={`${clientData.physicalData.weight} kg`}
            description={`Altura: ${clientData.physicalData.height} cm`}
            icon={Activity}
          />
          <StatsCard
            title="Días Restantes"
            value={clientData.membership.daysRemaining}
            description="en tu membresía"
            icon={Target}
          />
          <StatsCard
            title="Próximo Pago"
            value={`$${clientData.nextPayment.amount}`}
            description={`Vence: ${new Date(clientData.nextPayment.dueDate).toLocaleDateString('es-MX')}`}
            icon={CreditCard}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Membership Card */}
            <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-foreground">Estado de Membresía</CardTitle>
                    <CardDescription className="text-muted-foreground mt-1">
                      {clientData.membership.plan}
                    </CardDescription>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/50">
                    <span className="text-xs font-semibold text-green-400">ACTIVA</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha de inicio</p>
                    <p className="text-base font-semibold text-foreground">
                      {new Date(clientData.membership.startDate).toLocaleDateString('es-MX')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha de vencimiento</p>
                    <p className="text-base font-semibold text-foreground">
                      {new Date(clientData.membership.endDate).toLocaleDateString('es-MX')}
                    </p>
                  </div>
                </div>
                <Button asChild className="w-full ch-red-gradient text-white font-semibold">
                  <Link href="/client/membership">Ver Detalles y Renovar</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Check-in Progress */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Progreso de Asistencia</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Meta mensual: {clientData.checkIns.goal} visitas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progreso</span>
                    <span className="font-semibold text-foreground">{Math.round(checkInProgress)}%</span>
                  </div>
                  <Progress value={checkInProgress} className="h-3" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Te faltan {clientData.checkIns.goal - clientData.checkIns.thisMonth} visitas para alcanzar tu meta
                </p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                <Button asChild variant="outline" className="h-auto py-6 border-border hover:border-primary">
                  <Link href="/client/routines" className="flex flex-col items-center gap-2">
                    <Dumbbell className="h-6 w-6 text-primary" />
                    <div className="text-center">
                      <div className="font-semibold text-foreground">Mis Rutinas</div>
                      <div className="text-xs text-muted-foreground">Ver ejercicios</div>
                    </div>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto py-6 border-border hover:border-primary">
                  <Link href="/client/progress" className="flex flex-col items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    <div className="text-center">
                      <div className="font-semibold text-foreground">Mi Progreso</div>
                      <div className="text-xs text-muted-foreground">Actualizar datos</div>
                    </div>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Actividad Reciente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Check-in registrado</p>
                    <p className="text-xs text-muted-foreground">Hace 2 horas</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Nueva rutina asignada</p>
                    <p className="text-xs text-muted-foreground">Hace 1 día</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-muted mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Progreso actualizado</p>
                    <p className="text-xs text-muted-foreground">Hace 3 días</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Horario</p>
                  <p className="text-sm font-medium text-foreground">Lun-Vie: 6:00 - 22:00</p>
                  <p className="text-sm font-medium text-foreground">Sáb-Dom: 8:00 - 20:00</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">WhatsApp</p>
                  <Button variant="link" className="h-auto p-0 text-primary" asChild>
                    <a href="https://wa.me/5214421234567">442-123-4567</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
