'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { CHNavbar } from '@/components/ch-navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Save, Search } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface Exercise {
  id: string
  name: string
  muscleGroup: string
  equipment: string
  difficulty: string
}

interface RoutineExercise {
  exerciseId: string
  sets: number
  reps: string
  weight?: string
  rest: number
}

export default function TrainerRoutinesPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const clientId = searchParams.get('client')

  const [routineName, setRoutineName] = useState('')
  const [routineDay, setRoutineDay] = useState('MON')
  const [selectedExercises, setSelectedExercises] = useState<RoutineExercise[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false)

  const [exercisesCatalog] = useState<Exercise[]>([
    { id: '1', name: 'Press de Banca', muscleGroup: 'Pecho', equipment: 'Barra', difficulty: 'Intermedio' },
    { id: '2', name: 'Sentadilla', muscleGroup: 'Piernas', equipment: 'Barra', difficulty: 'Intermedio' },
    { id: '3', name: 'Peso Muerto', muscleGroup: 'Espalda', equipment: 'Barra', difficulty: 'Avanzado' },
    { id: '4', name: 'Press Militar', muscleGroup: 'Hombros', equipment: 'Barra', difficulty: 'Intermedio' },
    { id: '5', name: 'Dominadas', muscleGroup: 'Espalda', equipment: 'Barra fija', difficulty: 'Intermedio' },
    { id: '6', name: 'Curl con Barra', muscleGroup: 'Bíceps', equipment: 'Barra', difficulty: 'Principiante' },
    { id: '7', name: 'Press Inclinado', muscleGroup: 'Pecho', equipment: 'Barra', difficulty: 'Intermedio' },
    { id: '8', name: 'Remo con Barra', muscleGroup: 'Espalda', equipment: 'Barra', difficulty: 'Intermedio' },
    { id: '9', name: 'Extensiones de Tríceps', muscleGroup: 'Tríceps', equipment: 'Polea', difficulty: 'Principiante' },
    { id: '10', name: 'Prensa de Pierna', muscleGroup: 'Piernas', equipment: 'Máquina', difficulty: 'Principiante' },
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

  const filteredExercises = exercisesCatalog.filter(
    (ex) =>
      ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.muscleGroup.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addExerciseToRoutine = (exercise: Exercise) => {
    setSelectedExercises([
      ...selectedExercises,
      {
        exerciseId: exercise.id,
        sets: 3,
        reps: '10-12',
        rest: 60,
      },
    ])
    setIsAddExerciseOpen(false)
    setSearchTerm('')
  }

  const updateExercise = (index: number, field: keyof RoutineExercise, value: any) => {
    const updated = [...selectedExercises]
    updated[index] = { ...updated[index], [field]: value }
    setSelectedExercises(updated)
  }

  const removeExercise = (index: number) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index))
  }

  const handleSaveRoutine = () => {
    console.log('[v0] Saving routine:', {
      clientId,
      name: routineName,
      day: routineDay,
      exercises: selectedExercises,
    })
    alert('Rutina guardada exitosamente')
    setRoutineName('')
    setSelectedExercises([])
  }

  const getExerciseName = (exerciseId: string) => {
    return exercisesCatalog.find((ex) => ex.id === exerciseId)?.name || 'Desconocido'
  }

  return (
    <div className="min-h-screen ch-gradient">
      <CHNavbar user={user} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Asignar Rutina
          </h1>
          <p className="text-muted-foreground">
            Crea y asigna una rutina personalizada a tu cliente
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Routine Configuration */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Configuración</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="routineName">Nombre de la rutina</Label>
                  <Input
                    id="routineName"
                    placeholder="ej. Pecho y Tríceps"
                    value={routineName}
                    onChange={(e) => setRoutineName(e.target.value)}
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="routineDay">Día de la semana</Label>
                  <Select value={routineDay} onValueChange={setRoutineDay}>
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MON">Lunes</SelectItem>
                      <SelectItem value="TUE">Martes</SelectItem>
                      <SelectItem value="WED">Miércoles</SelectItem>
                      <SelectItem value="THU">Jueves</SelectItem>
                      <SelectItem value="FRI">Viernes</SelectItem>
                      <SelectItem value="SAT">Sábado</SelectItem>
                      <SelectItem value="SUN">Domingo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Dialog open={isAddExerciseOpen} onOpenChange={setIsAddExerciseOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full ch-red-gradient text-white font-semibold">
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar Ejercicio
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-foreground">Catálogo de Ejercicios</DialogTitle>
                      <DialogDescription className="text-muted-foreground">
                        Selecciona ejercicios para agregar a la rutina
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Buscar ejercicio..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-input border-border"
                        />
                      </div>

                      <div className="max-h-96 overflow-y-auto space-y-2">
                        {filteredExercises.map((exercise) => (
                          <Card
                            key={exercise.id}
                            className="bg-muted/50 border-border cursor-pointer hover:border-primary transition-colors"
                            onClick={() => addExerciseToRoutine(exercise)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold text-foreground">{exercise.name}</h4>
                                  <p className="text-sm text-muted-foreground">{exercise.equipment}</p>
                                </div>
                                <div className="flex flex-col gap-1 items-end">
                                  <Badge variant="outline">{exercise.muscleGroup}</Badge>
                                  <Badge variant="outline" className="text-xs">{exercise.difficulty}</Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  onClick={handleSaveRoutine}
                  disabled={!routineName || selectedExercises.length === 0}
                  className="w-full"
                  variant="outline"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Rutina
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Exercise List */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Ejercicios Seleccionados</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {selectedExercises.length} ejercicio(s) en esta rutina
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedExercises.length > 0 ? (
                  selectedExercises.map((exercise, index) => (
                    <Card key={index} className="bg-muted/50 border-border">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                            <span className="text-sm font-bold text-primary">{index + 1}</span>
                          </div>
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between">
                              <h4 className="font-semibold text-foreground">
                                {getExerciseName(exercise.exerciseId)}
                              </h4>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeExercise(index)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Series</Label>
                                <Input
                                  type="number"
                                  value={exercise.sets}
                                  onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value))}
                                  className="h-8 bg-input border-border"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Reps</Label>
                                <Input
                                  type="text"
                                  value={exercise.reps}
                                  onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                                  placeholder="10-12"
                                  className="h-8 bg-input border-border"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Peso (kg)</Label>
                                <Input
                                  type="text"
                                  value={exercise.weight || ''}
                                  onChange={(e) => updateExercise(index, 'weight', e.target.value)}
                                  placeholder="60"
                                  className="h-8 bg-input border-border"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Descanso (s)</Label>
                                <Input
                                  type="number"
                                  value={exercise.rest}
                                  onChange={(e) => updateExercise(index, 'rest', parseInt(e.target.value))}
                                  className="h-8 bg-input border-border"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    No hay ejercicios agregados. Usa el botón "Agregar Ejercicio" para comenzar.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
