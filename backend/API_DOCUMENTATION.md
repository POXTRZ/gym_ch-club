# API Documentation - Gimnasio Microservicios

## Tabla de Contenidos
1. [Auth Service (Puerto 3001)](#auth-service)
2. [User Service (Puerto 3002)](#user-service)
3. [Membership Service (Puerto 3003)](#membership-service)
4. [Payment Service (Puerto 3004)](#payment-service)
5. [Class Service (Puerto 3005)](#class-service)
6. [Booking Service (Puerto 3006)](#booking-service)
7. [Trainer Service (Puerto 3007)](#trainer-service)
8. [Códigos de Error](#códigos-de-error)
9. [Ejemplos de Integración](#ejemplos-de-integración)

---

## Auth Service

**Base URL:** `http://localhost:3001/api/auth`

### Health Check
```
GET /health
```
Respuesta:
```json
{
  "success": true,
  "service": "auth-service",
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### POST /register - Registro de usuarios
Registra un nuevo usuario en el sistema.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "Juan",
  "lastName": "Pérez",
  "phone": "+56912345678",
  "role": "member"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "firstName": "Juan",
      "lastName": "Pérez",
      "phone": "+56912345678",
      "role": "member",
      "avatar": null
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Usuario registrado exitosamente"
}
```

### POST /login - Iniciar sesión
Autentica un usuario y devuelve un token JWT.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "firstName": "Juan",
      "lastName": "Pérez",
      "phone": "+56912345678",
      "role": "member",
      "avatar": null
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login exitoso"
}
```

### GET /me - Usuario actual
Obtiene la información del usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "phone": "+56912345678",
    "role": "member",
    "avatar": null,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### POST /logout - Cerrar sesión
Cierra la sesión del usuario.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente"
}
```

### POST /refresh - Renovar token
Renueva un token JWT.

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Token renovado exitosamente"
}
```

---

## User Service

**Base URL:** `http://localhost:3002/api/users`

Todos los endpoints requieren autenticación con token JWT.

### GET / - Listar usuarios (Admin only)
**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "firstName": "Juan",
      "lastName": "Pérez",
      "phone": "+56912345678",
      "role": "member",
      "avatar": null,
      "isActive": true
    }
  ],
  "count": 1
}
```

### GET /:id - Obtener usuario
**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "phone": "+56912345678",
    "role": "member",
    "avatar": null,
    "isActive": true
  }
}
```

### PUT /:id - Actualizar perfil
**Request:**
```json
{
  "firstName": "Juan Carlos",
  "lastName": "Pérez González",
  "phone": "+56987654321"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "Juan Carlos",
    "lastName": "Pérez González",
    "phone": "+56987654321",
    "role": "member",
    "avatar": null
  },
  "message": "Usuario actualizado exitosamente"
}
```

### DELETE /:id - Eliminar usuario (Admin only)
**Response (200):**
```json
{
  "success": true,
  "message": "Usuario eliminado exitosamente"
}
```

### PUT /:id/avatar - Actualizar foto de perfil
**Request:**
```json
{
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "avatar": "https://example.com/avatar.jpg"
  },
  "message": "Avatar actualizado exitosamente"
}
```

### GET /search - Buscar usuarios
**Query Params:**
- `q` (opcional): Término de búsqueda
- `role` (opcional): admin, member, trainer

**Ejemplo:** `/search?q=juan&role=member`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "email": "juan@example.com",
      "firstName": "Juan",
      "lastName": "Pérez",
      "role": "member"
    }
  ],
  "count": 1
}
```

---

## Membership Service

**Base URL:** `http://localhost:3003/api/memberships`

### GET /plans - Planes disponibles (Público)
**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "type": "basic",
      "name": "Plan Básico",
      "price": 29.99,
      "features": [
        "Acceso a gimnasio",
        "Uso de equipamiento básico",
        "Vestuarios y duchas"
      ],
      "duration": 1
    },
    {
      "type": "premium",
      "name": "Plan Premium",
      "price": 59.99,
      "features": [
        "Acceso a gimnasio",
        "Uso de todo el equipamiento",
        "Clases grupales ilimitadas",
        "Vestuarios y duchas",
        "Asesoramiento nutricional"
      ],
      "duration": 1
    },
    {
      "type": "vip",
      "name": "Plan VIP",
      "price": 99.99,
      "features": [
        "Acceso a gimnasio 24/7",
        "Uso de todo el equipamiento",
        "Clases grupales ilimitadas",
        "Entrenamiento personal (4 sesiones/mes)",
        "Vestuarios premium y spa",
        "Asesoramiento nutricional personalizado",
        "Estacionamiento incluido"
      ],
      "duration": 1
    }
  ]
}
```

### POST / - Crear membresía
**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "planType": "premium",
  "duration": 3
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "planType": "premium",
    "status": "active",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-04-01T00:00:00.000Z",
    "price": 179.97,
    "features": ["..."]
  },
  "message": "Membresía creada exitosamente"
}
```

### GET /:id - Detalles de membresía
**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "userId": {
      "firstName": "Juan",
      "lastName": "Pérez",
      "email": "user@example.com"
    },
    "planType": "premium",
    "status": "active",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-04-01T00:00:00.000Z",
    "price": 179.97,
    "features": ["..."]
  }
}
```

### GET /user/:userId - Membresías del usuario
**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439012",
      "planType": "premium",
      "status": "active",
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-04-01T00:00:00.000Z",
      "price": 179.97
    }
  ],
  "count": 1
}
```

### PUT /:id/renew - Renovar membresía
**Request:**
```json
{
  "months": 1
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "endDate": "2024-05-01T00:00:00.000Z",
    "price": 239.96
  },
  "message": "Membresía renovada exitosamente"
}
```

### PUT /:id/cancel - Cancelar membresía
**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "status": "cancelled"
  },
  "message": "Membresía cancelada exitosamente"
}
```

### GET /:id/status - Verificar estado activo
**Response (200):**
```json
{
  "success": true,
  "data": {
    "membershipId": "507f1f77bcf86cd799439012",
    "planType": "premium",
    "status": "active",
    "isActive": true,
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-04-01T00:00:00.000Z",
    "daysRemaining": 45,
    "features": ["..."]
  }
}
```

---

## Payment Service

**Base URL:** `http://localhost:3004/api/payments`

### POST /webhook - Webhook para procesadores de pago (Público)
**Request:**
```json
{
  "transactionId": "tx_123456",
  "status": "completed"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Webhook procesado exitosamente"
}
```

### POST / - Procesar pago
**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "membershipId": "507f1f77bcf86cd799439012",
  "amount": 59.99,
  "currency": "USD",
  "paymentMethod": "credit_card",
  "transactionId": "tx_123456",
  "description": "Pago mensualidad premium"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "membershipId": "507f1f77bcf86cd799439012",
    "amount": 59.99,
    "currency": "USD",
    "status": "pending",
    "paymentMethod": "credit_card",
    "transactionId": "tx_123456",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Pago procesado exitosamente"
}
```

### GET /:id - Detalles de pago
**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "userId": {
      "firstName": "Juan",
      "lastName": "Pérez",
      "email": "user@example.com"
    },
    "membershipId": {...},
    "amount": 59.99,
    "currency": "USD",
    "status": "completed",
    "paymentMethod": "credit_card",
    "transactionId": "tx_123456"
  }
}
```

### GET /user/:userId - Historial de pagos
**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439013",
      "amount": 59.99,
      "currency": "USD",
      "status": "completed",
      "paymentMethod": "credit_card",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

### GET /:id/invoice - Generar factura
**Response (200):**
```json
{
  "success": true,
  "data": {
    "invoiceNumber": "INV-507f1f77bcf86cd799439013",
    "paymentId": "507f1f77bcf86cd799439013",
    "date": "2024-01-01T00:00:00.000Z",
    "customer": {...},
    "amount": 59.99,
    "currency": "USD",
    "status": "completed",
    "pdfUrl": "/invoices/507f1f77bcf86cd799439013.pdf"
  },
  "message": "Factura generada exitosamente"
}
```

### POST /:id/refund - Procesar reembolso (Admin only)
**Request:**
```json
{
  "reason": "Cliente solicitó cancelación"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "status": "refunded",
    "metadata": {
      "refundReason": "Cliente solicitó cancelación",
      "refundDate": "2024-01-15T00:00:00.000Z"
    }
  },
  "message": "Reembolso procesado exitosamente"
}
```

---

## Class Service

**Base URL:** `http://localhost:3005/api/classes`

### GET / - Listar todas las clases (Público)
**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439014",
      "name": "Yoga Matutino",
      "description": "Clase de yoga para comenzar el día",
      "trainerId": {
        "firstName": "María",
        "lastName": "González"
      },
      "schedule": [
        {
          "dayOfWeek": 1,
          "startTime": "07:00",
          "endTime": "08:00"
        }
      ],
      "capacity": 20,
      "duration": 60,
      "level": "all",
      "isActive": true
    }
  ],
  "count": 1
}
```

### GET /schedule - Horario semanal completo (Público)
**Response (200):**
```json
{
  "success": true,
  "data": {
    "Lunes": [
      {
        "classId": "507f1f77bcf86cd799439014",
        "name": "Yoga Matutino",
        "trainer": {...},
        "startTime": "07:00",
        "endTime": "08:00",
        "capacity": 20,
        "level": "all"
      }
    ],
    "Martes": [...],
    ...
  }
}
```

### GET /trainer/:trainerId - Clases por entrenador (Público)
**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439014",
      "name": "Yoga Matutino",
      "description": "Clase de yoga para comenzar el día",
      "schedule": [...],
      "capacity": 20,
      "level": "all"
    }
  ],
  "count": 1
}
```

### POST / - Crear clase (Admin/Trainer)
**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "name": "Spinning Avanzado",
  "description": "Clase intensiva de spinning",
  "trainerId": "507f1f77bcf86cd799439011",
  "schedule": [
    {
      "dayOfWeek": 2,
      "startTime": "18:00",
      "endTime": "19:00"
    }
  ],
  "capacity": 15,
  "duration": 60,
  "level": "advanced"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439015",
    "name": "Spinning Avanzado",
    "trainerId": {...},
    ...
  },
  "message": "Clase creada exitosamente"
}
```

### GET /:id - Detalles de clase
**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439014",
    "name": "Yoga Matutino",
    "description": "Clase de yoga para comenzar el día",
    "trainerId": {
      "firstName": "María",
      "lastName": "González",
      "email": "maria@example.com",
      "phone": "+56912345678"
    },
    "schedule": [...],
    "capacity": 20,
    "duration": 60,
    "level": "all",
    "isActive": true
  }
}
```

### PUT /:id - Actualizar clase (Admin/Trainer)
### DELETE /:id - Eliminar clase (Admin)

---

## Booking Service

**Base URL:** `http://localhost:3006/api/bookings`

Todos los endpoints requieren autenticación.

### POST / - Reservar clase
**Request:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "classId": "507f1f77bcf86cd799439014",
  "bookingDate": "2024-01-15T07:00:00.000Z",
  "notes": "Primera clase de yoga"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439016",
    "userId": {...},
    "classId": {...},
    "bookingDate": "2024-01-15T07:00:00.000Z",
    "status": "confirmed",
    "notes": "Primera clase de yoga"
  },
  "message": "Reserva creada exitosamente"
}
```

### GET /:id - Detalles de reserva
**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439016",
    "userId": {
      "firstName": "Juan",
      "lastName": "Pérez",
      "email": "user@example.com"
    },
    "classId": {
      "name": "Yoga Matutino",
      "schedule": [...]
    },
    "bookingDate": "2024-01-15T07:00:00.000Z",
    "status": "confirmed"
  }
}
```

### GET /user/:userId - Reservas del usuario
**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439016",
      "classId": {...},
      "bookingDate": "2024-01-15T07:00:00.000Z",
      "status": "confirmed"
    }
  ],
  "count": 1
}
```

### GET /user/:userId/upcoming - Próximas reservas
**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439016",
      "classId": {
        "name": "Yoga Matutino",
        "duration": 60
      },
      "bookingDate": "2024-01-15T07:00:00.000Z",
      "status": "confirmed"
    }
  ],
  "count": 1
}
```

### GET /class/:classId - Reservas de una clase
**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439016",
      "userId": {
        "firstName": "Juan",
        "lastName": "Pérez",
        "email": "user@example.com",
        "phone": "+56912345678"
      },
      "bookingDate": "2024-01-15T07:00:00.000Z",
      "status": "confirmed"
    }
  ],
  "count": 1
}
```

### PUT /:id/cancel - Cancelar reserva
**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439016",
    "status": "cancelled"
  },
  "message": "Reserva cancelada exitosamente"
}
```

---

## Trainer Service

**Base URL:** `http://localhost:3007/api/trainers`

### GET / - Listar entrenadores (Público)
**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439017",
      "userId": {
        "firstName": "María",
        "lastName": "González",
        "email": "maria@example.com",
        "phone": "+56912345678",
        "avatar": "https://example.com/avatar.jpg"
      },
      "specialties": ["Yoga", "Pilates", "Meditación"],
      "bio": "Instructora certificada de yoga con 10 años de experiencia",
      "averageRating": 4.8,
      "isActive": true
    }
  ],
  "count": 1
}
```

### POST / - Crear perfil de entrenador (Admin only)
**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "specialties": ["Yoga", "Pilates"],
  "bio": "Instructora certificada con amplia experiencia",
  "certifications": [
    {
      "name": "Instructor de Yoga RYT-200",
      "institution": "Yoga Alliance",
      "year": 2015
    }
  ],
  "availability": [
    {
      "dayOfWeek": 1,
      "startTime": "07:00",
      "endTime": "12:00"
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439017",
    "userId": {...},
    "specialties": ["Yoga", "Pilates"],
    "bio": "Instructora certificada con amplia experiencia",
    "certifications": [...],
    "availability": [...],
    "averageRating": 0,
    "isActive": true
  },
  "message": "Perfil de entrenador creado exitosamente"
}
```

### GET /:id - Detalles de entrenador (Público)
**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439017",
    "userId": {...},
    "specialties": ["Yoga", "Pilates"],
    "bio": "Instructora certificada con amplia experiencia",
    "certifications": [...],
    "availability": [...],
    "ratings": [...],
    "averageRating": 4.8,
    "isActive": true
  }
}
```

### GET /:id/schedule - Horario del entrenador (Público)
**Response (200):**
```json
{
  "success": true,
  "data": {
    "trainerId": "507f1f77bcf86cd799439017",
    "availability": [
      {
        "dayOfWeek": 1,
        "startTime": "07:00",
        "endTime": "12:00"
      }
    ],
    "classes": [
      {
        "name": "Yoga Matutino",
        "schedule": [...],
        "capacity": 20,
        "duration": 60,
        "level": "all"
      }
    ]
  }
}
```

### GET /:id/ratings - Calificaciones (Público)
**Response (200):**
```json
{
  "success": true,
  "data": {
    "trainerId": "507f1f77bcf86cd799439017",
    "averageRating": 4.8,
    "totalRatings": 25,
    "ratings": [
      {
        "userId": {
          "firstName": "Juan",
          "lastName": "Pérez",
          "avatar": "..."
        },
        "rating": 5,
        "comment": "Excelente instructora!",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

### PUT /:id - Actualizar perfil (Admin/Trainer)

---

## Códigos de Error

### Formato de Respuesta de Error
```json
{
  "success": false,
  "error": {
    "message": "Descripción del error",
    "statusCode": 400
  }
}
```

### Códigos HTTP Comunes
- **200** - OK: Solicitud exitosa
- **201** - Created: Recurso creado exitosamente
- **400** - Bad Request: Error de validación o solicitud incorrecta
- **401** - Unauthorized: No autenticado (token inválido o ausente)
- **403** - Forbidden: No autorizado (sin permisos)
- **404** - Not Found: Recurso no encontrado
- **409** - Conflict: Conflicto con el estado actual (ej: email duplicado)
- **429** - Too Many Requests: Límite de rate limiting excedido
- **500** - Internal Server Error: Error interno del servidor

---

## Ejemplos de Integración

### Ejemplo Frontend - React/Next.js

```typescript
// lib/api.ts
const API_BASE = {
  auth: 'http://localhost:3001/api/auth',
  users: 'http://localhost:3002/api/users',
  memberships: 'http://localhost:3003/api/memberships',
  payments: 'http://localhost:3004/api/payments',
  classes: 'http://localhost:3005/api/classes',
  bookings: 'http://localhost:3006/api/bookings',
  trainers: 'http://localhost:3007/api/trainers',
};

// Helper para hacer requests con autenticación
async function fetchAPI(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Error en la solicitud');
  }

  return data;
}

// Ejemplo: Login
export async function login(email: string, password: string) {
  const data = await fetchAPI(`${API_BASE.auth}/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  // Guardar token
  localStorage.setItem('token', data.data.token);
  return data.data.user;
}

// Ejemplo: Obtener clases
export async function getClasses() {
  const data = await fetchAPI(`${API_BASE.classes}`);
  return data.data;
}

// Ejemplo: Crear reserva
export async function createBooking(bookingData: any) {
  const data = await fetchAPI(`${API_BASE.bookings}`, {
    method: 'POST',
    body: JSON.stringify(bookingData),
  });
  return data.data;
}

// Ejemplo: Obtener planes de membresía
export async function getMembershipPlans() {
  const data = await fetchAPI(`${API_BASE.memberships}/plans`);
  return data.data;
}
```

### Uso en Componentes
```typescript
// app/classes/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getClasses } from '@/lib/api';

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadClasses() {
      try {
        const data = await getClasses();
        setClasses(data);
      } catch (error) {
        console.error('Error cargando clases:', error);
      } finally {
        setLoading(false);
      }
    }

    loadClasses();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h1>Clases Disponibles</h1>
      {classes.map((classItem: any) => (
        <div key={classItem.id}>
          <h2>{classItem.name}</h2>
          <p>{classItem.description}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## Notas de Seguridad

1. **Autenticación JWT**: Todos los tokens expiran en 7 días por defecto
2. **Rate Limiting**: Los endpoints de autenticación tienen límite de 5 intentos cada 15 minutos
3. **CORS**: Configurado para aceptar requests del frontend
4. **Helmet**: Todas las APIs usan Helmet para headers de seguridad
5. **Validación**: Todos los inputs son validados con express-validator
6. **Passwords**: Hasheados con bcrypt (10 rounds)

## Mejores Prácticas

1. Siempre incluir el token JWT en el header `Authorization: Bearer <token>`
2. Manejar errores apropiadamente en el frontend
3. Implementar refresh token antes de que expire el token principal
4. Usar HTTPS en producción
5. No exponer información sensible en los mensajes de error
6. Implementar logging adecuado para debugging
