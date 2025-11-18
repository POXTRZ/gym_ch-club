'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { CHNavbar } from '@/components/ch-navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Receipt, Calendar, DollarSign, Package, User } from 'lucide-react'
import { toast } from 'sonner'

interface SaleProduct {
  productId: string
  name: string
  price: number
  quantity: number
  subtotal: number
}

interface Sale {
  _id: string
  employeeId: string
  employeeName?: string
  products: SaleProduct[]
  total: number
  createdAt: string
}

export default function SalesHistoryPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'today'>('all')

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'EMPLOYEE')) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchSales()
    }
  }, [user, filter])

  const fetchSales = async () => {
    try {
      const url = filter === 'today' ? '/api/sales?today=true' : '/api/sales'
      const response = await fetch(url)
      const data = await response.json()
      if (data.success) {
        // Obtener nombres de empleados
        const salesWithNames = await Promise.all(
          data.data.map(async (sale: any) => {
            try {
              const userRes = await fetch(`/api/users?id=${sale.employeeId}`)
              const userData = await userRes.json()
              return {
                ...sale,
                employeeName: userData.success ? userData.data.name : 'Empleado',
              }
            } catch {
              return { ...sale, employeeName: 'Empleado' }
            }
          })
        )
        setSales(salesWithNames)
      }
    } catch (error) {
      toast.error('Error al cargar historial de ventas')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getTotalSales = () => {
    return sales.reduce((sum, sale) => sum + sale.total, 0)
  }

  const getTotalProducts = () => {
    return sales.reduce((sum, sale) => {
      return sum + sale.products.reduce((pSum, p) => pSum + p.quantity, 0)
    }, 0)
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Historial de Ventas
          </h1>
          <p className="text-muted-foreground">
            Revisa todas las ventas realizadas
          </p>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-6">
          <Badge
            variant={filter === 'all' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setFilter('all')}
          >
            Todas
          </Badge>
          <Badge
            variant={filter === 'today' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setFilter('today')}
          >
            Hoy
          </Badge>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Receipt className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Ventas</p>
                  <p className="text-2xl font-bold text-foreground">{sales.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ingresos</p>
                  <p className="text-2xl font-bold text-foreground">
                    ${getTotalSales().toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Productos Vendidos</p>
                  <p className="text-2xl font-bold text-foreground">{getTotalProducts()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de tickets */}
        {sales.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-16 text-center">
              <Receipt className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No hay ventas registradas
              </h3>
              <p className="text-muted-foreground">
                {filter === 'today' 
                  ? 'No se han realizado ventas hoy'
                  : 'Aún no se han registrado ventas'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sales.map((sale) => (
              <Card key={sale._id} className="bg-card border-border hover:border-primary transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Receipt className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">Ticket #{sale._id.slice(-6)}</CardTitle>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {sale.products.length} productos
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-2 text-xs mt-2">
                    <Calendar className="h-3 w-3" />
                    {formatDate(sale.createdAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Empleado */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{sale.employeeName}</span>
                  </div>

                  {/* Productos */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Productos:</p>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {sale.products.map((product, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center text-sm p-2 rounded bg-muted/30"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              ${product.price} × {product.quantity}
                            </p>
                          </div>
                          <p className="font-semibold text-foreground">
                            ${product.subtotal.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="pt-3 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground">TOTAL:</span>
                      <span className="text-2xl font-bold text-primary">
                        ${sale.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
