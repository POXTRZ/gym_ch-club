'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { CHNavbar } from '@/components/ch-navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, UserCheck, AlertCircle, CheckCircle2 } from 'lucide-react'

interface Client {
  id: string
  name: string
  email: string
  membershipStatus: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED'
  lastCheckIn?: string
  membershipEndDate: string
}

export default function EmployeeCheckinPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [recentCheckIns, setRecentCheckIns] = useState<Array<{ client: Client; time: string }>>([])
  
  const [clients] = useState<Client[]>([
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan@example.com',
      membershipStatus: 'ACTIVE',
      membershipEndDate: '2025-02-01',
    },
    {
      id: '2',
      name: 'María González',
      email: 'maria@example.com',
      membershipStatus: 'ACTIVE',
      membershipEndDate: '2025-02-15',
    },
    {
      id: '3',
      name: 'Carlos López',
      email: 'carlos@example.com',
      membershipStatus: 'EXPIRED',
      membershipEndDate: '2024-12-31',
    },
  ])

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'EMPLOYEE')) {
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

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCheckIn = (client: Client) => {
    if (client.membershipStatus !== 'ACTIVE') {
      alert(`No se puede realizar check-in. Membresía: ${client.membershipStatus}`)
      return
    }

    const now = new Date()
    const checkInTime = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    
    setRecentCheckIns([
      { client, time: checkInTime },
      ...recentCheckIns.slice(0, 4),
    ])
    
    setSelectedClient(null)
    setSearchTerm('')
    console.log('[v0] Check-in registered for:', client.name)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/50">ACTIVA</Badge>
      case 'EXPIRED':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/50">VENCIDA</Badge>
      case 'SUSPENDED':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">SUSPENDIDA</Badge>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen ch-gradient">
      <CHNavbar user={user} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Control de Acceso
          </h1>
          <p className="text-muted-foreground">
            Registra el check-in de los clientes
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Search and Check-in */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Buscar Cliente</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Ingresa el nombre o email del cliente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-input border-border"
                  />
                </div>

                {searchTerm && (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredClients.length > 0 ? (
                      filteredClients.map((client) => (
                        <Card
                          key={client.id}
                          className="bg-muted/50 border-border cursor-pointer hover:border-primary transition-colors"
                          onClick={() => setSelectedClient(client)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-foreground">{client.name}</p>
                                <p className="text-sm text-muted-foreground">{client.email}</p>
                              </div>
                              {getStatusBadge(client.membershipStatus)}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No se encontraron clientes
                      </div>
                    )}
                  </div>
                )}

                {selectedClient && (
                  <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-foreground">{selectedClient.name}</h3>
                            <p className="text-sm text-muted-foreground">{selectedClient.email}</p>
                          </div>
                          {getStatusBadge(selectedClient.membershipStatus)}
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Vencimiento</p>
                            <p className="text-base font-semibold text-foreground">
                              {new Date(selectedClient.membershipEndDate).toLocaleDateString('es-MX')}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Estado</p>
                            <p className="text-base font-semibold text-foreground">
                              {selectedClient.membershipStatus}
                            </p>
                          </div>
                        </div>

                        {selectedClient.membershipStatus === 'ACTIVE' ? (
                          <Button
                            onClick={() => handleCheckIn(selectedClient)}
                            className="w-full ch-red-gradient text-white font-semibold"
                            size="lg"
                          >
                            <CheckCircle2 className="mr-2 h-5 w-5" />
                            Registrar Check-in
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                            <AlertCircle className="h-5 w-5 text-destructive" />
                            <p className="text-sm text-destructive font-medium">
                              No se puede realizar check-in. Membresía {selectedClient.membershipStatus.toLowerCase()}.
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Check-ins */}
          <div className="lg:col-span-1">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-primary" />
                  Check-ins Recientes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentCheckIns.length > 0 ? (
                  recentCheckIns.map((checkIn, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="text-sm font-medium text-foreground">{checkIn.client.name}</p>
                        <p className="text-xs text-muted-foreground">{checkIn.time}</p>
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay check-ins recientes
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
