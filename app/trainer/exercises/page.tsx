'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dumbbell, Edit, Trash2, Plus, Search } from 'lucide-react'
import { toast } from 'sonner'
import { CHNavbar } from '@/components/ch-navbar'

interface Exercise {
  _id: string
  name: string
  equipment?: string
  category?: string
  description?: string
  imageUrl?: string
}

export default function ExercisesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    equipment: '',
    category: '',
    description: '',
    imageUrl: '',
  })

  useEffect(() => {
    if (user && user.role !== 'TRAINER') {
      router.push('/login')
    }
  }, [user, router])

  useEffect(() => {
    if (user && user.role === 'TRAINER') {
      fetchExercises()
    }
  }, [user])

  useEffect(() => {
    // Filtrar ejercicios según el término de búsqueda
    const filtered = exercises.filter(
      (exercise) =>
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.equipment?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredExercises(filtered)
  }, [searchTerm, exercises])

  const fetchExercises = async () => {
    try {
      const res = await fetch('/api/exercises')
      const result = await res.json()
      
      // La API devuelve { success: true, data: exercises }
      const exercisesArray = result.data || []
      setExercises(exercisesArray)
      setFilteredExercises(exercisesArray)
    } catch (error) {
      console.error('Error fetching exercises:', error)
      toast.error('Error al cargar ejercicios')
      setExercises([])
      setFilteredExercises([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('El nombre del ejercicio es requerido')
      return
    }

    try {
      const url = editingExercise
        ? `/api/exercises?id=${editingExercise._id}`
        : '/api/exercises'
      const method = editingExercise ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Error al guardar ejercicio')
      }

      toast.success(
        editingExercise
          ? 'Ejercicio actualizado exitosamente'
          : 'Ejercicio creado exitosamente'
      )
      setIsDialogOpen(false)
      resetForm()
      fetchExercises()
    } catch (error: any) {
      console.error('Error saving exercise:', error)
      toast.error(error.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este ejercicio?')) return

    try {
      const res = await fetch(`/api/exercises?id=${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Error al eliminar ejercicio')

      toast.success('Ejercicio eliminado exitosamente')
      fetchExercises()
    } catch (error) {
      console.error('Error deleting exercise:', error)
      toast.error('Error al eliminar ejercicio')
    }
  }

  const handleEdit = (exercise: Exercise) => {
    setEditingExercise(exercise)
    setFormData({
      name: exercise.name,
      equipment: exercise.equipment || '',
      category: exercise.category || '',
      description: exercise.description || '',
      imageUrl: exercise.imageUrl || '',
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      equipment: '',
      category: '',
      description: '',
      imageUrl: '',
    })
    setEditingExercise(null)
  }

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      resetForm()
    }
  }

  const handleLoadSampleExercises = async () => {
    try {
      const res = await fetch('/api/init-exercises', { method: 'POST' })
      if (!res.ok) throw new Error('Error al cargar ejercicios')
      
      const data = await res.json()
      toast.success(data.message || '40 ejercicios cargados exitosamente')
      fetchExercises()
    } catch (error) {
      console.error('Error loading sample exercises:', error)
      toast.error('Error al cargar ejercicios de ejemplo')
    }
  }

  if (!user) return null
  if (user.role !== 'TRAINER') return null

  return (
    <div className="min-h-screen bg-background">
      <CHNavbar user={{ name: user.name, role: user.role }} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Gestión de Ejercicios
          </h1>
          <p className="text-muted-foreground">
            Administra la base de datos de ejercicios
          </p>
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
                  <p className="text-sm text-muted-foreground">Total Ejercicios</p>
                  <p className="text-2xl font-bold text-foreground">{exercises.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Acciones y búsqueda */}
        <Card className="bg-card border-border mb-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle className="text-foreground">Lista de Ejercicios</CardTitle>
              <div className="flex gap-2 w-full md:w-auto">
                {exercises.length === 0 && (
                  <Button
                    onClick={handleLoadSampleExercises}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Cargar 40 Ejemplos
                  </Button>
                )}
                <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Nuevo Ejercicio
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {editingExercise ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nombre del Ejercicio *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="Ej: Press de banca"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="equipment">Equipo/Máquina</Label>
                        <Input
                          id="equipment"
                          value={formData.equipment}
                          onChange={(e) =>
                            setFormData({ ...formData, equipment: e.target.value })
                          }
                          placeholder="Ej: Banca y barra"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Categoría</Label>
                        <Input
                          id="category"
                          value={formData.category}
                          onChange={(e) =>
                            setFormData({ ...formData, category: e.target.value })
                          }
                          placeholder="Ej: Pecho, Piernas, Espalda"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                          }
                          placeholder="Descripción del ejercicio"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="imageUrl">URL de Imagen (Opcional)</Label>
                        <Input
                          id="imageUrl"
                          value={formData.imageUrl}
                          onChange={(e) =>
                            setFormData({ ...formData, imageUrl: e.target.value })
                          }
                          placeholder="https://ejemplo.com/imagen.jpg"
                          type="url"
                        />
                        {formData.imageUrl && (
                          <div className="mt-2">
                            <img 
                              src={formData.imageUrl} 
                              alt="Vista previa" 
                              className="w-full h-32 object-cover rounded-md"
                              onError={(e) => {
                                e.currentTarget.src = ''
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleDialogClose(false)}
                        >
                          Cancelar
                        </Button>
                        <Button type="submit">
                          {editingExercise ? 'Actualizar' : 'Crear'}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Búsqueda */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, categoría o equipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Tabla de ejercicios */}
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Cargando ejercicios...
              </div>
            ) : filteredExercises.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm
                  ? 'No se encontraron ejercicios con ese criterio'
                  : 'No hay ejercicios registrados. Crea uno nuevo o carga ejemplos.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Imagen</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Equipo</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExercises.map((exercise) => (
                      <TableRow key={exercise._id}>
                        <TableCell>
                          {exercise.imageUrl ? (
                            <img 
                              src={exercise.imageUrl} 
                              alt={exercise.name}
                              className="w-16 h-16 object-cover rounded-md"
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/64?text=Sin+Imagen'
                              }}
                            />
                          ) : (
                            <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                              <Dumbbell className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{exercise.name}</TableCell>
                        <TableCell>
                          {exercise.category ? (
                            <Badge variant="secondary">{exercise.category}</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {exercise.equipment || (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {exercise.description || (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(exercise)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(exercise._id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
