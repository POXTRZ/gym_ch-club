'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { CHNavbar } from '@/components/ch-navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { DollarSign, Users, ShoppingCart, TrendingUp, Calendar, Download } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function AdminReportsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [reportPeriod, setReportPeriod] = useState('month')

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

  const revenueData = {
    memberships: 86500,
    products: 12500,
    total: 99000,
  }

  const topProducts = [
    { name: 'Proteína Whey 1kg', sales: 45, revenue: 20250 },
    { name: 'Creatina 300g', sales: 32, revenue: 8960 },
    { name: 'Bebida Deportiva', sales: 156, revenue: 3900 },
    { name: 'Agua 600ml', sales: 234, revenue: 3510 },
  ]

  const attendanceData = [
    { day: 'Lunes', checkIns: 85 },
    { day: 'Martes', checkIns: 78 },
    { day: 'Miércoles', checkIns: 92 },
    { day: 'Jueves', checkIns: 88 },
    { day: 'Viernes', checkIns: 95 },
    { day: 'Sábado', checkIns: 67 },
    { day: 'Domingo', checkIns: 52 },
  ]

  const handleExportReport = () => {
    console.log('[v0] Exporting report for period:', reportPeriod)
    alert('Reporte exportado exitosamente')
  }

  return (
    <div className="min-h-screen ch-gradient">
      <CHNavbar user={user} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Reportes y Análisis
            </h1>
            <p className="text-muted-foreground">
              Información detallada sobre el rendimiento del gimnasio
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Período</Label>
              <Select value={reportPeriod} onValueChange={setReportPeriod}>
                <SelectTrigger className="w-36 bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Esta Semana</SelectItem>
                  <SelectItem value="month">Este Mes</SelectItem>
                  <SelectItem value="quarter">Trimestre</SelectItem>
                  <SelectItem value="year">Este Año</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleExportReport} className="ch-red-gradient text-white font-semibold self-end">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Revenue Report */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Reporte de Ingresos
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Desglose detallado de ingresos del período seleccionado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-6 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30">
                  <p className="text-sm text-muted-foreground mb-2">Ingresos por Membresías</p>
                  <p className="text-3xl font-bold text-primary">${revenueData.memberships.toLocaleString()}</p>
                  <Badge className="mt-2 bg-green-500/20 text-green-400 border-green-500/50">
                    87.4% del total
                  </Badge>
                </div>
                <div className="text-center p-6 rounded-lg bg-muted/50 border border-border">
                  <p className="text-sm text-muted-foreground mb-2">Venta de Productos</p>
                  <p className="text-3xl font-bold text-foreground">${revenueData.products.toLocaleString()}</p>
                  <Badge className="mt-2 bg-blue-500/20 text-blue-400 border-blue-500/50">
                    12.6% del total
                  </Badge>
                </div>
                <div className="text-center p-6 rounded-lg bg-muted/50 border border-border">
                  <p className="text-sm text-muted-foreground mb-2">Ingresos Totales</p>
                  <p className="text-3xl font-bold text-foreground">${revenueData.total.toLocaleString()}</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-500 font-semibold">+12.5%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <h4 className="font-semibold text-foreground mb-3">Proyección Anual</h4>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Basado en el promedio mensual actual</span>
                  <span className="text-xl font-bold text-primary">$1,188,000</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Report */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Reporte de Asistencia
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Distribución de check-ins por día de la semana
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {attendanceData.map((day, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-24 text-sm font-medium text-foreground">{day.day}</div>
                    <div className="flex-1 h-8 bg-muted rounded-lg overflow-hidden">
                      <div
                        className="h-full ch-red-gradient flex items-center justify-end pr-3 text-white text-sm font-semibold"
                        style={{ width: `${(day.checkIns / 100) * 100}%` }}
                      >
                        {day.checkIns}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="text-sm text-muted-foreground">Promedio Diario</p>
                  <p className="text-2xl font-bold text-foreground mt-1">79.6</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="text-sm text-muted-foreground">Total Semanal</p>
                  <p className="text-2xl font-bold text-foreground mt-1">557</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Sales Report */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                Productos Más Vendidos
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Top productos del período
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.sales} unidades vendidas</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">${product.revenue.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">en ventas</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Membership Stats */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Estadísticas de Membresías
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="text-2xl font-bold text-foreground">245</p>
                  <p className="text-sm text-muted-foreground mt-1">Total Miembros</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                  <p className="text-2xl font-bold text-green-400">198</p>
                  <p className="text-sm text-muted-foreground mt-1">Activos</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                  <p className="text-2xl font-bold text-yellow-400">32</p>
                  <p className="text-sm text-muted-foreground mt-1">Por Renovar</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                  <p className="text-2xl font-bold text-red-400">15</p>
                  <p className="text-sm text-muted-foreground mt-1">Vencidas</p>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tasa de Retención</p>
                    <p className="text-3xl font-bold text-primary mt-1">94.2%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Nuevos este mes</p>
                    <p className="text-3xl font-bold text-foreground mt-1">18</p>
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
