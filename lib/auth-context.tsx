'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type UserRole = 'CLIENT' | 'EMPLOYEE' | 'TRAINER' | 'ADMIN'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('ch-club-user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Simulated login - replace with actual API call
    console.log('[v0] Login attempt:', email)
    
    // Demo users for testing
    const demoUsers: Record<string, User> = {
      'client@chclub.com': {
        id: '1',
        email: 'client@chclub.com',
        name: 'Juan Pérez',
        role: 'CLIENT',
      },
      'employee@chclub.com': {
        id: '2',
        email: 'employee@chclub.com',
        name: 'María García',
        role: 'EMPLOYEE',
      },
      'trainer@chclub.com': {
        id: '3',
        email: 'trainer@chclub.com',
        name: 'Carlos Hernández',
        role: 'TRAINER',
      },
      'admin@chclub.com': {
        id: '4',
        email: 'admin@chclub.com',
        name: 'Ana Martínez',
        role: 'ADMIN',
      },
    }

    const foundUser = demoUsers[email]
    if (foundUser && password === 'password123') {
      setUser(foundUser)
      localStorage.setItem('ch-club-user', JSON.stringify(foundUser))
    } else {
      throw new Error('Credenciales inválidas')
    }
  }

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    // Simulated registration - replace with actual API call
    console.log('[v0] Registration attempt:', email, name, role)
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role,
    }
    
    setUser(newUser)
    localStorage.setItem('ch-club-user', JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('ch-club-user')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
