'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { CHNavbar } from '@/components/ch-navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { User, Mail, Phone, Calendar, CheckCircle, XCircle, AlertCircle, Search, Users, LogIn } from 'lucide-react'
import { toast } from 'sonner'

interface Socio {
  _id: string
  name: string
  email: string
  phone?: string
  createdAt: Date
  isActive: boolean
  isInside: boolean
  checkInTime: Date | null
  membership: {
    planName: string
    planType: string
    status: string
    startDate: Date
    endDate: Date
    daysRemaining: number
    isExpired: boolean
  } | null
}

export default function AdminSociosPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [socios, setSocios] = useState<Socio[]>([])
  const [filteredSocios, setFilteredSocios] = useState<Socio[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchSocios()
    }
  }, [user])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSocios(socios)
    } else {
      const filtered = socios.filter(socio => 
        socio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        socio.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        socio.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredSocios(filtered)
    }
  }, [searchTerm, socios])

  const fetchSocios = async () => {
    try {
      const response = await fetch('/api/socios')
      const data = await response.json()
      setSocios(data)
      setFilteredSocios(data)
    } catch (error) {
      toast.error('Error al cargar socios')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (isLoading || !user || loading) {
    return (
      <div className="min-h-screen ch-gradient flex items-center justify-center">
        <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const getStatusBadge = (membership: Socio['membership']) => {
    if (!membership) {
      return <Badge variant="outline" className="border-gray-500 text-gray-500">Sin Membresía</Badge>
    }

    if (membership.status === 'ACTIVE' && !membership.isExpired) {
      return <Badge className="bg-green-500/20 text-green-500 border-green-500">Activa</Badge>
    } else if (membership.status === 'EXPIRED' || membership.isExpired) {
      return <Badge className="bg-red-500/20 text-red-500 border-red-500">Expirada</Badge>
    } else if (membership.status === 'SUSPENDED') {
      return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500">Suspendida</Badge>
    } else {
      return <Badge variant="outline">{membership.status}</Badge>
    }
  }

  const getPlanTypeName = (type: string) => {
    const types: Record<string, string> = {
      'DAILY': 'Diaria',
      'WEEKLY': 'Semanal',
      'MONTHLY': 'Mensual',
      'QUARTERLY': 'Trimestral',
      'ANNUAL': 'Anual'
    }
    return types[type] || type
  }

  const sociosActivos = socios.filter(s => s.membership && s.membership.status === 'ACTIVE' && !s.membership.isExpired).length
  const sociosExpirados = socios.filter(s => !s.membership || s.membership.isExpired || s.membership.status === 'EXPIRED').length
  const sociosSinMembresia = socios.filter(s => !s.membership).length
  const sociosDentroGym = socios.filter(s => s.isInside).length

  return (
    <div className="min-h-screen ch-gradient">
      <CHNavbar user={user} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Gestión de Socios
          </h1>
          <p className="text-muted-foreground">
            Administra todos los clientes y sus membresías
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid md:grid-cols-5 gap-6 mb-6">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Socios</p>
                  <p className="text-2xl font-bold text-foreground">{socios.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Membresías Activas</p>
                  <p className="text-2xl font-bold text-foreground">{sociosActivos}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Membresías Expiradas</p>
                  <p className="text-2xl font-bold text-foreground">{sociosExpirados}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sin Membresía</p>
                  <p className="text-2xl font-bold text-foreground">{sociosSinMembresia}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <LogIn className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dentro del Gym</p>
                  <p className="text-2xl font-bold text-foreground">{sociosDentroGym}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de socios */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">Todos los Socios</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar socio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Socio</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Plan de Membresía</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Días Restantes</TableHead>
                    <TableHead>Fecha Expiración</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSocios.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No se encontraron socios
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSocios.map((socio) => (
                      <TableRow key={socio._id.toString()}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{socio.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Registro: {new Date(socio.createdAt).toLocaleDateString('es-MX')}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-4 w-4" />
                              <span>{socio.email}</span>
                            </div>
                            {socio.phone && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="h-4 w-4" />
                                <span>{socio.phone}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {socio.isInside ? (
                            <div>
                              <Badge className="bg-green-500/20 text-green-500 border-green-500 mb-1">
                                Dentro del Gym
                              </Badge>
                              {socio.checkInTime && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Desde: {new Date(socio.checkInTime).toLocaleTimeString('es-MX', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </p>
                              )}
                            </div>
                          ) : (
                            <Badge variant="outline" className="border-gray-500 text-gray-500">
                              Fuera
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-foreground">
                            {socio.membership?.planName || 'Sin Membresía'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-muted-foreground">
                            {socio.membership ? getPlanTypeName(socio.membership.planType) : '-'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(socio.membership)}
                        </TableCell>
                        <TableCell>
                          {socio.membership ? (
                            <span className={`font-medium ${
                              socio.membership.daysRemaining <= 7 && socio.membership.daysRemaining > 0
                                ? 'text-yellow-500'
                                : socio.membership.daysRemaining <= 0
                                ? 'text-red-500'
                                : 'text-green-500'
                            }`}>
                              {socio.membership.daysRemaining > 0 
                                ? `${socio.membership.daysRemaining} días` 
                                : 'Expirada'}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {socio.membership ? (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(socio.membership.endDate).toLocaleDateString('es-MX')}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
