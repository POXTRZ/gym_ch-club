'use client'

import { useEffect, useState } from 'react'
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
import type { DashboardStats } from '@/lib/types'

export default function AdminDashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      fetchStats()
    }
  }, [user])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error al obtener estadísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  if (isLoading || loading || !user || !stats) {
    return (
      <div className="min-h-screen ch-gradient flex items-center justify-center">
        <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

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
            value={stats.totalMembers}
            description={`${stats.activeMembers} activos`}
            icon={Users}
            trend={{ value: stats.newMembersThisMonth > 0 ? 8.3 : 0, isPositive: true }}
          />
          <StatsCard
            title="Ingresos Mensuales"
            value={`$${stats.monthlyRevenue.toLocaleString()}`}
            description="Membresías + Productos"
            icon={DollarSign}
            trend={{ value: stats.revenueGrowth, isPositive: stats.revenueGrowth > 0 }}
          />
          <StatsCard
            title="Check-ins Hoy"
            value={stats.checkInsToday}
            description="Asistencias registradas"
            icon={UserCheck}
          />
          <StatsCard
            title="Productos Vendidos"
            value={stats.productSales}
            description="Este mes"
            icon={ShoppingBag}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Summary */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Resumen de Actividad
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Estadísticas del mes actual
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Check-ins del Mes</p>
                    <p className="text-2xl font-bold text-foreground">{stats.checkInsThisMonth}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nuevos Miembros</p>
                    <p className="text-2xl font-bold text-foreground">{stats.newMembersThisMonth}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Productos con Stock Bajo</p>
                    <p className="text-2xl font-bold text-foreground">{stats.lowStockProducts}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Membresías Expiradas</p>
                    <p className="text-2xl font-bold text-foreground">{stats.expiredMembers}</p>
                  </div>
                </div>
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
                    <p className="text-3xl font-bold text-green-400">{stats.activeMembers}</p>
                    <p className="text-sm text-muted-foreground mt-1">Activas</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                    <p className="text-3xl font-bold text-yellow-400">{stats.newMembersThisMonth}</p>
                    <p className="text-sm text-muted-foreground mt-1">Nuevas Este Mes</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                    <p className="text-3xl font-bold text-red-400">{stats.expiredMembers}</p>
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
                  <Link href="/admin/socios" className="flex flex-col items-center gap-2">
                    <Users className="h-6 w-6 text-primary" />
                    <div className="text-center">
                      <div className="font-semibold text-foreground">Socios</div>
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
                {stats.recentActivities && stats.recentActivities.length > 0 ? (
                  stats.recentActivities.map((activity: any, index: number) => (
                    <div key={index} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(activity.time).toLocaleString('es-ES')}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay actividades recientes
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card className="bg-yellow-500/10 border-yellow-500/30">
              <CardHeader>
                <CardTitle className="text-foreground text-sm">Alertas del Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats.lowStockProducts > 0 && (
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="border-yellow-500 text-yellow-500 flex-shrink-0">
                      {stats.lowStockProducts}
                    </Badge>
                    <p className="text-sm text-foreground">Productos con stock bajo</p>
                  </div>
                )}
                {stats.expiredMembers > 0 && (
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="border-red-500 text-red-500 flex-shrink-0">
                      {stats.expiredMembers}
                    </Badge>
                    <p className="text-sm text-foreground">Membresías vencidas requieren seguimiento</p>
                  </div>
                )}
                {stats.lowStockProducts === 0 && stats.expiredMembers === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay alertas activas
                  </p>
                )}
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
                    <span className="text-muted-foreground">Check-ins del Mes</span>
                    <span className="font-semibold text-foreground">{stats.checkInsThisMonth}</span>
                  </div>
                  <Progress value={Math.min(100, (stats.checkInsThisMonth / (stats.totalMembers * 15)) * 100)} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Nuevos Miembros</span>
                    <span className="font-semibold text-foreground">{stats.newMembersThisMonth}</span>
                  </div>
                  <Progress value={Math.min(100, (stats.newMembersThisMonth / 20) * 100)} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Tasa de Retención</span>
                    <span className="font-semibold text-foreground">
                      {stats.totalMembers > 0 ? Math.round((stats.activeMembers / stats.totalMembers) * 100) : 0}%
                    </span>
                  </div>
                  <Progress value={stats.totalMembers > 0 ? (stats.activeMembers / stats.totalMembers) * 100 : 0} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
