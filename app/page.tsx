import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dumbbell, Users, BarChart3, ShoppingCart, Calendar, TrendingUp } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen ch-gradient">
      {/* Hero Section */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-8gY1DHpsxOJRx4mlidSHIgsoaCsFxD.png" 
                alt="CH Club Logo" 
                className="h-16 w-16 object-contain"
              />
              <div>
                <h1 className="text-3xl font-bold text-foreground">CH Club</h1>
                <p className="text-sm text-muted-foreground">Sistema de Gestión Integral</p>
              </div>
            </div>
            <Button asChild size="lg" className="ch-red-gradient text-white font-semibold">
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-foreground mb-4 text-balance">
            Bienvenido a CH Club
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Tu gimnasio de confianza. Gestiona tu membresía, rutinas y progreso desde un solo lugar.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="bg-card border-border hover:ch-border-glow transition-all duration-300">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-foreground">Portal de Clientes</CardTitle>
              <CardDescription className="text-muted-foreground">
                Consulta tu membresía, visualiza rutinas y registra tu progreso físico
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card border-border hover:ch-border-glow transition-all duration-300">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Dumbbell className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-foreground">Rutinas Personalizadas</CardTitle>
              <CardDescription className="text-muted-foreground">
                Accede a tu plan de entrenamiento asignado por tu entrenador personal
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card border-border hover:ch-border-glow transition-all duration-300">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-foreground">Control de Asistencia</CardTitle>
              <CardDescription className="text-muted-foreground">
                Registro automático de check-in y seguimiento de tu compromiso
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card border-border hover:ch-border-glow transition-all duration-300">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-foreground">Tienda Integrada</CardTitle>
              <CardDescription className="text-muted-foreground">
                Productos de nutrición y suplementos disponibles en el gimnasio
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card border-border hover:ch-border-glow transition-all duration-300">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-foreground">Seguimiento de Progreso</CardTitle>
              <CardDescription className="text-muted-foreground">
                Registra peso, medidas y visualiza tu evolución en el tiempo
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card border-border hover:ch-border-glow transition-all duration-300">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-foreground">Panel Administrativo</CardTitle>
              <CardDescription className="text-muted-foreground">
                Reportes detallados de ingresos, asistencia y operaciones
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
          <CardContent className="p-12 text-center">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Comienza tu transformación hoy
            </h3>
            <p className="text-muted-foreground mb-8 text-lg">
              Únete a la familia CH Club y alcanza tus metas de fitness
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button asChild size="lg" className="ch-red-gradient text-white font-semibold">
                <Link href="/register">Registrarse</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10">
                <Link href="/login">Ya tengo cuenta</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-8gY1DHpsxOJRx4mlidSHIgsoaCsFxD.png" 
                alt="CH Club" 
                className="h-10 w-10 object-contain"
              />
              <p className="text-sm text-muted-foreground">
                © 2025 CH Club. Todos los derechos reservados.
              </p>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/contacto" className="hover:text-primary transition-colors">Contacto</Link>
              <Link href="/horarios" className="hover:text-primary transition-colors">Horarios</Link>
              <Link href="/clases" className="hover:text-primary transition-colors">Clases</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
