'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { CHNavbar } from '@/components/ch-navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SearchBar } from '@/components/search-bar'
import { LogIn, LogOut, Clock, User, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import type { CheckIn, User as UserType } from '@/lib/types'

export default function EmployeeCheckinPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [members, setMembers] = useState<UserType[]>([])
  const [todayCheckIns, setTodayCheckIns] = useState<CheckIn[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'EMPLOYEE')) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      const [membersRes, checkInsRes] = await Promise.all([
        fetch('/api/members?role=CLIENT'),
        fetch('/api/check-ins?today=true'),
      ])

      const membersData = await membersRes.json()
      const checkInsData = await checkInsRes.json()

      if (membersData.success) setMembers(membersData.data)
      if (checkInsData.success) setTodayCheckIns(checkInsData.data)
    } catch (error) {
      toast.error('Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckIn = async (userId: string, userName: string) => {
    try {
      const response = await fetch('/api/check-ins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })

      const data = await response.json()
      if (data.success) {
        toast.success(`✅ Check-in registrado para ${userName}`)
        fetchData()
      } else {
        toast.error(data.error || 'Error al registrar check-in')
      }
    } catch (error) {
      toast.error('Error al procesar check-in')
    }
  }

  const handleCheckOut = async (checkInId: string, userName: string) => {
    try {
      const response = await fetch('/api/check-ins', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkInId }),
      })

      const data = await response.json()
      if (data.success) {
        toast.success(`✅ Check-out registrado para ${userName}`)
        fetchData()
      } else {
        toast.error(data.error || 'Error al registrar check-out')
      }
    } catch (error) {
      toast.error('Error al procesar check-out')
    }
  }

  if (isLoading || !user || loading) {
    return (
      <div className="min-h-screen ch-gradient flex items-center justify-center">
        <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getCheckInStatus = (userId: string) => {
    return todayCheckIns.find(
      (checkIn) => checkIn.userId.toString() === userId && !checkIn.checkOutTime
    )
  }

  return (
    <div className="min-h-screen ch-gradient">
      <CHNavbar user={user} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Sistema de Check-in
          </h1>
          <p className="text-muted-foreground">
            Registra la entrada y salida de los miembros
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <LogIn className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Check-ins Hoy</p>
                  <p className="text-2xl font-bold text-foreground">{todayCheckIns.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Actualmente en Gym</p>
                  <p className="text-2xl font-bold text-foreground">
                    {todayCheckIns.filter(c => !c.checkOutTime).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Miembros</p>
                  <p className="text-2xl font-bold text-foreground">{members.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Búsqueda */}
        <Card className="bg-card border-border mb-6">
          <CardHeader>
            <CardTitle className="text-foreground">Buscar Miembro</CardTitle>
            <CardDescription className="text-muted-foreground">
              Busca por nombre o email para registrar check-in/check-out
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar miembro por nombre o email..."
              className="mb-4"
            />

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {filteredMembers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No se encontraron miembros
                </div>
              ) : (
                filteredMembers.map((member) => {
                  const activeCheckIn = getCheckInStatus(member._id?.toString() || '')
                  const isCheckedIn = !!activeCheckIn

                  return (
                    <div
                      key={member._id?.toString()}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {isCheckedIn ? (
                          <>
                            <Badge className="bg-green-500/20 text-green-500">
                              En el gym
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCheckOut(activeCheckIn._id?.toString() || '', member.name)}
                            >
                              <LogOut className="mr-2 h-4 w-4" />
                              Check-out
                            </Button>
                          </>
                        ) : (
                          <Button
                            className="ch-red-gradient text-white"
                            size="sm"
                            onClick={() => handleCheckIn(member._id?.toString() || '', member.name)}
                          >
                            <LogIn className="mr-2 h-4 w-4" />
                            Check-in
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Check-ins del día */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Check-ins de Hoy</CardTitle>
            <CardDescription className="text-muted-foreground">
              Registro de asistencias del día
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {todayCheckIns.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No hay check-ins registrados hoy
                </div>
              ) : (
                todayCheckIns.slice().reverse().map((checkIn) => {
                  const member = members.find(m => m._id?.toString() === checkIn.userId.toString())
                  return (
                    <div
                      key={checkIn._id?.toString()}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${checkIn.checkOutTime ? 'bg-muted-foreground' : 'bg-green-500'}`} />
                        <div>
                          <p className="font-medium text-foreground">{member?.name || 'Usuario desconocido'}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <LogIn className="h-3 w-3" />
                              {new Date(checkIn.checkInTime).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {checkIn.checkOutTime && (
                              <span className="flex items-center gap-1">
                                <LogOut className="h-3 w-3" />
                                {new Date(checkIn.checkOutTime).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {checkIn.checkOutTime ? (
                        <Badge variant="outline">Completado</Badge>
                      ) : (
                        <Badge className="bg-green-500/20 text-green-500">En el gym</Badge>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
