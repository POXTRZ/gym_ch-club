'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { CHNavbar } from '@/components/ch-navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Trash2, Save, Dumbbell, Edit, X } from 'lucide-react'
import { toast } from 'sonner'
import type { Routine, RoutineDay, Exercise, User as UserType } from '@/lib/types'

interface ExerciseDB {
  _id?: any
  name: string
  equipment: string
  category?: string
  description?: string
}

export default function TrainerRoutinesPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [routines, setRoutines] = useState<Routine[]>([])
  const [clients, setClients] = useState<UserType[]>([])
  const [exercises, setExercises] = useState<ExerciseDB[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [openExerciseDialog, setOpenExerciseDialog] = useState(false)
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null)

  const [newExercise, setNewExercise] = useState({
    name: '',
    equipment: '',
    category: 'Fuerza',
    description: '',
  })

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    clientId: '',
    days: [
      {
        dayName: 'Lunes',
        exercises: [] as Exercise[],
        notes: '',
      }
    ] as RoutineDay[],
  })

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'TRAINER')) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      const [routinesRes, clientsRes, exercisesRes] = await Promise.all([
        fetch('/api/routines'),
        fetch('/api/members?role=CLIENT'),
        fetch('/api/exercises'),
      ])

      const routinesData = await routinesRes.json()
      const clientsData = await clientsRes.json()
      const exercisesData = await exercisesRes.json()

      if (routinesData.success) setRoutines(routinesData.data)
      if (clientsData.success) setClients(clientsData.data)
      if (exercisesData.success) setExercises(exercisesData.data)
    } catch (error) {
      toast.error('Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (routine?: Routine) => {
    if (routine) {
      setEditingRoutine(routine)
      setFormData({
        name: routine.name,
        description: routine.description || '',
        clientId: routine.clientId.toString(),
        days: routine.days,
      })
    } else {
      setEditingRoutine(null)
      setFormData({
        name: '',
        description: '',
        clientId: '',
        days: [{ dayName: 'Lunes', exercises: [], notes: '' }],
      })
    }
    setOpenDialog(true)
  }

  const addDay = () => {
    setFormData({
      ...formData,
      days: [...formData.days, { dayName: '', exercises: [], notes: '' }],
    })
  }

  const removeDay = (index: number) => {
    setFormData({
      ...formData,
      days: formData.days.filter((_, i) => i !== index),
    })
  }

  const addExercise = (dayIndex: number) => {
    const newDays = [...formData.days]
    newDays[dayIndex].exercises.push({
      name: '',
      sets: 3,
      reps: '10',
      rest: '60s',
      notes: '',
      equipment: '',
    })
    setFormData({ ...formData, days: newDays })
  }

  const removeExercise = (dayIndex: number, exerciseIndex: number) => {
    const newDays = [...formData.days]
    newDays[dayIndex].exercises = newDays[dayIndex].exercises.filter((_, i) => i !== exerciseIndex)
    setFormData({ ...formData, days: newDays })
  }

  const updateExercise = (dayIndex: number, exerciseIndex: number, field: string, value: any) => {
    const newDays = [...formData.days]
    newDays[dayIndex].exercises[exerciseIndex] = {
      ...newDays[dayIndex].exercises[exerciseIndex],
      [field]: value,
    }
    setFormData({ ...formData, days: newDays })
  }

  const selectExerciseFromDB = (dayIndex: number, exerciseIndex: number, exerciseDB: ExerciseDB) => {
    const newDays = [...formData.days]
    newDays[dayIndex].exercises[exerciseIndex] = {
      ...newDays[dayIndex].exercises[exerciseIndex],
      name: exerciseDB.name,
      equipment: exerciseDB.equipment,
    }
    setFormData({ ...formData, days: newDays })
  }

  const handleCreateExercise = async () => {
    if (!newExercise.name || !newExercise.equipment) {
      toast.error('Nombre y equipo son obligatorios')
      return
    }

    try {
      const response = await fetch('/api/exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExercise),
      })

      const data = await response.json()
      if (data.success) {
        toast.success('Ejercicio agregado a la base de datos')
        setOpenExerciseDialog(false)
        setNewExercise({ name: '', equipment: '', category: 'Fuerza', description: '' })
        fetchData()
      } else {
        toast.error(data.error || 'Error al crear ejercicio')
      }
    } catch (error) {
      toast.error('Error al crear ejercicio')
    }
  }

  const handleLoadSampleExercises = async () => {
    try {
      const response = await fetch('/api/init-exercises')
      const data = await response.json()
      if (data.success) {
        toast.success(data.message || 'Ejercicios de ejemplo cargados')
        fetchData()
      } else {
        toast.error(data.error || 'Error al cargar ejercicios')
      }
    } catch (error) {
      toast.error('Error al cargar ejercicios de ejemplo')
    }
  }

  const handleSaveRoutine = async () => {
    if (!formData.name || !formData.clientId || formData.days.length === 0) {
      toast.error('Completa todos los campos obligatorios')
      return
    }

    try {
      const url = '/api/routines'
      const method = editingRoutine ? 'PUT' : 'POST'
      
      const body: any = {
        name: formData.name,
        description: formData.description,
        days: formData.days,
      }

      if (editingRoutine) {
        body._id = editingRoutine._id?.toString()
      } else {
        body.clientId = formData.clientId
        body.trainerId = user?.id
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()
      if (data.success) {
        toast.success(editingRoutine ? 'Rutina actualizada' : 'Rutina creada')
        setOpenDialog(false)
        fetchData()
      } else {
        toast.error(data.error || 'Error al guardar rutina')
      }
    } catch (error) {
      toast.error('Error al procesar solicitud')
    }
  }

  if (isLoading || !user || loading) {
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
              Gestión de Rutinas
            </h1>
            <p className="text-muted-foreground">
              Crea y edita rutinas personalizadas para tus clientes
            </p>
          </div>
          <div className="flex gap-3">
            <Dialog open={openExerciseDialog} onOpenChange={setOpenExerciseDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Dumbbell className="mr-2 h-4 w-4" />
                  Nuevo Ejercicio
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Agregar Ejercicio a la Base de Datos</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Este ejercicio estará disponible para todas las rutinas
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Nombre del ejercicio *</Label>
                    <Input
                      value={newExercise.name}
                      onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                      placeholder="Ej: Press de banca"
                      className="bg-background border-border text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Equipo/Material *</Label>
                    <Input
                      value={newExercise.equipment}
                      onChange={(e) => setNewExercise({ ...newExercise, equipment: e.target.value })}
                      placeholder="Ej: Banca y barra"
                      className="bg-background border-border text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Categoría</Label>
                    <Select value={newExercise.category} onValueChange={(value) => setNewExercise({ ...newExercise, category: value })}>
                      <SelectTrigger className="bg-background border-border text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="Fuerza">Fuerza</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="Flexibilidad">Flexibilidad</SelectItem>
                        <SelectItem value="Funcional">Funcional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Descripción</Label>
                    <Textarea
                      value={newExercise.description}
                      onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })}
                      placeholder="Instrucciones o notas..."
                      className="bg-background border-border text-foreground"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setOpenExerciseDialog(false)}>
                    Cancelar
                  </Button>
                  <Button className="ch-red-gradient text-white" onClick={handleCreateExercise}>
                    Agregar Ejercicio
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button className="ch-red-gradient text-white" onClick={() => handleOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Rutina
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-foreground">
                    {editingRoutine ? 'Editar Rutina' : 'Crear Nueva Rutina'}
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    {editingRoutine ? 'Actualiza los detalles de la rutina' : 'Diseña una rutina personalizada para tu cliente'}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  {/* Info básica */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-foreground">Nombre de la rutina *</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ej: Rutina de Fuerza Inicial"
                        className="bg-background border-border text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Cliente *</Label>
                      <Select 
                        value={formData.clientId} 
                        onValueChange={(value) => setFormData({ ...formData, clientId: value })}
                        disabled={!!editingRoutine}
                      >
                        <SelectTrigger className="bg-background border-border text-foreground">
                          <SelectValue placeholder="Selecciona un cliente" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          {clients.map((client) => (
                            <SelectItem key={client._id?.toString()} value={client._id?.toString() || ''}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Descripción</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Objetivo de la rutina..."
                      className="bg-background border-border text-foreground"
                    />
                  </div>

                  {/* Días */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-semibold text-foreground">Días de Entrenamiento</Label>
                      <Button variant="outline" size="sm" onClick={addDay}>
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Día
                      </Button>
                    </div>

                    {formData.days.map((day, dayIndex) => (
                      <Card key={dayIndex} className="bg-muted/30 border-border">
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                          <Input
                            value={day.dayName}
                            onChange={(e) => {
                              const newDays = [...formData.days]
                              newDays[dayIndex].dayName = e.target.value
                              setFormData({ ...formData, days: newDays })
                            }}
                            placeholder="Ej: Lunes - Pecho y Tríceps"
                            className="flex-1 bg-background border-border text-foreground font-semibold"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDay(dayIndex)}
                            className="text-destructive ml-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {/* Ejercicios */}
                          {day.exercises.map((exercise, exerciseIndex) => (
                            <div key={exerciseIndex} className="p-3 rounded-lg bg-background border border-border space-y-3">
                              <div className="flex items-start gap-3">
                                <div className="flex-1 space-y-3">
                                  <div className="grid md:grid-cols-2 gap-3">
                                    <div>
                                      <Label className="text-xs text-muted-foreground">Ejercicio</Label>
                                      {exercises.length > 0 ? (
                                        <Select
                                          value={exercise.name}
                                          onValueChange={(value) => {
                                            if (value === '__custom__') {
                                              // No hacer nada, dejar que escriba manualmente
                                              return
                                            }
                                            const selectedEx = exercises.find(ex => ex.name === value)
                                            if (selectedEx) selectExerciseFromDB(dayIndex, exerciseIndex, selectedEx)
                                          }}
                                        >
                                          <SelectTrigger className="bg-background border-border text-foreground">
                                            <SelectValue placeholder="Selecciona o escribe abajo" />
                                          </SelectTrigger>
                                          <SelectContent className="bg-card border-border max-h-60">
                                            <SelectItem value="__custom__" className="text-primary font-semibold">
                                              ✏️ Escribir manualmente
                                            </SelectItem>
                                            {exercises.map((ex) => (
                                              <SelectItem key={ex._id?.toString()} value={ex.name}>
                                                {ex.name} ({ex.equipment})
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      ) : (
                                        <div className="text-sm text-muted-foreground p-2 bg-muted/30 rounded">
                                          No hay ejercicios en BD. Escribe abajo o crea nuevos.
                                        </div>
                                      )}
                                      <Input
                                        value={exercise.name}
                                        onChange={(e) => updateExercise(dayIndex, exerciseIndex, 'name', e.target.value)}
                                        placeholder="O escribe el nombre aquí..."
                                        className="bg-background border-border text-foreground mt-2"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs text-muted-foreground">Equipo/Material</Label>
                                      <Input
                                        value={exercise.equipment || ''}
                                        onChange={(e) => updateExercise(dayIndex, exerciseIndex, 'equipment', e.target.value)}
                                        placeholder="Mancuernas, banca, máquina..."
                                        className="bg-background border-border text-foreground"
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-3 gap-3">
                                    <div>
                                      <Label className="text-xs text-muted-foreground">Series</Label>
                                      <Input
                                        type="number"
                                        value={exercise.sets}
                                        onChange={(e) => updateExercise(dayIndex, exerciseIndex, 'sets', parseInt(e.target.value))}
                                        className="bg-background border-border text-foreground"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs text-muted-foreground">Reps</Label>
                                      <Input
                                        value={exercise.reps}
                                        onChange={(e) => updateExercise(dayIndex, exerciseIndex, 'reps', e.target.value)}
                                        placeholder="10-12"
                                        className="bg-background border-border text-foreground"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs text-muted-foreground">Descanso</Label>
                                      <Input
                                        value={exercise.rest}
                                        onChange={(e) => updateExercise(dayIndex, exerciseIndex, 'rest', e.target.value)}
                                        placeholder="60s"
                                        className="bg-background border-border text-foreground"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-xs text-muted-foreground">Notas</Label>
                                    <Input
                                      value={exercise.notes || ''}
                                      onChange={(e) => updateExercise(dayIndex, exerciseIndex, 'notes', e.target.value)}
                                      placeholder="Instrucciones adicionales..."
                                      className="bg-background border-border text-foreground"
                                    />
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeExercise(dayIndex, exerciseIndex)}
                                  className="text-destructive"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addExercise(dayIndex)}
                            className="w-full"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Agregar Ejercicio
                          </Button>

                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Notas del día</Label>
                            <Textarea
                              value={day.notes}
                              onChange={(e) => {
                                const newDays = [...formData.days]
                                newDays[dayIndex].notes = e.target.value
                                setFormData({ ...formData, days: newDays })
                              }}
                              placeholder="Notas generales para este día..."
                              className="bg-background border-border text-foreground"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setOpenDialog(false)}>
                    Cancelar
                  </Button>
                  <Button className="ch-red-gradient text-white" onClick={handleSaveRoutine}>
                    <Save className="mr-2 h-4 w-4" />
                    {editingRoutine ? 'Actualizar Rutina' : 'Crear Rutina'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Dumbbell className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Rutinas</p>
                  <p className="text-2xl font-bold text-foreground">{routines.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Dumbbell className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ejercicios en BD</p>
                  <p className="text-2xl font-bold text-foreground">{exercises.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Dumbbell className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Clientes Activos</p>
                  <p className="text-2xl font-bold text-foreground">{clients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de rutinas */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Rutinas Creadas</CardTitle>
            <CardDescription className="text-muted-foreground">
              Gestiona y edita las rutinas de tus clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {routines.length === 0 ? (
              <div className="text-center py-12">
                <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No hay rutinas creadas</p>
                <Button className="ch-red-gradient text-white" onClick={() => handleOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Primera Rutina
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {routines.map((routine) => (
                  <Card key={routine._id?.toString()} className="bg-muted/30 border-border">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-foreground">{routine.name}</CardTitle>
                          <CardDescription className="text-muted-foreground mt-1">
                            {routine.clientName}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(routine)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{routine.days.length} días</Badge>
                          <Badge className="bg-green-500/20 text-green-500">
                            {routine.days.reduce((acc, day) => acc + day.exercises.length, 0)} ejercicios
                          </Badge>
                        </div>
                        {routine.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {routine.description}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
