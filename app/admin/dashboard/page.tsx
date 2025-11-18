'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { CHNavbar } from '@/components/ch-navbar'
import { StatsCard } from '@/components/stats-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, DollarSign, TrendingUp, ShoppingBag, UserCheck, Activity, Calendar, Clock } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

export default function AdminDashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'ADMIN')) {
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

  const statsData = {
    totalMembers: 245,
    activeMembers: 198,
    monthlyRevenue: 99000,
    checkInsToday: 67,
    productSales: 12500,
    revenueGrowth: 12.5,
    memberGrowth: 8.3,
  }

  const peakHours = [
    { hour: '6AM - 8AM', percentage: 35, count: 42 },
    { hour: '12PM - 2PM', percentage: 25, count: 30 },
    { hour: '6PM - 9PM', percentage: 55, count: 66 },
  ]

  const recentActivities = [
    { type: 'membership', description: 'Nueva membresía registrada - Juan Pérez', time: 'Hace 15 min' },
    { type: 'sale', description: 'Venta de proteína - $450', time: 'Hace 1 hora' },
    { type: 'staff', description: 'Check-in empleado - María García', time: 'Hace 2 horas' },
    { type: 'renewal', description: 'Renovación de membresía - Carlos López', time: 'Hace 3 horas' },
  ]

  return (
    <div className="min-h-screen ch-gradient">
      <CHNavbar user={user} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Panel Administrativo
            </h1>
            <p className="text-muted-foreground">
              Resumen general del gimnasio CH Club
            </p>
          </div>
          <Button asChild className="ch-red-gradient text-white font-semibold">
            <Link href="/admin/reports">Ver Reportes Completos</Link>
          </Button>
        </div>

        {/* Main Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Miembros"
            value={statsData.totalMembers}
            description={`${statsData.activeMembers} activos`}
            icon={Users}
            trend={{ value: statsData.memberGrowth, isPositive: true }}
          />
          <StatsCard
            title="Ingresos Mensuales"
            value={`$${statsData.monthlyRevenue.toLocaleString()}`}
            description="Membresías + Productos"
            icon={DollarSign}
            trend={{ value: statsData.revenueGrowth, isPositive: true }}
          />
          <StatsCard
            title="Check-ins Hoy"
            value={statsData.checkInsToday}
            description="Asistencias registradas"
            icon={UserCheck}
          />
          <StatsCard
            title="Ventas de Productos"
            value={`$${statsData.productSales.toLocaleString()}`}
            description="Este mes"
            icon={ShoppingBag}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Peak Hours */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Horarios de Mayor Afluencia
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Distribución de asistencia del día
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {peakHours.map((hour, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{hour.hour}</span>
                      <span className="text-muted-foreground">{hour.count} personas</span>
                    </div>
                    <Progress value={hour.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Membership Status */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Estado de Membresías</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                    <p className="text-3xl font-bold text-green-400">198</p>
                    <p className="text-sm text-muted-foreground mt-1">Activas</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                    <p className="text-3xl font-bold text-yellow-400">32</p>
                    <p className="text-sm text-muted-foreground mt-1">Por Vencer</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                    <p className="text-3xl font-bold text-red-400">15</p>
                    <p className="text-sm text-muted-foreground mt-1">Vencidas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-3 gap-4">
                <Button asChild variant="outline" className="h-auto py-6 border-border hover:border-primary">
                  <Link href="/admin/members" className="flex flex-col items-center gap-2">
                    <Users className="h-6 w-6 text-primary" />
                    <div className="text-center">
                      <div className="font-semibold text-foreground">Miembros</div>
                      <div className="text-xs text-muted-foreground">Gestionar</div>
                    </div>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto py-6 border-border hover:border-primary">
                  <Link href="/admin/staff" className="flex flex-col items-center gap-2">
                    <Activity className="h-6 w-6 text-primary" />
                    <div className="text-center">
                      <div className="font-semibold text-foreground">Personal</div>
                      <div className="text-xs text-muted-foreground">Ver equipo</div>
                    </div>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto py-6 border-border hover:border-primary">
                  <Link href="/admin/reports" className="flex flex-col items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    <div className="text-center">
                      <div className="font-semibold text-foreground">Reportes</div>
                      <div className="text-xs text-muted-foreground">Análisis</div>
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
              <CardContent className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card className="bg-yellow-500/10 border-yellow-500/30">
              <CardHeader>
                <CardTitle className="text-foreground text-sm">Alertas del Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="border-yellow-500 text-yellow-500 flex-shrink-0">
                    3
                  </Badge>
                  <p className="text-sm text-foreground">Productos con stock bajo</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="border-red-500 text-red-500 flex-shrink-0">
                    15
                  </Badge>
                  <p className="text-sm text-foreground">Membresías vencidas requieren seguimiento</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="border-yellow-500 text-yellow-500 flex-shrink-0">
                    32
                  </Badge>
                  <p className="text-sm text-foreground">Membresías por vencer en 7 días</p>
                </div>
              </CardContent>
            </Card>

            {/* Performance */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Rendimiento del Mes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Meta de Ingresos</span>
                    <span className="font-semibold text-foreground">99%</span>
                  </div>
                  <Progress value={99} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Meta de Miembros</span>
                    <span className="font-semibold text-foreground">82%</span>
                  </div>
                  <Progress value={82} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Retención de Clientes</span>
                    <span className="font-semibold text-foreground">94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
