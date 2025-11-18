'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { CHNavbar } from '@/components/ch-navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { User, Mail, Phone, Calendar, Shield, Plus, Edit, UserX, UserCheck } from 'lucide-react'
import { toast } from 'sonner'
import type { User as UserType } from '@/lib/types'

export default function AdminStaffPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [staff, setStaff] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<UserType | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'EMPLOYEE' as 'ADMIN' | 'TRAINER' | 'EMPLOYEE',
  })

  const fetchStaff = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/members')
      const data = await response.json()
      if (data.success) {
        // Filtrar solo personal (no clientes)
        const staffMembers = data.data.filter((member: UserType) => member.role !== 'CLIENT')
        setStaff(staffMembers)
      }
    } catch (error) {
      toast.error('Error al cargar personal')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchStaff()
    }
  }, [user])

  const handleOpenDialog = (staffMember?: UserType) => {
    if (staffMember) {
      setEditingStaff(staffMember)
      setFormData({
        name: staffMember.name,
        email: staffMember.email,
        password: '',
        phone: staffMember.phone || '',
        role: staffMember.role as 'ADMIN' | 'TRAINER' | 'EMPLOYEE',
      })
    } else {
      setEditingStaff(null)
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'EMPLOYEE',
      })
    }
    setIsDialogOpen(true)
  }

  const handleSaveStaff = async () => {
    if (!formData.name || !formData.email) {
      toast.error('Completa los campos obligatorios')
      return
    }

    if (!editingStaff && !formData.password) {
      toast.error('La contraseña es obligatoria para nuevos usuarios')
      return
    }

    try {
      const url = editingStaff ? '/api/users' : '/api/users'
      const method = editingStaff ? 'PUT' : 'POST'
      
      const body: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
      }

      if (editingStaff) {
        body.userId = editingStaff._id?.toString()
        if (formData.password) body.password = formData.password
      } else {
        body.password = formData.password
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()
      if (data.success) {
        toast.success(editingStaff ? 'Personal actualizado' : 'Personal agregado')
        setIsDialogOpen(false)
        fetchStaff()
      } else {
        toast.error(data.error || 'Error al guardar')
      }
    } catch (error) {
      toast.error('Error al procesar solicitud')
    }
  }

  const handleToggleStatus = async (staffMember: UserType) => {
    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: staffMember._id?.toString(),
          isActive: !staffMember.isActive,
        }),
      })

      const data = await response.json()
      if (data.success) {
        toast.success(`Personal ${!staffMember.isActive ? 'activado' : 'desactivado'}`)
        fetchStaff()
      } else {
        toast.error(data.error || 'Error al actualizar estado')
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

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      'ADMIN': 'bg-red-500/20 text-red-500',
      'TRAINER': 'bg-blue-500/20 text-blue-500',
      'EMPLOYEE': 'bg-yellow-500/20 text-yellow-500',
    }
    
    const names: Record<string, string> = {
      'ADMIN': 'Administrador',
      'TRAINER': 'Entrenador',
      'EMPLOYEE': 'Empleado',
    }
    
    return <Badge className={styles[role]}>{names[role]}</Badge>
  }

  const columns = [
    {
      key: 'name',
      label: 'Personal',
      render: (member: UserType) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">{member.name}</p>
            <p className="text-sm text-muted-foreground">{member.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Rol',
      render: (member: UserType) => getRoleBadge(member.role),
    },
    {
      key: 'phone',
      label: 'Teléfono',
      render: (member: UserType) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>{member.phone || 'N/A'}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (member: UserType) => (
        <Badge className={member.isActive ? 'bg-green-500/20 text-green-500' : 'bg-destructive/20 text-destructive'}>
          {member.isActive ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Fecha de Ingreso',
      render: (member: UserType) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{new Date(member.createdAt).toLocaleDateString('es-MX')}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (member: UserType) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenDialog(member)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant={member.isActive ? 'destructive' : 'default'}
            size="sm"
            onClick={() => handleToggleStatus(member)}
          >
            {member.isActive ? (
              <UserX className="h-4 w-4" />
            ) : (
              <UserCheck className="h-4 w-4" />
            )}
          </Button>
        </div>
      ),
    },
  ]

  const admins = staff.filter(m => m.role === 'ADMIN')
  const trainers = staff.filter(m => m.role === 'TRAINER')
  const employees = staff.filter(m => m.role === 'EMPLOYEE')

  return (
    <div className="min-h-screen ch-gradient">
      <CHNavbar user={user} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Gestión de Personal
          </h1>
          <p className="text-muted-foreground">
            Administra empleados, entrenadores y administradores
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Personal</p>
                  <p className="text-2xl font-bold text-foreground">{staff.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Administradores</p>
                  <p className="text-2xl font-bold text-foreground">{admins.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Entrenadores</p>
                  <p className="text-2xl font-bold text-foreground">{trainers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Empleados</p>
                  <p className="text-2xl font-bold text-foreground">{employees.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de personal */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-foreground">Todo el Personal</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="ch-red-gradient text-white" onClick={() => handleOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Personal
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-foreground">
                    {editingStaff ? 'Editar Personal' : 'Agregar Personal'}
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    {editingStaff ? 'Actualiza la información del personal' : 'Agrega un nuevo miembro al personal'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">Nombre completo *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Juan Pérez"
                      className="bg-background border-border text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="juan@chclub.com"
                      className="bg-background border-border text-foreground"
                      disabled={!!editingStaff}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground">
                      Contraseña {!editingStaff && '*'}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder={editingStaff ? 'Dejar vacío para no cambiar' : 'password123'}
                      className="bg-background border-border text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-foreground">Teléfono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="5512345678"
                      className="bg-background border-border text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-foreground">Rol *</Label>
                    <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
                      <SelectTrigger className="bg-background border-border text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="EMPLOYEE">Empleado</SelectItem>
                        <SelectItem value="TRAINER">Entrenador</SelectItem>
                        <SelectItem value="ADMIN">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button className="ch-red-gradient text-white" onClick={handleSaveStaff}>
                    {editingStaff ? 'Actualizar' : 'Agregar'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <DataTable
              data={staff}
              columns={columns}
              searchable
              searchPlaceholder="Buscar por nombre, email o rol..."
            />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
