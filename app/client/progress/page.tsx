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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, Minus, Save } from 'lucide-react'
import { toast } from 'sonner'
import type { PhysicalProgress } from '@/lib/types'

export default function ClientProgressPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [progressData, setProgressData] = useState<PhysicalProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    weight: '',
    bodyFat: '',
    muscleMass: '',
    chest: '',
    waist: '',
    hips: '',
    arms: '',
    thighs: '',
  })

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'CLIENT')) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchProgressData()
    }
  }, [user])

  const fetchProgressData = async () => {
    try {
      const response = await fetch(`/api/progress?userId=${user?.email}`)
      const data = await response.json()
      if (data.success) {
        setProgressData(data.data.sort((a: PhysicalProgress, b: PhysicalProgress) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        ))
      }
    } catch (error) {
      toast.error('Error al cargar datos de progreso')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.email,
          weight: parseFloat(formData.weight) || undefined,
          bodyFat: parseFloat(formData.bodyFat) || undefined,
          muscleMass: parseFloat(formData.muscleMass) || undefined,
          measurements: {
            chest: parseFloat(formData.chest) || undefined,
            waist: parseFloat(formData.waist) || undefined,
            hips: parseFloat(formData.hips) || undefined,
            arms: parseFloat(formData.arms) || undefined,
            thighs: parseFloat(formData.thighs) || undefined,
          },
          date: new Date(),
        }),
      })

      const data = await response.json()
      if (data.success) {
        toast.success('Progreso registrado exitosamente')
        setFormData({
          weight: '',
          bodyFat: '',
          muscleMass: '',
          chest: '',
          waist: '',
          hips: '',
          arms: '',
          thighs: '',
        })
        fetchProgressData()
      } else {
        toast.error(data.error || 'Error al registrar progreso')
      }
    } catch (error) {
      toast.error('Error al guardar los datos')
    } finally {
      setSaving(false)
    }
  }

  if (isLoading || !user || loading) {
    return (
      <div className="min-h-screen ch-gradient flex items-center justify-center">
        <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Preparar datos para la gráfica
  const chartData = progressData.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }),
    peso: entry.weight,
    grasaCorporal: entry.bodyFat,
    masaMuscular: entry.muscleMass,
  }))

  // Calcular estadísticas
  const latestEntry = progressData[progressData.length - 1]
  const firstEntry = progressData[0]
  
  const weightChange = latestEntry && firstEntry
    ? latestEntry.weight - firstEntry.weight
    : 0
  
  const bodyFatChange = latestEntry && firstEntry && latestEntry.bodyFat && firstEntry.bodyFat
    ? latestEntry.bodyFat - firstEntry.bodyFat
    : 0

  return (
    <div className="min-h-screen ch-gradient">
      <CHNavbar user={user} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Mi Progreso
          </h1>
          <p className="text-muted-foreground">
            Registra y monitorea tu evolución física
          </p>
        </div>

        {/* Estadísticas Rápidas */}
        {latestEntry && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Peso Actual</p>
                    <p className="text-3xl font-bold text-foreground">{latestEntry.weight} kg</p>
                    {weightChange !== 0 && (
                      <div className={`flex items-center gap-1 mt-2 text-sm ${weightChange > 0 ? 'text-blue-500' : 'text-green-500'}`}>
                        {weightChange > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        <span>{Math.abs(weightChange).toFixed(1)} kg desde el inicio</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {latestEntry.bodyFat && (
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Grasa Corporal</p>
                      <p className="text-3xl font-bold text-foreground">{latestEntry.bodyFat}%</p>
                      {bodyFatChange !== 0 && (
                        <div className={`flex items-center gap-1 mt-2 text-sm ${bodyFatChange < 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {bodyFatChange < 0 ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                          <span>{Math.abs(bodyFatChange).toFixed(1)}% desde el inicio</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {latestEntry.muscleMass && (
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Masa Muscular</p>
                    <p className="text-3xl font-bold text-foreground">{latestEntry.muscleMass} kg</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Gráfica de Progreso */}
          <Card className="bg-card border-border lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-foreground">Evolución del Peso</CardTitle>
              <CardDescription className="text-muted-foreground">
                Seguimiento de tu progreso en el tiempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
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
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="peso" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="Peso (kg)"
                    />
                    {chartData.some(d => d.grasaCorporal) && (
                      <Line 
                        type="monotone" 
                        dataKey="grasaCorporal" 
                        stroke="hsl(var(--destructive))" 
                        strokeWidth={2}
                        name="Grasa (%)"
                      />
                    )}
                    {chartData.some(d => d.masaMuscular) && (
                      <Line 
                        type="monotone" 
                        dataKey="masaMuscular" 
                        stroke="hsl(var(--chart-2))" 
                        strokeWidth={2}
                        name="Músculo (kg)"
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No hay datos suficientes para mostrar la gráfica
                </div>
              )}
            </CardContent>
          </Card>

          {/* Formulario de Nuevo Registro */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Registrar Mediciones</CardTitle>
              <CardDescription className="text-muted-foreground">
                Añade tus mediciones actuales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="70.5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bodyFat">Grasa Corporal (%)</Label>
                  <Input
                    id="bodyFat"
                    type="number"
                    step="0.1"
                    value={formData.bodyFat}
                    onChange={(e) => setFormData({ ...formData, bodyFat: e.target.value })}
                    placeholder="15.0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="muscleMass">Masa Muscular (kg)</Label>
                  <Input
                    id="muscleMass"
                    type="number"
                    step="0.1"
                    value={formData.muscleMass}
                    onChange={(e) => setFormData({ ...formData, muscleMass: e.target.value })}
                    placeholder="55.0"
                  />
                </div>

                <div className="pt-3 border-t border-border">
                  <p className="text-sm font-medium text-foreground mb-3">Medidas (cm)</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="chest" className="text-xs">Pecho</Label>
                      <Input
                        id="chest"
                        type="number"
                        step="0.1"
                        value={formData.chest}
                        onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
                        placeholder="95"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="waist" className="text-xs">Cintura</Label>
                      <Input
                        id="waist"
                        type="number"
                        step="0.1"
                        value={formData.waist}
                        onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                        placeholder="80"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hips" className="text-xs">Cadera</Label>
                      <Input
                        id="hips"
                        type="number"
                        step="0.1"
                        value={formData.hips}
                        onChange={(e) => setFormData({ ...formData, hips: e.target.value })}
                        placeholder="95"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="arms" className="text-xs">Brazos</Label>
                      <Input
                        id="arms"
                        type="number"
                        step="0.1"
                        value={formData.arms}
                        onChange={(e) => setFormData({ ...formData, arms: e.target.value })}
                        placeholder="35"
                      />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="thighs" className="text-xs">Piernas</Label>
                      <Input
                        id="thighs"
                        type="number"
                        step="0.1"
                        value={formData.thighs}
                        onChange={(e) => setFormData({ ...formData, thighs: e.target.value })}
                        placeholder="55"
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full ch-red-gradient text-white"
                  disabled={saving || !formData.weight}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Guardando...' : 'Guardar Progreso'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Historial de Mediciones */}
        {progressData.length > 0 && (
          <Card className="bg-card border-border mt-6">
            <CardHeader>
              <CardTitle className="text-foreground">Historial de Mediciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {progressData.slice().reverse().map((entry, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-muted/50 border border-border"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground">
                        {new Date(entry.date).toLocaleDateString('es-MX', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                      <Badge variant="outline">{entry.weight} kg</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                      {entry.bodyFat && (
                        <div>Grasa: {entry.bodyFat}%</div>
                      )}
                      {entry.muscleMass && (
                        <div>Músculo: {entry.muscleMass} kg</div>
                      )}
                      {entry.measurements?.chest && (
                        <div>Pecho: {entry.measurements.chest} cm</div>
                      )}
                      {entry.measurements?.waist && (
                        <div>Cintura: {entry.measurements.waist} cm</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
