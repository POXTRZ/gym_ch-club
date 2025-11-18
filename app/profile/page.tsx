'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { CHNavbar } from '@/components/ch-navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Mail, Phone, Shield, Calendar, Edit2, Save, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function ProfilePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: (user as any).phone || '',
      })
    }
  }, [user])

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      toast.error('Nombre y correo son requeridos')
      return
    }

    setSaving(true)

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email,
          name: formData.name,
          phone: formData.phone,
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('Perfil actualizado exitosamente')
        setEditing(false)
      } else {
        toast.error(data.error || 'Error al actualizar perfil')
      }
    } catch (error) {
      toast.error('Error al procesar la solicitud')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: (user as any).phone || '',
      })
    }
    setEditing(false)
  }

  const getRoleName = (role: string) => {
    const roles: Record<string, string> = {
      'CLIENT': 'Cliente',
      'EMPLOYEE': 'Empleado',
      'TRAINER': 'Entrenador',
      'ADMIN': 'Administrador'
    }
    return roles[role] || role
  }

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      'CLIENT': 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      'EMPLOYEE': 'bg-green-500/20 text-green-400 border-green-500/50',
      'TRAINER': 'bg-purple-500/20 text-purple-400 border-purple-500/50',
      'ADMIN': 'bg-red-500/20 text-red-400 border-red-500/50'
    }
    return colors[role] || 'bg-gray-500/20 text-gray-400 border-gray-500/50'
  }

  if (isLoading || !user) {
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
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Mi Perfil
            </h1>
            <p className="text-muted-foreground">
              Administra tu información personal
            </p>
          </div>

          {/* Tarjeta de Perfil */}
          <Card className="bg-card border-border">
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
                    <User className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground text-2xl">{user.name}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                        {getRoleName(user.role)}
                      </span>
                    </CardDescription>
                  </div>
                </div>
                {!editing && (
                  <Button
                    onClick={() => setEditing(true)}
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    <Edit2 className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Nombre */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Nombre Completo
                  </Label>
                  {editing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-background border-border text-foreground"
                      placeholder="Tu nombre completo"
                    />
                  ) : (
                    <p className="text-foreground font-medium pl-6">{user.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Correo Electrónico
                  </Label>
                  <p className="text-muted-foreground pl-6 text-sm">
                    {user.email}
                    <span className="ml-2 text-xs">(No editable)</span>
                  </p>
                </div>

                {/* Teléfono */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Teléfono
                  </Label>
                  {editing ? (
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-background border-border text-foreground"
                      placeholder="Ej: 427 272 2124"
                    />
                  ) : (
                    <p className="text-foreground font-medium pl-6">{(user as any).phone || 'No registrado'}</p>
                  )}
                </div>

                {/* Rol */}
                <div className="space-y-2">
                  <Label className="text-foreground flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Rol en el Sistema
                  </Label>
                  <p className="text-foreground font-medium pl-6">{getRoleName(user.role)}</p>
                </div>

                {/* Fecha de Registro */}
                <div className="space-y-2">
                  <Label className="text-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Miembro Desde
                  </Label>
                  <p className="text-foreground font-medium pl-6">
                    {(user as any).createdAt ? new Date((user as any).createdAt).toLocaleDateString('es-MX', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'No disponible'}
                  </p>
                </div>

                {/* Botones de Acción */}
                {editing && (
                  <div className="flex gap-3 pt-4 border-t border-border">
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="flex-1"
                      disabled={saving}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="flex-1 ch-red-gradient text-white"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Guardar Cambios
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Información Adicional */}
          <Card className="bg-card border-border mt-6">
            <CardHeader>
              <CardTitle className="text-foreground">Información de Seguridad</CardTitle>
              <CardDescription className="text-muted-foreground">
                Mantén tu cuenta segura
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
                  <div>
                    <p className="text-sm font-medium text-foreground">Contraseña</p>
                    <p className="text-xs text-muted-foreground">••••••••</p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Cambiar
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  La funcionalidad de cambio de contraseña estará disponible próximamente.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
