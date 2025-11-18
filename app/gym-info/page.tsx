'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { CHNavbar } from '@/components/ch-navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Phone, Clock, Mail, Facebook, Instagram, Dumbbell } from 'lucide-react'

export default function GymInfoPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
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

  const schedules = [
    { day: 'Lunes', hours: '4:30 – 22:00' },
    { day: 'Martes', hours: '4:30 – 22:00' },
    { day: 'Miércoles', hours: '4:30 – 22:00' },
    { day: 'Jueves', hours: '4:30 – 22:00' },
    { day: 'Viernes', hours: '4:30 – 22:00' },
    { day: 'Sábado', hours: '6:00 – 14:00' },
    { day: 'Domingo', hours: 'Cerrado' }
  ]

  return (
    <div className="min-h-screen ch-gradient">
      <CHNavbar user={user} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 border-2 border-primary mb-4 overflow-hidden">
              <img 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-8gY1DHpsxOJRx4mlidSHIgsoaCsFxD.png" 
                alt="CH Club Logo" 
                className="h-full w-full object-cover"
              />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              CH-Club Gym
            </h1>
            <p className="text-muted-foreground text-lg">
              Tu gimnasio de confianza en San Juan del Río
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Ubicación */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Ubicación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-foreground font-medium mb-2">
                    C. Fernando de Tapia 82
                  </p>
                  <p className="text-muted-foreground">
                    76807, San Juan del Río, Qro.
                  </p>
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=C.+Fernando+de+Tapia+82,+76807,+San+Juan+del+Río"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:underline text-sm"
                >
                  Ver en Google Maps →
                </a>
              </CardContent>
            </Card>

            {/* Contacto */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Teléfono</p>
                  <a 
                    href="tel:4272722124"
                    className="text-foreground font-medium hover:text-primary transition-colors"
                  >
                    427 272 2124
                  </a>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">WhatsApp</p>
                  <a 
                    href="https://wa.me/524272722124"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground font-medium hover:text-primary transition-colors"
                  >
                    427 272 2124
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Horarios */}
          <Card className="bg-card border-border mb-6">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Horarios de Atención
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Nuestros horarios de servicio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {schedules.map((schedule, index) => (
                  <div 
                    key={index}
                    className={`flex justify-between items-center p-3 rounded-lg ${
                      schedule.hours === 'Cerrado' 
                        ? 'bg-destructive/10 border border-destructive/30' 
                        : 'bg-primary/10 border border-primary/30'
                    }`}
                  >
                    <span className="font-medium text-foreground">{schedule.day}</span>
                    <span className={`${
                      schedule.hours === 'Cerrado' 
                        ? 'text-destructive' 
                        : 'text-primary'
                    } font-semibold`}>
                      {schedule.hours}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Servicios */}
          <Card className="bg-card border-border mb-6">
            <CardHeader>
              <CardTitle className="text-foreground">Nuestros Servicios</CardTitle>
              <CardDescription className="text-muted-foreground">
                Todo lo que necesitas para alcanzar tus metas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Dumbbell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Área de Pesas</h3>
                    <p className="text-sm text-muted-foreground">Equipamiento completo para entrenamiento de fuerza</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Dumbbell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Cardio</h3>
                    <p className="text-sm text-muted-foreground">Caminadoras, bicicletas y más equipos cardiovasculares</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Dumbbell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Entrenadores Certificados</h3>
                    <p className="text-sm text-muted-foreground">Personal capacitado para ayudarte</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Dumbbell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Rutinas Personalizadas</h3>
                    <p className="text-sm text-muted-foreground">Programas adaptados a tus objetivos</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mapa */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">¿Cómo llegar?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video rounded-lg overflow-hidden border border-border">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3740.5!2d-99.9893!3d20.3886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDIzJzE5LjAiTiA5OcKwNTknMjEuNCJX!5e0!3m2!1ses!2smx!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
