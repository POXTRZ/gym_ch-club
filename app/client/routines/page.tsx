'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { CHNavbar } from '@/components/ch-navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dumbbell, Calendar, User, ChevronDown, ChevronUp } from 'lucide-react'
import { toast } from 'sonner'
import type { Routine, Exercise } from '@/lib/types'

export default function ClientRoutinesPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [routines, setRoutines] = useState<Routine[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedRoutine, setExpandedRoutine] = useState<string | null>(null)
  const [exerciseImages, setExerciseImages] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'CLIENT')) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchRoutines()
      fetchExerciseImages()
    }
  }, [user])

  const fetchExerciseImages = async () => {
    try {
      const response = await fetch('/api/exercises')
      const data = await response.json()
      if (data.success && data.data) {
        // Crear un mapa de nombre -> imageUrl
        const imageMap: Record<string, string> = {}
        data.data.forEach((ex: any) => {
          if (ex.imageUrl) {
            imageMap[ex.name] = ex.imageUrl
          }
        })
        setExerciseImages(imageMap)
      }
    } catch (error) {
      console.error('Error fetching exercise images:', error)
    }
  }

  const fetchRoutines = async () => {
    try {
      const response = await fetch(`/api/routines?userId=${user?.email}`)
      const data = await response.json()
      if (data.success) {
        setRoutines(data.data)
      } else {
        toast.error('Error al cargar rutinas')
      }
    } catch (error) {
      toast.error('Error al cargar rutinas')
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

  const getDayName = (day: string) => {
    const days: Record<string, string> = {
      'MONDAY': 'Lunes',
      'TUESDAY': 'Martes',
      'WEDNESDAY': 'Miércoles',
      'THURSDAY': 'Jueves',
      'FRIDAY': 'Viernes',
      'SATURDAY': 'Sábado',
      'SUNDAY': 'Domingo'
    }
    return days[day] || day
  }

  return (
    <div className="min-h-screen ch-gradient">
      <CHNavbar user={user} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Mis Rutinas
          </h1>
          <p className="text-muted-foreground">
            Revisa y sigue tus rutinas de entrenamiento personalizadas
          </p>
        </div>

        {routines.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-16 text-center">
              <Dumbbell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No tienes rutinas asignadas
              </h3>
              <p className="text-muted-foreground mb-4">
                Consulta con tu entrenador para obtener una rutina personalizada
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {routines.map((routine) => (
              <Card key={routine._id?.toString()} className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-foreground flex items-center gap-2">
                        <Dumbbell className="h-5 w-5 text-primary" />
                        {routine.name}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {routine.description}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="border-primary text-primary">
                      {routine.days.length} días
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>
                        {routine.trainerName ? `Entrenador: ${routine.trainerName}` : 'Entrenador asignado'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Creada el {new Date(routine.createdAt).toLocaleDateString('es-MX')}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    className="w-full justify-between"
                    onClick={() => setExpandedRoutine(
                      expandedRoutine === routine._id?.toString() ? null : routine._id?.toString() || null
                    )}
                  >
                    <span>Ver rutina completa</span>
                    {expandedRoutine === routine._id?.toString() ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>

                  {expandedRoutine === routine._id?.toString() && (
                    <div className="space-y-6 pt-4">
                      {routine.days.map((day, dayIndex) => (
                        <div key={dayIndex} className="space-y-3">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge className="bg-primary/10 text-primary border-primary/30">
                              {day.dayName}
                            </Badge>
                            {day.notes && (
                              <p className="text-sm text-muted-foreground">
                                {day.notes}
                              </p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            {day.exercises.map((exercise, exerciseIndex) => (
                              <div
                                key={exerciseIndex}
                                className="p-4 rounded-lg bg-muted/50 border border-border"
                              >
                                <div className="flex gap-4 mb-3">
                                  {/* Imagen del ejercicio */}
                                  {exerciseImages[exercise.name] ? (
                                    <img 
                                      src={exerciseImages[exercise.name]} 
                                      alt={exercise.name}
                                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none'
                                      }}
                                    />
                                  ) : (
                                    <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                                      <Dumbbell className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                  )}
                                  
                                  {/* Información del ejercicio */}
                                  <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                      <div>
                                        <h4 className="font-semibold text-foreground mb-1">
                                          {exerciseIndex + 1}. {exercise.name}
                                        </h4>
                                        {exercise.equipment && (
                                          <p className="text-xs text-muted-foreground mb-1">
                                            📍 {exercise.equipment}
                                          </p>
                                        )}
                                        {exercise.notes && (
                                          <p className="text-sm text-muted-foreground">
                                            {exercise.notes}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 text-sm mt-3">
                                      <div className="space-y-1">
                                        <p className="text-muted-foreground">Series</p>
                                        <p className="font-semibold text-foreground">
                                          {exercise.sets}
                                        </p>
                                      </div>
                                      <div className="space-y-1">
                                        <p className="text-muted-foreground">Repeticiones</p>
                                        <p className="font-semibold text-foreground">
                                          {exercise.reps}
                                        </p>
                                      </div>
                                      <div className="space-y-1">
                                        <p className="text-muted-foreground">Descanso</p>
                                        <p className="font-semibold text-foreground">
                                          {exercise.rest}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
