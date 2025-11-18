'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Database, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function SeedDatabasePage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleSeed = async () => {
    if (!confirm('¿Estás seguro? Esto eliminará todos los socios y membresías existentes y creará nuevos datos de prueba.')) {
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/seed-database', {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (data.success) {
        setResult(data.stats)
        toast.success('Base de datos poblada exitosamente')
      } else {
        toast.error('Error al poblar la base de datos')
      }
    } catch (error) {
      toast.error('Error al poblar la base de datos')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen ch-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Database className="h-6 w-6 text-primary" />
            Poblar Base de Datos
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Genera datos de prueba para el gimnasio CH Club
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Advertencia</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Esta acción eliminará todos los socios y membresías existentes y creará nuevos datos de prueba.
                  Asegúrate de hacer un respaldo si es necesario.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Se crearán:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                60 socios con datos realistas
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                ~51 membresías (85% activas, 10% expiradas, 5% sin membresía)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                5 planes de membresía (Diario, Semanal, Mensual, Trimestral, Anual)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                3 entrenadores adicionales
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                2 empleados adicionales
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Check-ins aleatorios del día (30-40% de socios activos)
              </li>
            </ul>
          </div>

          <Button
            onClick={handleSeed}
            disabled={loading}
            className="w-full ch-red-gradient text-white font-semibold"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Poblando base de datos...
              </>
            ) : (
              <>
                <Database className="mr-2 h-5 w-5" />
                Poblar Base de Datos
              </>
            )}
          </Button>

          {result && (
            <div className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                ¡Datos creados exitosamente!
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Socios creados:</p>
                  <p className="text-xl font-bold text-foreground">{result.sociosCreados}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Membresías creadas:</p>
                  <p className="text-xl font-bold text-foreground">{result.membresiasCreadas}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Membresías activas:</p>
                  <p className="text-xl font-bold text-green-500">{result.membresiasActivas}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Membresías expiradas:</p>
                  <p className="text-xl font-bold text-red-500">{result.membresiasExpiradas}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Sin membresía:</p>
                  <p className="text-xl font-bold text-yellow-500">{result.sinMembresia}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Personal creado:</p>
                  <p className="text-xl font-bold text-foreground">{result.personalCreado}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Check-ins hoy:</p>
                  <p className="text-xl font-bold text-foreground">{result.checkInsCreados}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Dentro del gym:</p>
                  <p className="text-xl font-bold text-blue-500">{result.dentroDelGym}</p>
                </div>
              </div>
              
              <div className="mt-4 p-3 rounded bg-blue-500/10 border border-blue-500/30">
                <p className="text-sm text-muted-foreground">
                  <strong>Contraseña para todos los usuarios:</strong> <code className="text-foreground">password123</code>
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
