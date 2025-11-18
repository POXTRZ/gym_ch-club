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
import { DataTable } from '@/components/data-table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertCircle, Package, Plus, Edit, DollarSign } from 'lucide-react'
import { toast } from 'sonner'
import type { Product } from '@/lib/types'

export default function EmployeeInventoryPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    category: 'SUPPLEMENT',
    price: '',
    stock: '',
    minStock: '',
    description: '',
    imageUrl: '',
  })

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
        setProducts(data.data)
      }
    } catch (error) {
      toast.error('Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const method = editingProduct ? 'PUT' : 'POST'
      const bodyData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        minStock: parseInt(formData.minStock),
        description: formData.description,
        images: formData.imageUrl ? [formData.imageUrl] : [],
      }

      // Si estamos editando, agregar el _id al body
      if (editingProduct) {
        Object.assign(bodyData, { _id: editingProduct._id })
      }

      const response = await fetch('/api/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      })

      const data = await response.json()
      if (data.success) {
        toast.success(editingProduct ? 'Producto actualizado' : 'Producto agregado')
        setOpenDialog(false)
        resetForm()
        fetchProducts()
      } else {
        toast.error(data.error || 'Error al guardar producto')
      }
    } catch (error) {
      toast.error('Error al procesar la solicitud')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'SUPPLEMENT',
      price: '',
      stock: '',
      minStock: '',
      description: '',
      imageUrl: '',
    })
    setEditingProduct(null)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      minStock: product.minStock.toString(),
      description: product.description || '',
      imageUrl: product.images && product.images.length > 0 ? product.images[0] : '',
    })
    setOpenDialog(true)
  }

  if (isLoading || !user || loading) {
    return (
      <div className="min-h-screen ch-gradient flex items-center justify-center">
        <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const lowStockProducts = products.filter(p => p.stock <= p.minStock)

  const columns = [
    {
      key: 'image',
      label: 'Imagen',
      render: (product: Product) => (
        product.images && product.images.length > 0 ? (
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-12 h-12 object-cover rounded-md"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/48?text=Sin+Imagen'
            }}
          />
        ) : (
          <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
            <Package className="h-6 w-6 text-muted-foreground" />
          </div>
        )
      ),
    },
    {
      key: 'name',
      label: 'Producto',
    },
    {
      key: 'category',
      label: 'Categoría',
      render: (product: Product) => {
        const categories: Record<string, string> = {
          SUPPLEMENT: 'Suplemento',
          APPAREL: 'Ropa',
          EQUIPMENT: 'Equipo',
          ACCESSORY: 'Accesorio',
        }
        return <Badge variant="outline">{categories[product.category]}</Badge>
      },
    },
    {
      key: 'price',
      label: 'Precio',
      render: (product: Product) => <span>${product.price}</span>,
    },
    {
      key: 'stock',
      label: 'Stock',
      render: (product: Product) => (
        <Badge className={product.stock <= product.minStock ? 'bg-destructive/20 text-destructive' : 'bg-green-500/20 text-green-500'}>
          {product.stock} unidades
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (product: Product) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleEdit(product)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  return (
    <div className="min-h-screen ch-gradient">
      <CHNavbar user={user} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Inventario
            </h1>
            <p className="text-muted-foreground">
              Gestiona productos y stock del gimnasio
            </p>
          </div>

          <Dialog open={openDialog} onOpenChange={(open) => {
            setOpenDialog(open)
            if (!open) resetForm()
          }}>
            <DialogTrigger asChild>
              <Button className="ch-red-gradient text-white">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Producto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
                <DialogDescription>
                  {editingProduct ? 'Actualiza la información del producto' : 'Agrega un nuevo producto al inventario'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del producto</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Proteína Whey 1kg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <select
                    id="category"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="SUPPLEMENT">Suplemento</option>
                    <option value="APPAREL">Ropa</option>
                    <option value="EQUIPMENT">Equipo</option>
                    <option value="ACCESSORY">Accesorio</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Precio</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="299.99"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      placeholder="50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minStock">Stock Mínimo</Label>
                  <Input
                    id="minStock"
                    type="number"
                    required
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                    placeholder="10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descripción opcional del producto"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">URL de Imagen (Opcional)</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  {formData.imageUrl && (
                    <div className="mt-2">
                      <img 
                        src={formData.imageUrl} 
                        alt="Vista previa" 
                        className="w-full h-32 object-cover rounded-md"
                        onError={(e) => {
                          e.currentTarget.src = ''
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setOpenDialog(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1 ch-red-gradient text-white">
                    {editingProduct ? 'Actualizar' : 'Agregar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Alertas de stock bajo */}
        {lowStockProducts.length > 0 && (
          <Card className="bg-destructive/10 border-destructive/30 mb-6">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Alertas de Stock Bajo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {lowStockProducts.map((product) => (
                  <div key={product._id?.toString()} className="flex items-center justify-between p-2 rounded bg-card">
                    <span className="text-sm font-medium">{product.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {product.stock} / {product.minStock} unidades
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Estadísticas rápidas */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Productos</p>
                  <p className="text-2xl font-bold text-foreground">{products.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stock Bajo</p>
                  <p className="text-2xl font-bold text-foreground">{lowStockProducts.length}</p>
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
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="text-2xl font-bold text-foreground">
                    ${products.reduce((sum, p) => sum + p.price * p.stock, 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de productos */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Productos en Inventario</CardTitle>
            <CardDescription className="text-muted-foreground">
              Gestiona el stock y precios de todos los productos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={products}
              columns={columns}
              searchable
              searchPlaceholder="Buscar productos..."
            />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
