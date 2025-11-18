'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { CHNavbar } from '@/components/ch-navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dumbbell, Clock, Repeat, Weight } from 'lucide-react'

interface Exercise {
  id: string
  name: string
  muscleGroup: string
  sets: number
  reps: string
  weight?: string
  rest: number
}

interface Routine {
  id: string
  day: string
  name: string
  trainerId: string
  trainerName: string
  exercises: Exercise[]
}

export default function ClientRoutinesPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [routines] = useState<Routine[]>([
    {
      id: '1',
      day: 'Lunes',
      name: 'Pecho y Tríceps',
      trainerId: '3',
      trainerName: 'Carlos Hernández',
      exercises: [
        { id: '1', name: 'Press de Banca', muscleGroup: 'Pecho', sets: 4, reps: '8-10', weight: '60kg', rest: 90 },
        { id: '2', name: 'Press Inclinado', muscleGroup: 'Pecho', sets: 3, reps: '10-12', weight: '45kg', rest: 60 },
        { id: '3', name: 'Aperturas con Mancuernas', muscleGroup: 'Pecho', sets: 3, reps: '12-15', weight: '15kg', rest: 60 },
        { id: '4', name: 'Extensiones de Tríceps', muscleGroup: 'Tríceps', sets: 3, reps: '12-15', rest: 60 },
        { id: '5', name: 'Fondos en Paralelas', muscleGroup: 'Tríceps', sets: 3, reps: '8-10', rest: 90 },
      ],
    },
    {
      id: '2',
      day: 'Miércoles',
      name: 'Espalda y Bíceps',
      trainerId: '3',
      trainerName: 'Carlos Hernández',
      exercises: [
        { id: '6', name: 'Peso Muerto', muscleGroup: 'Espalda', sets: 4, reps: '6-8', weight: '80kg', rest: 120 },
        { id: '7', name: 'Dominadas', muscleGroup: 'Espalda', sets: 4, reps: '8-10', rest: 90 },
        { id: '8', name: 'Remo con Barra', muscleGroup: 'Espalda', sets: 3, reps: '10-12', weight: '50kg', rest: 60 },
        { id: '9', name: 'Curl con Barra', muscleGroup: 'Bíceps', sets: 3, reps: '10-12', weight: '25kg', rest: 60 },
        { id: '10', name: 'Curl Martillo', muscleGroup: 'Bíceps', sets: 3, reps: '12-15', weight: '12kg', rest: 45 },
      ],
    },
    {
      id: '3',
      day: 'Viernes',
      name: 'Piernas y Hombros',
      trainerId: '3',
      trainerName: 'Carlos Hernández',
      exercises: [
        { id: '11', name: 'Sentadilla', muscleGroup: 'Piernas', sets: 4, reps: '8-10', weight: '70kg', rest: 120 },
        { id: '12', name: 'Prensa de Pierna', muscleGroup: 'Piernas', sets: 3, reps: '12-15', weight: '100kg', rest: 90 },
        { id: '13', name: 'Peso Muerto Rumano', muscleGroup: 'Piernas', sets: 3, reps: '10-12', weight: '60kg', rest: 90 },
        { id: '14', name: 'Press Militar', muscleGroup: 'Hombros', sets: 4, reps: '8-10', weight: '40kg', rest: 90 },
        { id: '15', name: 'Elevaciones Laterales', muscleGroup: 'Hombros', sets: 3, reps: '12-15', weight: '10kg', rest: 60 },
      ],
    },
  ])

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

  return (
    <div className="min-h-screen ch-gradient">
      <CHNavbar user={user} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Mis Rutinas
          </h1>
          <p className="text-muted-foreground">
            Plan de entrenamiento asignado por tu entrenador
          </p>
        </div>

        <Tabs defaultValue="lunes" className="space-y-6">
          <TabsList className="bg-muted border border-border">
            {routines.map((routine) => (
              <TabsTrigger key={routine.id} value={routine.day.toLowerCase()}>
                {routine.day}
              </TabsTrigger>
            ))}
          </TabsList>

          {routines.map((routine) => (
            <TabsContent key={routine.id} value={routine.day.toLowerCase()} className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl text-foreground">{routine.name}</CardTitle>
                      <CardDescription className="mt-2 text-muted-foreground">
                        Asignado por: {routine.trainerName}
                      </CardDescription>
                    </div>
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      {routine.exercises.length} ejercicios
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {routine.exercises.map((exercise, index) => (
                    <Card key={exercise.id} className="bg-muted/50 border-border">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                            <span className="text-lg font-bold text-primary">{index + 1}</span>
                          </div>
                          <div className="flex-1 space-y-3">
                            <div>
                              <h3 className="font-semibold text-foreground text-lg">{exercise.name}</h3>
                              <Badge variant="outline" className="mt-1 text-xs">
                                {exercise.muscleGroup}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              <div className="flex items-center gap-2">
                                <Dumbbell className="h-4 w-4 text-primary" />
                                <div>
                                  <p className="text-xs text-muted-foreground">Series</p>
                                  <p className="text-sm font-semibold text-foreground">{exercise.sets}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Repeat className="h-4 w-4 text-primary" />
                                <div>
                                  <p className="text-xs text-muted-foreground">Reps</p>
                                  <p className="text-sm font-semibold text-foreground">{exercise.reps}</p>
                                </div>
                              </div>
                              {exercise.weight && (
                                <div className="flex items-center gap-2">
                                  <Weight className="h-4 w-4 text-primary" />
                                  <div>
                                    <p className="text-xs text-muted-foreground">Peso</p>
                                    <p className="text-sm font-semibold text-foreground">{exercise.weight}</p>
                                  </div>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary" />
                                <div>
                                  <p className="text-xs text-muted-foreground">Descanso</p>
                                  <p className="text-sm font-semibold text-foreground">{exercise.rest}s</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  )
}
