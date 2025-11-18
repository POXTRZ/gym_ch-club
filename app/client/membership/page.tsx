'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { CHNavbar } from '@/components/ch-navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Calendar, Check } from 'lucide-react'

export default function ClientMembershipPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

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

  const plans = [
    {
      name: 'Básico Mensual',
      price: 400,
      features: ['Acceso al gimnasio', 'Horario limitado (6AM-2PM)', 'Zona de cardio', 'Casillero'],
    },
    {
      name: 'Premium Mensual',
      price: 500,
      features: ['Acceso ilimitado', 'Horario completo', 'Todas las áreas', 'Rutinas personalizadas', 'Casillero premium'],
      popular: true,
    },
    {
      name: 'Premium Trimestral',
      price: 1350,
      features: ['Todo lo de Premium', 'Ahorra 10%', 'Evaluación mensual', 'Asesoría nutricional básica'],
    },
  ]

  return (
    <div className="min-h-screen ch-gradient">
      <CHNavbar user={user} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Membresía
          </h1>
          <p className="text-muted-foreground">
            Gestiona tu membresía y planes disponibles
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-foreground">Membresía Actual</CardTitle>
              <CardDescription className="text-muted-foreground">Premium Mensual</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Estado</span>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/50">ACTIVA</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Vencimiento</span>
                <span className="text-sm font-semibold text-foreground">01/02/2025</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Días restantes</span>
                <span className="text-lg font-bold text-primary">15</span>
              </div>
              <Button className="w-full ch-red-gradient text-white font-semibold">
                <CreditCard className="mr-2 h-4 w-4" />
                Renovar Ahora
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-foreground">Historial de Pagos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { date: '01/01/2025', amount: 500, status: 'Completado' },
                { date: '01/12/2024', amount: 500, status: 'Completado' },
                { date: '01/11/2024', amount: 500, status: 'Completado' },
              ].map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{payment.date}</p>
                      <p className="text-xs text-muted-foreground">{payment.status}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-foreground">${payment.amount}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Planes Disponibles</h2>
          <p className="text-muted-foreground">Elige el plan que mejor se adapte a tus necesidades</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`bg-card border-border ${plan.popular ? 'ring-2 ring-primary' : ''}`}
            >
              <CardHeader>
                {plan.popular && (
                  <Badge className="w-fit mb-2 bg-primary text-primary-foreground">
                    Más Popular
                  </Badge>
                )}
                <CardTitle className="text-foreground">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-primary">${plan.price}</span>
                  <span className="text-muted-foreground">/periodo</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${plan.popular ? 'ch-red-gradient text-white' : 'border-primary text-primary hover:bg-primary/10'}`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  Seleccionar Plan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
