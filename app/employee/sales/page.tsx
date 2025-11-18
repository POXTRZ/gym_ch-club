'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { CHNavbar } from '@/components/ch-navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SearchBar } from '@/components/search-bar'
import { ShoppingCart, Plus, Minus, Trash2, DollarSign, Package, TrendingUp, X } from 'lucide-react'
import { toast } from 'sonner'

interface Product {
  _id?: any
  name: string
  category: string
  price: number
  stock: number
  description?: string
  images?: string[]
}

interface CartItem extends Product {
  quantity: number
}

export default function EmployeeSalesPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'EMPLOYEE')) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchProducts()
    }
  }, [user])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      if (data.success) {
        // Solo productos con stock disponible
        setProducts(data.data.filter((p: Product) => p.stock > 0))
      }
    } catch (error) {
      toast.error('Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item._id?.toString() === product._id?.toString())
    
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast.error(`Stock máximo alcanzado: ${product.stock}`)
        return
      }
      setCart(
        cart.map((item) =>
          item._id?.toString() === product._id?.toString()
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      )
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
    toast.success(`${product.name} agregado al carrito`)
  }

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prevCart) => {
      const item = prevCart.find((i) => i._id?.toString() === productId)
      if (!item) return prevCart

      const newQuantity = item.quantity + delta
      if (newQuantity <= 0) return prevCart.filter((i) => i._id?.toString() !== productId)
      if (newQuantity > item.stock) {
        toast.error(`Stock máximo: ${item.stock}`)
        return prevCart
      }

      return prevCart.map((i) =>
        i._id?.toString() === productId ? { ...i, quantity: newQuantity } : i
      )
    })
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item._id?.toString() !== productId))
  }

  const clearCart = () => {
    setCart([])
  }

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('El carrito está vacío')
      return
    }

    setProcessing(true)
    try {
      const saleData = {
        employeeId: user?.id,
        products: cart.map((item) => ({
          productId: item._id?.toString(),
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total: calculateTotal(),
      }

      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saleData),
      })

      const data = await response.json()
      if (data.success) {
        toast.success('✅ Venta realizada exitosamente')
        clearCart()
        fetchProducts() // Actualizar inventario
      } else {
        toast.error(data.error || 'Error al procesar venta')
      }
    } catch (error) {
      toast.error('Error al procesar venta')
    } finally {
      setProcessing(false)
    }
  }

  if (isLoading || !user || loading) {
    return (
      <div className="min-h-screen ch-gradient flex items-center justify-center">
        <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const total = calculateTotal()

  return (
    <div className="min-h-screen ch-gradient">
      <CHNavbar user={user} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Punto de Venta
          </h1>
          <p className="text-muted-foreground">
            Registra ventas y gestiona el inventario
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Productos disponibles */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Productos Disponibles</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Selecciona productos para agregar a la venta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SearchBar
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Buscar producto por nombre o categoría..."
                  className="mb-4"
                />

                <div className="grid md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">
                  {filteredProducts.length === 0 ? (
                    <div className="col-span-2 text-center py-8 text-muted-foreground">
                      No hay productos disponibles
                    </div>
                  ) : (
                    filteredProducts.map((product) => (
                      <div
                        key={product._id?.toString()}
                        className="p-4 rounded-lg bg-muted/30 border border-border hover:border-primary transition-colors"
                      >
                        <div className="flex gap-3 mb-3">
                          {/* Imagen del producto */}
                          {product.images && product.images.length > 0 ? (
                            <img 
                              src={product.images[0]} 
                              alt={product.name}
                              className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/80?text=Sin+Imagen'
                              }}
                            />
                          ) : (
                            <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                              <Package className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                          
                          {/* Información del producto */}
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <h3 className="font-semibold text-foreground">{product.name}</h3>
                                <Badge variant="outline" className="text-xs mt-1">
                                  {product.category}
                                </Badge>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-primary">
                                  ${product.price.toFixed(2)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Stock: {product.stock}
                                </p>
                              </div>
                            </div>
                            {product.description && (
                              <p className="text-sm text-muted-foreground mb-2">
                                {product.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button
                          className="w-full ch-red-gradient text-white"
                          size="sm"
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Agregar al carrito
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Carrito de compras */}
          <div className="lg:col-span-1">
            <Card className="bg-card border-border sticky top-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Carrito ({cart.length})
                  </CardTitle>
                  {cart.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearCart}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Carrito vacío</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 mb-4 max-h-[400px] overflow-y-auto">
                      {cart.map((item) => (
                        <div
                          key={item._id?.toString()}
                          className="p-3 rounded-lg bg-muted/30 border border-border"
                        >
                          <div className="flex gap-2 mb-2">
                            {/* Imagen del producto en el carrito */}
                            {item.images && item.images.length > 0 ? (
                              <img 
                                src={item.images[0]} 
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://via.placeholder.com/48?text=Sin+Imagen'
                                }}
                              />
                            ) : (
                              <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                                <Package className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                            
                            <div className="flex justify-between items-start flex-1">
                              <div className="flex-1">
                                <p className="font-medium text-foreground text-sm">
                                  {item.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  ${item.price.toFixed(2)} c/u
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFromCart(item._id?.toString())}
                                className="h-6 w-6 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item._id?.toString(), -1)}
                                className="h-7 w-7 p-0"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="font-medium text-foreground w-8 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item._id?.toString(), 1)}
                                className="h-7 w-7 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="font-semibold text-foreground">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold text-foreground">Total:</span>
                        <span className="text-2xl font-bold text-primary">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                      <Button
                        className="w-full ch-red-gradient text-white"
                        onClick={handleCheckout}
                        disabled={processing}
                      >
                        {processing ? (
                          <>
                            <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Procesando...
                          </>
                        ) : (
                          <>
                            <DollarSign className="mr-2 h-4 w-4" />
                            Finalizar Venta
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
