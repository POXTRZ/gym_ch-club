'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { CHNavbar } from '@/components/ch-navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TrendingUp, TrendingDown, Activity, Save } from 'lucide-react'

export default function ClientProgressPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    weight: '75',
    height: '175',
    chest: '95',
    waist: '80',
    hips: '95',
    arms: '35',
    legs: '55',
  })

  const [progressHistory] = useState([
    { date: '2025-01-01', weight: 78, chest: 98, waist: 84 },
    { date: '2025-01-08', weight: 77, chest: 97, waist: 82 },
    { date: '2025-01-15', weight: 75, chest: 95, waist: 80 },
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('[v0] Updating progress:', formData)
    // TODO: Implement API call
    alert('Progreso actualizado exitosamente')
  }

  const weightChange = progressHistory[0].weight - progressHistory[progressHistory.length - 1].weight
  const isWeightDown = weightChange > 0

  return (
    <div className="min-h-screen ch-gradient">
      <CHNavbar user={user} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Mi Progreso
          </h1>
          <p className="text-muted-foreground">
            Registra y visualiza tu evolución física
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Progress Summary */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Resumen</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Cambios en las últimas 2 semanas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    {isWeightDown ? (
                      <TrendingDown className="h-5 w-5 text-green-500" />
                    ) : (
                      <TrendingUp className="h-5 w-5 text-red-500" />
                    )}
                    <span className="text-sm text-muted-foreground">Peso</span>
                  </div>
                  <span className={`font-semibold ${isWeightDown ? 'text-green-500' : 'text-red-500'}`}>
                    {isWeightDown ? '-' : '+'}{Math.abs(weightChange)} kg
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <span className="text-sm text-muted-foreground">Check-ins</span>
                  </div>
                  <span className="font-semibold text-foreground">18 este mes</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Historial</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {progressHistory.map((entry, index) => (
                  <div key={index} className="pb-3 border-b border-border last:border-0">
                    <p className="text-xs text-muted-foreground mb-1">
                      {new Date(entry.date).toLocaleDateString('es-MX')}
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Peso:</span>{' '}
                        <span className="font-medium text-foreground">{entry.weight}kg</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Pecho:</span>{' '}
                        <span className="font-medium text-foreground">{entry.chest}cm</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Cintura:</span>{' '}
                        <span className="font-medium text-foreground">{entry.waist}cm</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Update Form */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Actualizar Medidas</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Ingresa tus medidas actuales para seguir tu progreso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Measurements */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="weight">Peso (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        className="bg-input border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Altura (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={formData.height}
                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                        className="bg-input border-border"
                      />
                    </div>
                  </div>

                  {/* Body Measurements */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Medidas Corporales (cm)</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="chest">Pecho</Label>
                        <Input
                          id="chest"
                          type="number"
                          step="0.1"
                          value={formData.chest}
                          onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
                          className="bg-input border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="waist">Cintura</Label>
                        <Input
                          id="waist"
                          type="number"
                          step="0.1"
                          value={formData.waist}
                          onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                          className="bg-input border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hips">Cadera</Label>
                        <Input
                          id="hips"
                          type="number"
                          step="0.1"
                          value={formData.hips}
                          onChange={(e) => setFormData({ ...formData, hips: e.target.value })}
                          className="bg-input border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="arms">Brazos</Label>
                        <Input
                          id="arms"
                          type="number"
                          step="0.1"
                          value={formData.arms}
                          onChange={(e) => setFormData({ ...formData, arms: e.target.value })}
                          className="bg-input border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="legs">Piernas</Label>
                        <Input
                          id="legs"
                          type="number"
                          step="0.1"
                          value={formData.legs}
                          onChange={(e) => setFormData({ ...formData, legs: e.target.value })}
                          className="bg-input border-border"
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full ch-red-gradient text-white font-semibold">
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Progreso
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
