'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { CHNavbar } from '@/components/ch-navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react'

export default function AdminReportsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchStats()
    }
  }, [user])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error al cargar estadísticas')
    } finally {
      setLoading(false)
    }
  }

  if (isLoading || !user || loading || !stats) {
    return (
      <div className="min-h-screen ch-gradient flex items-center justify-center">
        <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Procesar datos para gráficas
  const salesByDay = stats.salesByDay || []
  const peakHours = stats.peakHours || []

  // Calcular tasa de retención
  const retentionRate = stats.totalMembers > 0 
    ? Math.round((stats.activeMembers / stats.totalMembers) * 100) 
    : 0

  return (
    <div className="min-h-screen ch-gradient">
      <CHNavbar user={user} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Reportes y Análisis
          </h1>
          <p className="text-muted-foreground">
            Visualiza el desempeño y crecimiento del gimnasio
          </p>
        </div>

        {/* KPIs principales */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Miembros</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalMembers}</p>
                  {stats.newMembersThisMonth > 0 && (
                    <p className="text-xs text-green-500 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +{stats.newMembersThisMonth} este mes
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ingresos Mes</p>
                  <p className="text-2xl font-bold text-foreground">${stats.monthlyRevenue.toLocaleString()}</p>
                  {stats.revenueGrowth !== 0 && (
                    <p className={`text-xs flex items-center gap-1 ${stats.revenueGrowth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      <TrendingUp className="h-3 w-3" />
                      {stats.revenueGrowth > 0 ? '+' : ''}{stats.revenueGrowth}% vs mes pasado
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 border-purple-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Check-ins Hoy</p>
                  <p className="text-2xl font-bold text-foreground">{stats.checkInsToday}</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.checkInsThisMonth} este mes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/20 to-orange-500/5 border-orange-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tasa Retención</p>
                  <p className="text-2xl font-bold text-foreground">{retentionRate}%</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.activeMembers} activos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficas principales */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Ventas por día */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Ventas de los Últimos 7 Días</CardTitle>
              <CardDescription className="text-muted-foreground">
                Total de ventas por día
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="day" 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend wrapperStyle={{ color: 'hsl(var(--foreground))' }} />
                  <Bar dataKey="sales" fill="#10b981" name="Ventas ($)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Horas pico */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Horas Pico de Asistencia</CardTitle>
              <CardDescription className="text-muted-foreground">
                Top 3 horarios con más check-ins
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={peakHours}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="hour" 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend wrapperStyle={{ color: 'hsl(var(--foreground))' }} />
                  <Bar dataKey="count" fill="#3b82f6" name="Check-ins" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Estadísticas de Personal */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Resumen del Personal</CardTitle>
              <CardDescription className="text-muted-foreground">
                Equipo de trabajo actual
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Entrenadores</p>
                      <p className="text-2xl font-bold text-foreground">{stats.totalTrainers}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Users className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Empleados</p>
                      <p className="text-2xl font-bold text-foreground">{stats.totalEmployees}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Activity className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Rutinas Activas</p>
                      <p className="text-2xl font-bold text-foreground">{stats.activeRoutines}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Productos Vendidos (Mes)</p>
                      <p className="text-2xl font-bold text-foreground">{stats.productSales}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estado del inventario */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Estado de Membresías</CardTitle>
              <CardDescription className="text-muted-foreground">
                Distribución actual de socios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Users className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Membresías Activas</p>
                      <p className="text-2xl font-bold text-foreground">{stats.activeMembers}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stats.totalMembers > 0 ? Math.round((stats.activeMembers / stats.totalMembers) * 100) : 0}% del total
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center">
                      <Users className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Membresías Expiradas</p>
                      <p className="text-2xl font-bold text-foreground">{stats.expiredMembers}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Requieren seguimiento
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Productos Stock Bajo</p>
                      <p className="text-2xl font-bold text-foreground">{stats.lowStockProducts}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Necesitan reabastecimiento
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Activity className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Check-ins del Mes</p>
                      <p className="text-2xl font-bold text-foreground">{stats.checkInsThisMonth}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Promedio: {stats.totalMembers > 0 ? Math.round(stats.checkInsThisMonth / stats.totalMembers) : 0} por socio
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
