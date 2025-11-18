'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { CHNavbar } from '@/components/ch-navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Package, Plus, Minus, AlertTriangle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface Product {
  id: string
  name: string
  category: 'SUPPLEMENT' | 'BEVERAGE' | 'MERCHANDISE'
  price: number
  stock: number
  minStock: number
  image: string
}

interface CartItem extends Product {
  quantity: number
}

export default function EmployeeInventoryPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  
  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'Proteína Whey 1kg',
      category: 'SUPPLEMENT',
      price: 450,
      stock: 12,
      minStock: 5,
      image: '/protein-powder.jpg',
    },
    {
      id: '2',
      name: 'Creatina 300g',
      category: 'SUPPLEMENT',
      price: 280,
      stock: 8,
      minStock: 5,
      image: '/creatine-supplement.png',
    },
    {
      id: '3',
      name: 'Agua 600ml',
      category: 'BEVERAGE',
      price: 15,
      stock: 45,
      minStock: 20,
      image: '/clear-water-bottle.png',
    },
    {
      id: '4',
      name: 'Bebida Deportiva',
      category: 'BEVERAGE',
      price: 25,
      stock: 30,
      minStock: 15,
      image: '/sports-drink.jpg',
    },
    {
      id: '5',
      name: 'Toalla CH Club',
      category: 'MERCHANDISE',
      price: 150,
      stock: 3,
      minStock: 5,
      image: '/gym-towel.jpg',
    },
    {
      id: '6',
      name: 'Guantes de Entrenamiento',
      category: 'MERCHANDISE',
      price: 200,
      stock: 7,
      minStock: 5,
      image: '/workout-gloves.jpg',
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

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id)
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(
          cart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        )
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId: string) => {
    const existingItem = cart.find((item) => item.id === productId)
    if (existingItem && existingItem.quantity > 1) {
      setCart(
        cart.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
      )
    } else {
      setCart(cart.filter((item) => item.id !== productId))
    }
  }

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const handleCheckout = () => {
    console.log('[v0] Processing sale:', cart)
    alert(`Venta completada: $${getTotal()}`)
    setCart([])
    setIsCheckoutOpen(false)
  }

  const getCategoryBadge = (category: string) => {
    const colors = {
      SUPPLEMENT: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      BEVERAGE: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50',
      MERCHANDISE: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
    }
    return colors[category as keyof typeof colors] || ''
  }

  const lowStockProducts = products.filter((p) => p.stock <= p.minStock)

  return (
    <div className="min-h-screen ch-gradient">
      <CHNavbar user={user} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Inventario y Ventas
            </h1>
            <p className="text-muted-foreground">
              Gestiona productos y registra ventas
            </p>
          </div>
          <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
            <DialogTrigger asChild>
              <Button className="ch-red-gradient text-white font-semibold relative">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Carrito ({cart.length})
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-primary border-0">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">Carrito de Compras</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Revisa los productos antes de completar la venta
                </DialogDescription>
              </DialogHeader>
              
              {cart.length > 0 ? (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">${item.price} x {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromCart(item.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-semibold text-foreground w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addToCart(item)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t border-border pt-4">
                    <div className="flex items-center justify-between text-lg font-bold">
                      <span className="text-foreground">Total:</span>
                      <span className="text-primary">${getTotal()}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  El carrito está vacío
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCheckoutOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className="ch-red-gradient text-white"
                >
                  Completar Venta
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {lowStockProducts.length > 0 && (
          <Card className="bg-yellow-500/10 border-yellow-500/30 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <p className="text-sm text-foreground">
                  <strong>Alerta de Stock:</strong> {lowStockProducts.length} producto(s) con stock bajo
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="bg-card border-border hover:border-primary transition-colors">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <Badge className={getCategoryBadge(product.category)}>
                    {product.category}
                  </Badge>
                  {product.stock <= product.minStock && (
                    <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                      Stock Bajo
                    </Badge>
                  )}
                </div>
                <div className="aspect-square rounded-lg bg-muted overflow-hidden mb-3">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="text-lg text-foreground">{product.name}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Stock: {product.stock} unidades
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">${product.price}</span>
                </div>
                <Button
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className="w-full"
                  variant="outline"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar al Carrito
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
