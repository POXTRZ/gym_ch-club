'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      // Redirect to role-specific dashboard
      switch (user.role) {
        case 'CLIENT':
          router.push('/client/dashboard')
          break
        case 'EMPLOYEE':
          router.push('/employee/checkin')
          break
        case 'TRAINER':
          router.push('/trainer/clients')
          break
        case 'ADMIN':
          router.push('/admin/dashboard')
          break
      }
    }
  }, [user, isLoading, router])

  return (
    <div className="min-h-screen ch-gradient flex items-center justify-center">
      <div className="text-center">
        <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    </div>
  )
}
