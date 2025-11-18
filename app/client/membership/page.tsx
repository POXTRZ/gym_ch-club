'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { CHNavbar } from '@/components/ch-navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CreditCard, Calendar, Check, AlertCircle, Lock, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Membership, MembershipPlan } from '@/lib/types'

export default function ClientMembershipPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [currentMembership, setCurrentMembership] = useState<Membership | null>(null)
  const [plans, setPlans] = useState<MembershipPlan[]>([])
  const [loading, setLoading] = useState(true)
  
  // Estados para el flujo de pago
  const [showPlanDialog, setShowPlanDialog] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null)
  const [processingPayment, setProcessingPayment] = useState(false)
  
  // Estados del formulario de pago
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'CLIENT')) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchMembershipData()
    }
  }, [user])

  const fetchMembershipData = async () => {
    try {
      // Obtener membresía actual
      const membershipRes = await fetch(`/api/memberships?userId=${user?.email}`)
      const membershipData = await membershipRes.json()
      if (membershipData.success && membershipData.data.length > 0) {
        setCurrentMembership(membershipData.data[0])
      }

      // Obtener planes disponibles
      const plansRes = await fetch('/api/membership-plans')
      const plansData = await plansRes.json()
      if (plansData.success) {
        setPlans(plansData.data)
      }
    } catch (error) {
      toast.error('Error al cargar datos de membresía')
    } finally {
      setLoading(false)
    }
  }

  const handlePurchasePlan = async (planId: string) => {
    const plan = plans.find(p => p._id?.toString() === planId)
    if (plan) {
      setSelectedPlan(plan)
      setShowPlanDialog(true)
    }
  }

  const handleContinueToPayment = () => {
    setShowPlanDialog(false)
    setShowPaymentDialog(true)
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4)
    }
    return v
  }

  const handleCompletePayment = async () => {
    // Validaciones básicas
    if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
      toast.error('Por favor completa todos los campos')
      return
    }

    if (cardNumber.replace(/\s/g, '').length !== 16) {
      toast.error('Número de tarjeta inválido')
      return
    }

    if (cardCvv.length !== 3) {
      toast.error('CVV inválido')
      return
    }

    setProcessingPayment(true)

    // Simular procesamiento de pago
    setTimeout(async () => {
      try {
        const response = await fetch('/api/memberships', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?.email,
            planId: selectedPlan?._id?.toString(),
          }),
        })

        const data = await response.json()
        if (data.success) {
          toast.success('¡Pago completado exitosamente!')
          setShowPaymentDialog(false)
          setSelectedPlan(null)
          // Limpiar formulario
          setCardNumber('')
          setCardName('')
          setCardExpiry('')
          setCardCvv('')
          fetchMembershipData()
        } else {
          toast.error(data.error || 'Error al procesar el pago')
        }
      } catch (error) {
        toast.error('Error al procesar la solicitud')
      } finally {
        setProcessingPayment(false)
      }
    }, 2000) // Simular 2 segundos de procesamiento
  }

  const isExpired = (endDate: Date) => {
    return new Date(endDate) < new Date()
  }

  const daysRemaining = (endDate: Date) => {
    const days = Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 0
  }

  if (isLoading || !user || loading) {
    return (
      <div className="min-h-screen ch-gradient flex items-center justify-center">
        <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const getPlanTypeName = (type: string) => {
    const names: Record<string, string> = {
      'DAILY': 'día',
      'WEEKLY': 'semana',
      'MONTHLY': 'mes',
      'QUARTERLY': 'trimestre',
      'ANNUAL': 'año'
    }
    return names[type] || 'periodo'
  }

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

        {/* Membresía Actual */}
        {currentMembership ? (
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <Card className={`bg-gradient-to-br ${isExpired(currentMembership.endDate) ? 'from-destructive/20 to-destructive/5 border-destructive/30' : 'from-primary/20 to-primary/5 border-primary/30'} lg:col-span-1`}>
              <CardHeader>
                <CardTitle className="text-foreground">Membresía Actual</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {plans.find(p => p._id?.toString() === currentMembership.planId?.toString())?.name || 'Plan'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Estado</span>
                  <Badge className={`${currentMembership.status === 'ACTIVE' && !isExpired(currentMembership.endDate) ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-destructive/20 text-destructive border-destructive/50'}`}>
                    {currentMembership.status === 'ACTIVE' && !isExpired(currentMembership.endDate) ? 'ACTIVA' : 'VENCIDA'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Vencimiento</span>
                  <span className="text-sm font-semibold text-foreground">
                    {new Date(currentMembership.endDate).toLocaleDateString('es-MX')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Días restantes</span>
                  <span className={`text-lg font-bold ${daysRemaining(currentMembership.endDate) > 7 ? 'text-primary' : 'text-destructive'}`}>
                    {daysRemaining(currentMembership.endDate)}
                  </span>
                </div>
                {daysRemaining(currentMembership.endDate) <= 7 && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span>Tu membresía está por vencer</span>
                  </div>
                )}
                <Button 
                  className="w-full ch-red-gradient text-white font-semibold"
                  onClick={() => handlePurchasePlan(currentMembership.planId?.toString() || '')}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Renovar Ahora
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-foreground">Detalles de Membresía</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Fecha de inicio</p>
                    <p className="font-medium text-foreground">
                      {new Date(currentMembership.startDate).toLocaleDateString('es-MX')}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Fecha de fin</p>
                    <p className="font-medium text-foreground">
                      {new Date(currentMembership.endDate).toLocaleDateString('es-MX')}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Precio</p>
                    <p className="font-medium text-foreground">
                      ${plans.find(p => p._id?.toString() === currentMembership.planId?.toString())?.price || 0}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Tipo de plan</p>
                    <p className="font-medium text-foreground">
                      {plans.find(p => p._id?.toString() === currentMembership.planId?.toString())?.type || 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="bg-card border-border mb-8">
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No tienes una membresía activa</h3>
              <p className="text-muted-foreground mb-4">Selecciona un plan para comenzar</p>
            </CardContent>
          </Card>
        )}

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Planes Disponibles</h2>
          <p className="text-muted-foreground">Elige el plan que mejor se adapte a tus necesidades</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isPopular = plan.type === 'MONTHLY' && plan.name.includes('Premium')
            return (
              <Card
                key={plan._id?.toString()}
                className={`bg-card border-border ${isPopular ? 'ring-2 ring-primary' : ''}`}
              >
                <CardHeader>
                  {isPopular && (
                    <Badge className="w-fit mb-2 bg-primary text-primary-foreground">
                      Más Popular
                    </Badge>
                  )}
                  <CardTitle className="text-foreground">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-primary">${plan.price}</span>
                    <span className="text-muted-foreground">/{getPlanTypeName(plan.type)}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <ul className="space-y-2">
                      {plan.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    onClick={() => handlePurchasePlan(plan._id?.toString() || '')}
                    className={`w-full ${isPopular ? 'ch-red-gradient text-white' : 'border-primary text-primary hover:bg-primary/10'}`}
                    variant={isPopular ? 'default' : 'outline'}
                  >
                    {currentMembership?.planId?.toString() === plan._id?.toString() ? 'Renovar Plan' : 'Seleccionar Plan'}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>

      {/* Diálogo de Confirmación de Plan */}
      <Dialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Confirmar Membresía</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Revisa los detalles de tu membresía antes de proceder al pago
            </DialogDescription>
          </DialogHeader>
          
          {selectedPlan && (
            <div className="space-y-4 py-4">
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <h3 className="font-semibold text-lg text-foreground mb-2">{selectedPlan.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary">${selectedPlan.price}</span>
                  <span className="text-muted-foreground">/{getPlanTypeName(selectedPlan.type)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Beneficios incluidos:</h4>
                <ul className="space-y-2">
                  {selectedPlan.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="text-foreground font-medium">${selectedPlan.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">IVA (16%):</span>
                  <span className="text-foreground font-medium">${(selectedPlan.price * 0.16).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-border pt-2">
                  <span className="text-foreground">Total:</span>
                  <span className="text-primary">${(selectedPlan.price * 1.16).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowPlanDialog(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleContinueToPayment}
                  className="flex-1 ch-red-gradient text-white"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Continuar al Pago
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de Pago */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Información de Pago
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Ingresa los datos de tu tarjeta de forma segura
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber" className="text-foreground">Número de Tarjeta</Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                  className="bg-background border-border text-foreground pl-10"
                />
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardName" className="text-foreground">Nombre en la Tarjeta</Label>
              <Input
                id="cardName"
                placeholder="JUAN PÉREZ"
                value={cardName}
                onChange={(e) => setCardName(e.target.value.toUpperCase())}
                className="bg-background border-border text-foreground"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cardExpiry" className="text-foreground">Fecha de Expiración</Label>
                <Input
                  id="cardExpiry"
                  placeholder="MM/AA"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardCvv" className="text-foreground">CVV</Label>
                <Input
                  id="cardCvv"
                  placeholder="123"
                  type="password"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  maxLength={3}
                  className="bg-background border-border text-foreground"
                />
              </div>
            </div>

            <div className="bg-muted/50 border border-border rounded-lg p-3 flex items-start gap-2">
              <Lock className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Tu información está protegida con encriptación de nivel bancario.
              </p>
            </div>

            {selectedPlan && (
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total a pagar:</span>
                  <span className="text-xl font-bold text-primary">
                    ${(selectedPlan.price * 1.16).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPaymentDialog(false)
                  setShowPlanDialog(true)
                }}
                className="flex-1"
                disabled={processingPayment}
              >
                Atrás
              </Button>
              <Button
                onClick={handleCompletePayment}
                className="flex-1 ch-red-gradient text-white"
                disabled={processingPayment}
              >
                {processingPayment ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Completar Pago
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
