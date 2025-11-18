# Backend - Microservicios para Gimnasio

Sistema completo de microservicios para la gestión de un gimnasio, construido con Node.js, TypeScript, Express, y MongoDB.

## 🏗️ Arquitectura

El backend está dividido en 8 microservicios independientes:

1. **Auth Service** (Puerto 3001) - Autenticación y autorización
2. **User Service** (Puerto 3002) - Gestión de usuarios
3. **Membership Service** (Puerto 3003) - Gestión de membresías
4. **Payment Service** (Puerto 3004) - Procesamiento de pagos
5. **Class Service** (Puerto 3005) - Gestión de clases
6. **Booking Service** (Puerto 3006) - Sistema de reservas
7. **Trainer Service** (Puerto 3007) - Gestión de entrenadores

Además incluye:
- **Shared** - Código compartido (modelos, utilidades, middleware)

## 📋 Requisitos

- Node.js >= 18.x
- Docker y Docker Compose
- MongoDB 7.0 (incluido en docker-compose)

## 🚀 Inicio Rápido

### 1. Configurar Variables de Entorno

Copiar el archivo de ejemplo y configurar:

```bash
cp .env.example .env
```

Editar `.env` con tus valores (las credenciales por defecto ya funcionan para desarrollo local).

### 2. Iniciar MongoDB con Docker

```bash
docker-compose up -d
```

Esto iniciará:
- MongoDB en puerto 27017
- Mongo Express (UI admin) en http://localhost:8081
  - Usuario: admin
  - Contraseña: admin123

### 3. Instalar Dependencias

Instalar dependencias para todos los servicios:

```bash
# Auth Service
cd auth-service && npm install && cd ..

# User Service
cd user-service && npm install && cd ..

# Membership Service
cd membership-service && npm install && cd ..

# Payment Service
cd payment-service && npm install && cd ..

# Class Service
cd class-service && npm install && cd ..

# Booking Service
cd booking-service && npm install && cd ..

# Trainer Service
cd trainer-service && npm install && cd ..
```

O usar este script para instalar todo:

```bash
for service in auth-service user-service membership-service payment-service class-service booking-service trainer-service; do
  echo "Instalando dependencias de $service..."
  (cd $service && npm install)
done
```

### 4. Iniciar los Servicios

Puedes iniciar cada servicio en terminales separadas:

```bash
# Terminal 1 - Auth Service
cd auth-service && npm run dev

# Terminal 2 - User Service
cd user-service && npm run dev

# Terminal 3 - Membership Service
cd membership-service && npm run dev

# Terminal 4 - Payment Service
cd payment-service && npm run dev

# Terminal 5 - Class Service
cd class-service && npm run dev

# Terminal 6 - Booking Service
cd booking-service && npm run dev

# Terminal 7 - Trainer Service
cd trainer-service && npm run dev
```

## 🔍 Verificar que los Servicios están Funcionando

Cada servicio tiene un endpoint de health check:

```bash
# Auth Service
curl http://localhost:3001/health

# User Service
curl http://localhost:3002/health

# Membership Service
curl http://localhost:3003/health

# Payment Service
curl http://localhost:3004/health

# Class Service
curl http://localhost:3005/health

# Booking Service
curl http://localhost:3006/health

# Trainer Service
curl http://localhost:3007/health
```

## 📚 Documentación de la API

Ver [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) para documentación completa de todos los endpoints.

## 🗄️ Modelos de Base de Datos

### User
- email, password, firstName, lastName, phone
- role: admin | member | trainer
- avatar, isActive

### Membership
- userId, planType (basic|premium|vip)
- status, startDate, endDate, price, features

### Payment
- userId, membershipId, amount, currency
- status, paymentMethod, transactionId

### Class
- name, description, trainerId
- schedule, capacity, duration, level

### Booking
- userId, classId, bookingDate, status

### Trainer
- userId, specialties, bio, certifications
- availability, ratings, averageRating

## 🛠️ Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **TypeScript** - Tipado estático
- **Express** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **Bcrypt** - Hash de contraseñas
- **Express Validator** - Validación de datos
- **Helmet** - Seguridad HTTP headers
- **Morgan** - Logging HTTP
- **CORS** - Cross-Origin Resource Sharing
- **Docker** - Containerización

## 🔐 Seguridad

- JWT con expiración de 7 días
- Passwords hasheados con bcrypt
- Rate limiting en endpoints de autenticación
- Validación de datos con express-validator
- Headers de seguridad con Helmet
- Middleware de autorización por roles

## 📝 Scripts Disponibles

En cada servicio:

- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon
- `npm run build` - Compila TypeScript a JavaScript
- `npm start` - Inicia el servidor en producción

## 🌐 Endpoints Principales

### Auth Service (3001)
- POST `/api/auth/register` - Registro
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Usuario actual
- POST `/api/auth/logout` - Logout
- POST `/api/auth/refresh` - Refresh token

### User Service (3002)
- GET `/api/users` - Listar usuarios
- GET `/api/users/:id` - Obtener usuario
- PUT `/api/users/:id` - Actualizar usuario
- DELETE `/api/users/:id` - Eliminar usuario
- GET `/api/users/search` - Buscar usuarios

### Membership Service (3003)
- GET `/api/memberships/plans` - Planes disponibles
- POST `/api/memberships` - Crear membresía
- GET `/api/memberships/:id/status` - Estado de membresía

### Payment Service (3004)
- POST `/api/payments` - Procesar pago
- GET `/api/payments/user/:userId` - Historial de pagos
- POST `/api/payments/webhook` - Webhook

### Class Service (3005)
- GET `/api/classes` - Listar clases
- GET `/api/classes/schedule` - Horario semanal
- POST `/api/classes` - Crear clase

### Booking Service (3006)
- POST `/api/bookings` - Reservar clase
- GET `/api/bookings/user/:userId/upcoming` - Próximas reservas
- PUT `/api/bookings/:id/cancel` - Cancelar reserva

### Trainer Service (3007)
- GET `/api/trainers` - Listar entrenadores
- GET `/api/trainers/:id/ratings` - Calificaciones
- POST `/api/trainers` - Crear perfil

## 🐛 Debugging

Ver logs en cada servicio para debugging. Los logs incluyen:
- Timestamp
- Nombre del servicio
- Nivel (INFO, ERROR, WARN, DEBUG)
- Mensaje y metadata

## 🤝 Integración con Frontend

El frontend en Next.js puede consumir estos microservicios. Ver ejemplos de integración en [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

## 📦 Estructura del Proyecto

```
backend/
├── shared/                    # Código compartido
│   ├── models/               # Modelos de MongoDB
│   ├── utils/                # Utilidades (db, logger, errors)
│   └── middleware/           # Middleware compartido
├── auth-service/             # Servicio de autenticación
├── user-service/             # Servicio de usuarios
├── membership-service/       # Servicio de membresías
├── payment-service/          # Servicio de pagos
├── class-service/            # Servicio de clases
├── booking-service/          # Servicio de reservas
├── trainer-service/          # Servicio de entrenadores
├── docker-compose.yml        # Configuración de Docker
├── .env.example              # Variables de entorno de ejemplo
└── API_DOCUMENTATION.md      # Documentación de la API
```

## 🔄 Flujo de Trabajo Típico

1. Usuario se registra (`auth-service`)
2. Usuario crea/actualiza perfil (`user-service`)
3. Usuario selecciona plan de membresía (`membership-service`)
4. Usuario realiza pago (`payment-service`)
5. Usuario ve clases disponibles (`class-service`)
6. Usuario reserva clase (`booking-service`)
7. Usuario ve información de entrenadores (`trainer-service`)

## 🚧 Próximas Mejoras

- [ ] Implementar WebSockets para notificaciones en tiempo real
- [ ] Añadir Redis para caché
- [ ] Implementar circuit breaker pattern
- [ ] Añadir API Gateway
- [ ] Implementar service mesh
- [ ] Añadir tests unitarios y de integración
- [ ] Configurar CI/CD
- [ ] Añadir monitoreo con Prometheus/Grafana
- [ ] Implementar logging centralizado con ELK

## 📄 Licencia

Este proyecto es privado y está desarrollado para el gimnasio.
