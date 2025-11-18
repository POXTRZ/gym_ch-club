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
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Edit, Trash2, DollarSign, Calendar, Check, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { MembershipPlan } from '@/lib/types'

export default function AdminPlanesPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [plans, setPlans] = useState<MembershipPlan[]>([])
  const [loading, setLoading] = useState(true)
  
  // Estados para el diálogo
  const [showDialog, setShowDialog] = useState(false)
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [planToDelete, setPlanToDelete] = useState<MembershipPlan | null>(null)
  const [processing, setProcessing] = useState(false)
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    name: '',
    type: 'MONTHLY',
    price: '',
    duration: '',
    benefits: ['']
  })

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      fetchPlans()
    }
  }, [user])

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/membership-plans')
      const data = await response.json()
      if (data.success) {
        setPlans(data.data)
      }
    } catch (error) {
      toast.error('Error al cargar planes')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenCreate = () => {
    setEditingPlan(null)
    setFormData({
      name: '',
      type: 'MONTHLY',
      price: '',
      duration: '',
      benefits: ['']
    })
    setShowDialog(true)
  }

  const handleOpenEdit = (plan: MembershipPlan) => {
    setEditingPlan(plan)
    setFormData({
      name: plan.name,
      type: plan.type,
      price: plan.price.toString(),
      duration: plan.durationDays.toString(),
      benefits: plan.benefits.length > 0 ? plan.benefits : ['']
    })
    setShowDialog(true)
  }

  const handleOpenDelete = (plan: MembershipPlan) => {
    setPlanToDelete(plan)
    setShowDeleteDialog(true)
  }

  const handleAddBenefit = () => {
    setFormData({
      ...formData,
      benefits: [...formData.benefits, '']
    })
  }

  const handleRemoveBenefit = (index: number) => {
    const newBenefits = formData.benefits.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      benefits: newBenefits.length > 0 ? newBenefits : ['']
    })
  }

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...formData.benefits]
    newBenefits[index] = value
    setFormData({
      ...formData,
      benefits: newBenefits
    })
  }

  const handleSubmit = async () => {
    // Validaciones
    if (!formData.name || !formData.price || !formData.duration) {
      toast.error('Por favor completa todos los campos requeridos')
      return
    }

    const filteredBenefits = formData.benefits.filter(b => b.trim() !== '')
    if (filteredBenefits.length === 0) {
      toast.error('Agrega al menos un beneficio')
      return
    }

    setProcessing(true)

    try {
      const planData = {
        name: formData.name,
        type: formData.type,
        price: parseFloat(formData.price),
        durationDays: parseInt(formData.duration),
        benefits: filteredBenefits
      }

      const url = editingPlan 
        ? `/api/membership-plans/${editingPlan._id?.toString()}`
        : '/api/membership-plans'
      
      const method = editingPlan ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planData)
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success(editingPlan ? 'Plan actualizado exitosamente' : 'Plan creado exitosamente')
        setShowDialog(false)
        fetchPlans()
      } else {
        toast.error(data.error || 'Error al guardar plan')
      }
    } catch (error) {
      toast.error('Error al procesar la solicitud')
    } finally {
      setProcessing(false)
    }
  }

  const handleDelete = async () => {
    if (!planToDelete) return

    setProcessing(true)

    try {
      const response = await fetch(`/api/membership-plans/${planToDelete._id?.toString()}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('Plan eliminado exitosamente')
        setShowDeleteDialog(false)
        setPlanToDelete(null)
        fetchPlans()
      } else {
        toast.error(data.error || 'Error al eliminar plan')
      }
    } catch (error) {
      toast.error('Error al procesar la solicitud')
    } finally {
      setProcessing(false)
    }
  }

  const getPlanTypeName = (type: string) => {
    const names: Record<string, string> = {
      'DAILY': 'Diario',
      'WEEKLY': 'Semanal',
      'MONTHLY': 'Mensual',
      'QUARTERLY': 'Trimestral',
      'ANNUAL': 'Anual'
    }
    return names[type] || type
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Gestión de Planes
            </h1>
            <p className="text-muted-foreground">
              Administra los planes de membresía disponibles
            </p>
          </div>
          <Button 
            onClick={handleOpenCreate}
            className="ch-red-gradient text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Plan
          </Button>
        </div>

        {/* Estadísticas */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Planes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{plans.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Planes Mensuales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {plans.filter(p => p.type === 'MONTHLY').length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Planes Anuales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {plans.filter(p => p.type === 'ANNUAL').length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Precio Promedio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                ${plans.length > 0 ? Math.round(plans.reduce((sum, p) => sum + p.price, 0) / plans.length) : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Planes */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan._id?.toString()} className="bg-card border-border">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-foreground">{plan.name}</CardTitle>
                    <CardDescription className="text-muted-foreground mt-1">
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        {getPlanTypeName(plan.type)}
                      </Badge>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleOpenEdit(plan)}
                      className="h-8 w-8 text-primary hover:bg-primary/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleOpenDelete(plan)}
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary">${plan.price}</span>
                  <span className="text-muted-foreground">MXN</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Duración: {plan.durationDays} días</span>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Beneficios:</p>
                  <ul className="space-y-1">
                    {plan.benefits.slice(0, 3).map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                    {plan.benefits.length > 3 && (
                      <li className="text-sm text-muted-foreground pl-6">
                        +{plan.benefits.length - 3} más...
                      </li>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}

          {plans.length === 0 && (
            <div className="col-span-full">
              <Card className="bg-card border-border">
                <CardContent className="py-12 text-center">
                  <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No hay planes creados
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Comienza creando tu primer plan de membresía
                  </p>
                  <Button onClick={handleOpenCreate} className="ch-red-gradient text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Crear Primer Plan
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Diálogo Crear/Editar Plan */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingPlan ? 'Editar Plan' : 'Crear Nuevo Plan'}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {editingPlan 
                ? 'Modifica los detalles del plan de membresía' 
                : 'Completa la información del nuevo plan de membresía'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Nombre del Plan <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Ej: Plan Navideño Premium"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-background border-border text-foreground"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-foreground">
                  Tipo de Plan <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DAILY">Diario</SelectItem>
                    <SelectItem value="WEEKLY">Semanal</SelectItem>
                    <SelectItem value="MONTHLY">Mensual</SelectItem>
                    <SelectItem value="QUARTERLY">Trimestral</SelectItem>
                    <SelectItem value="ANNUAL">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration" className="text-foreground">
                  Duración (días) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="30"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="bg-background border-border text-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-foreground">
                Precio (MXN) <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="price"
                  type="number"
                  placeholder="500"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="bg-background border-border text-foreground pl-8"
                />
                <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-foreground">
                  Beneficios <span className="text-destructive">*</span>
                </Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddBenefit}
                  className="h-8"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Agregar
                </Button>
              </div>
              <div className="space-y-2">
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Beneficio ${index + 1}`}
                      value={benefit}
                      onChange={(e) => handleBenefitChange(index, e.target.value)}
                      className="bg-background border-border text-foreground"
                    />
                    {formData.benefits.length > 1 && (
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => handleRemoveBenefit(index)}
                        className="h-10 w-10 text-destructive hover:bg-destructive/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowDialog(false)}
                className="flex-1"
                disabled={processing}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 ch-red-gradient text-white"
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    {editingPlan ? 'Actualizar Plan' : 'Crear Plan'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo Eliminar Plan */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Eliminar Plan</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              ¿Estás seguro de que deseas eliminar este plan?
            </DialogDescription>
          </DialogHeader>

          {planToDelete && (
            <div className="py-4">
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">{planToDelete.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-primary">${planToDelete.price}</span>
                  <span className="text-muted-foreground">- {getPlanTypeName(planToDelete.type)}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-muted/50 border border-border rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Advertencia:</strong> Esta acción no se puede deshacer. 
                  Los clientes con este plan mantendrán su membresía actual, pero no podrán renovarla.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteDialog(false)
                    setPlanToDelete(null)
                  }}
                  className="flex-1"
                  disabled={processing}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="destructive"
                  className="flex-1"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar Plan
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
