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
import type { Membership, PhysicalProgress, Routine } from '@/lib/types'

export default function ClientDashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [membership, setMembership] = useState<any>(null)
  const [progress, setProgress] = useState<PhysicalProgress[]>([])
  const [routine, setRoutine] = useState<any>(null)
  const [checkIns, setCheckIns] = useState(0)
  const [recentActivities, setRecentActivities] = useState<any[]>([])

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'CLIENT')) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user && user.role === 'CLIENT') {
      fetchClientData()
    }
  }, [user])

  const fetchClientData = async () => {
    try {
      // Obtener membresía activa
      const memRes = await fetch(`/api/memberships?userId=${user!.id}`)
      const memData = await memRes.json()
      if (memData.success && memData.data.length > 0) {
        setMembership(memData.data[0])
      }

      // Obtener progreso físico
      const progRes = await fetch(`/api/progress?userId=${user!.id}&limit=1`)
      const progData = await progRes.json()
      if (progData.success) {
        setProgress(progData.data)
      }

      // Obtener rutina activa
      const routineRes = await fetch(`/api/routines?clientId=${user!.id}`)
      const routineData = await routineRes.json()
      if (routineData.success && routineData.data.length > 0) {
        setRoutine(routineData.data[0])
      }

      // Obtener check-ins del mes
      const checkInsRes = await fetch(`/api/check-ins?userId=${user!.id}`)
      const checkInsData = await checkInsRes.json()
      
      if (checkInsData.success) {
        const now = new Date()
        const thisMonth = checkInsData.data.filter((ci: any) => {
          const ciDate = new Date(ci.checkIn || ci.date || ci.createdAt)
          return ciDate.getMonth() === now.getMonth()
        })
        setCheckIns(thisMonth.length)
      }

      // Crear actividades recientes
      const activities: any[] = []

      // Agregar últimos check-ins (máximo 3)
      if (checkInsData.success && checkInsData.data && checkInsData.data.length > 0) {
        const recentCheckIns = checkInsData.data.slice(0, 3)
        
        recentCheckIns.forEach((ci: any) => {
          // Buscar la propiedad de fecha en diferentes posibles ubicaciones
          const checkInDate = ci.checkIn || ci.date || ci.createdAt || ci.timestamp
          
          if (checkInDate) {
            activities.push({
              type: 'checkin',
              description: ci.checkOut ? 'Check-in y check-out completado' : 'Check-in registrado',
              dateString: checkInDate,
              icon: 'primary'
            })
          }
        })
      }

      // Agregar rutina si existe
      if (routineData.success && routineData.data.length > 0 && routineData.data[0].createdAt) {
        activities.push({
          type: 'routine',
          description: `Rutina asignada: ${routineData.data[0].name}`,
          dateString: routineData.data[0].createdAt,
          icon: 'primary'
        })
      }

      // Agregar último progreso si existe
      if (progData.success && progData.data.length > 0 && progData.data[0].date) {
        activities.push({
          type: 'progress',
          description: `Progreso actualizado (${progData.data[0].weight} kg)`,
          dateString: progData.data[0].date,
          icon: 'muted'
        })
      }

      // Agregar membresía si existe
      if (memData.success && memData.data.length > 0 && memData.data[0].startDate) {
        activities.push({
          type: 'membership',
          description: `Membresía activada: ${memData.data[0].plan?.name || 'Plan'}`,
          dateString: memData.data[0].startDate,
          icon: 'primary'
        })
      }

      // Ordenar por fecha más reciente y tomar las primeras 4
      activities.sort((a, b) => {
        const dateA = new Date(a.dateString).getTime()
        const dateB = new Date(b.dateString).getTime()
        return dateB - dateA
      })
      
      setRecentActivities(activities.slice(0, 4))
    } catch (error) {
      console.error('Error al cargar datos del cliente:', error)
    } finally {
      setLoading(false)
    }
  }

  // Función para formatear fecha y hora
  const getTimeAgo = (dateInput: Date | string) => {
    // Asegurarnos de que tenemos un objeto Date válido
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
    
    // Validar que la fecha es válida
    if (isNaN(date.getTime())) {
      return 'Fecha no disponible'
    }
    
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    // Si es menos de 24 horas, mostrar "Hace X horas"
    if (hours < 24 && diff >= 0) {
      if (hours < 1) {
        const minutes = Math.floor(diff / 60000)
        return minutes <= 1 ? 'Hace un momento' : `Hace ${minutes} minutos`
      }
      return hours === 1 ? 'Hace 1 hora' : `Hace ${hours} horas`
    }
    
    // Si es menos de 7 días, mostrar "Hace X días"
    if (days < 7 && days >= 0) {
      return days === 1 ? 'Hace 1 día' : `Hace ${days} días`
    }
    
    // Para fechas más antiguas, mostrar fecha y hora exacta
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    const hour = date.getHours().toString().padStart(2, '0')
    const minute = date.getMinutes().toString().padStart(2, '0')
    
    // Si es del año actual, no mostrar el año
    const currentYear = now.getFullYear()
    if (year === currentYear) {
      return `${day} ${month} - ${hour}:${minute}`
    }
    
    return `${day} ${month} ${year} - ${hour}:${minute}`
  }

  if (isLoading || loading || !user) {
    return (
      <div className="min-h-screen ch-gradient flex items-center justify-center">
        <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const checkInGoal = 20
  const checkInProgress = (checkIns / checkInGoal) * 100
  const currentWeight = progress.length > 0 ? progress[0].weight : 0
  const daysRemaining = membership ? Math.ceil((new Date(membership.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0

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
            value={`${checkIns}/${checkInGoal}`}
            description="Asistencias registradas"
            icon={Calendar}
          />
          <StatsCard
            title="Peso Actual"
            value={currentWeight > 0 ? `${currentWeight} kg` : 'N/A'}
            description={progress.length > 0 ? `Último registro: ${new Date(progress[0].date).toLocaleDateString('es-MX')}` : 'Sin registros'}
            icon={Activity}
          />
          <StatsCard
            title="Días Restantes"
            value={membership ? daysRemaining : 'N/A'}
            description={membership ? 'en tu membresía' : 'Sin membresía activa'}
            icon={Target}
          />
          <StatsCard
            title="Membresía"
            value={membership ? membership.plan?.name : 'Inactiva'}
            description={membership ? `Vence: ${new Date(membership.endDate).toLocaleDateString('es-MX')}` : 'Adquiere una membresía'}
            icon={CreditCard}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Membership Card */}
            {membership ? (
              <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-foreground">Estado de Membresía</CardTitle>
                      <CardDescription className="text-muted-foreground mt-1">
                        {membership.plan?.name}
                      </CardDescription>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/50">
                      <span className="text-xs font-semibold text-green-400">{membership.status}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Fecha de inicio</p>
                      <p className="text-base font-semibold text-foreground">
                        {new Date(membership.startDate).toLocaleDateString('es-MX')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fecha de vencimiento</p>
                      <p className="text-base font-semibold text-foreground">
                        {new Date(membership.endDate).toLocaleDateString('es-MX')}
                      </p>
                    </div>
                  </div>
                  <Button asChild className="w-full ch-red-gradient text-white font-semibold">
                    <Link href="/client/membership">Ver Detalles y Renovar</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Sin Membresía Activa</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Adquiere una membresía para acceder al gimnasio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full ch-red-gradient text-white font-semibold">
                    <Link href="/client/membership">Ver Planes Disponibles</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Check-in Progress */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Progreso de Asistencia</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Meta mensual: {checkInGoal} visitas
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
                  {checkIns >= checkInGoal 
                    ? '¡Felicidades! Has alcanzado tu meta del mes' 
                    : `Te faltan ${checkInGoal - checkIns} visitas para alcanzar tu meta`}
                </p>
              </CardContent>
            </Card>

            {/* Routine Card */}
            {routine ? (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Dumbbell className="h-5 w-5 text-primary" />
                    Tu Rutina Actual
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {routine.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{routine.description}</p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Días de entrenamiento:</p>
                    <div className="flex flex-wrap gap-2">
                      {routine.days.map((day: any, idx: number) => (
                        <div key={idx} className="px-3 py-1 rounded-md bg-primary/10 text-primary text-sm font-medium">
                          {day.dayName}
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/client/routines">Ver Rutina Completa</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Sin Rutina Asignada</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Solicita una rutina personalizada a tu entrenador
                  </CardDescription>
                </CardHeader>
              </Card>
            )}

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
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`h-2 w-2 rounded-full mt-2 ${
                        activity.icon === 'primary' ? 'bg-primary' : 'bg-muted'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">{getTimeAgo(activity.dateString)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-sm text-muted-foreground">No hay actividad reciente</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tu actividad aparecerá aquí
                    </p>
                  </div>
                )}
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
                  <p className="text-sm font-medium text-foreground">Lun-Vie: 4:30 - 22:00</p>
                  <p className="text-sm font-medium text-foreground">Sábado: 6:00 - 14:00</p>
                  <p className="text-sm font-medium text-foreground">Domingo: Cerrado</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">WhatsApp</p>
                  <Button variant="link" className="h-auto p-0 text-primary" asChild>
                    <a href="https://wa.me/524272722124">427 272 2124</a>
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
