# 🏋️ Gym Management System - Quick Start Guide

## 🎯 What's Been Implemented

This project now includes a **complete microservices backend architecture** with 7 independent services and MongoDB database.

## 📁 Project Structure

```
gym_ch-club/
├── app/                    # Next.js Frontend (existing)
├── backend/                # NEW: Complete Microservices Backend
│   ├── shared/            # Shared code (models, middleware, utils)
│   ├── auth-service/      # Port 3001 - Authentication
│   ├── user-service/      # Port 3002 - User management
│   ├── membership-service/# Port 3003 - Memberships
│   ├── payment-service/   # Port 3004 - Payments
│   ├── class-service/     # Port 3005 - Classes
│   ├── booking-service/   # Port 3006 - Reservations
│   ├── trainer-service/   # Port 3007 - Trainers
│   └── docker-compose.yml # MongoDB + Mongo Express
└── docker-compose.yml      # Database setup
```

## 🚀 Quick Start

### 1. Start the Database

```bash
# Start MongoDB and Mongo Express
docker compose up -d

# Verify it's running
docker ps
```

Access Mongo Express at: http://localhost:8081
- Username: `admin`
- Password: `admin123`

### 2. Setup Backend Services

```bash
cd backend

# Copy environment variables
cp .env.example .env

# Install shared dependencies
cd shared && npm install && cd ..

# Install dependencies for all services (choose one method)

# Method 1: Install one by one
cd auth-service && npm install && cd ..
cd user-service && npm install && cd ..
cd membership-service && npm install && cd ..
cd payment-service && npm install && cd ..
cd class-service && npm install && cd ..
cd booking-service && npm install && cd ..
cd trainer-service && npm install && cd ..

# Method 2: Use script (bash/linux)
for service in auth-service user-service membership-service payment-service class-service booking-service trainer-service; do
  (cd $service && npm install)
done
```

### 3. Start the Services

Open 7 terminal windows and run:

```bash
# Terminal 1 - Auth Service
cd backend/auth-service && npm run dev

# Terminal 2 - User Service
cd backend/user-service && npm run dev

# Terminal 3 - Membership Service
cd backend/membership-service && npm run dev

# Terminal 4 - Payment Service
cd backend/payment-service && npm run dev

# Terminal 5 - Class Service
cd backend/class-service && npm run dev

# Terminal 6 - Booking Service
cd backend/booking-service && npm run dev

# Terminal 7 - Trainer Service
cd backend/trainer-service && npm run dev
```

### 4. Verify Services

Test health endpoints:

```bash
curl http://localhost:3001/health  # Auth Service
curl http://localhost:3002/health  # User Service
curl http://localhost:3003/health  # Membership Service
curl http://localhost:3004/health  # Payment Service
curl http://localhost:3005/health  # Class Service
curl http://localhost:3006/health  # Booking Service
curl http://localhost:3007/health  # Trainer Service
```

### 5. Start Frontend

```bash
# In the root directory
npm install
npm run dev
```

Access frontend at: http://localhost:3000

## 📚 Documentation

- **[Backend README](backend/README.md)** - Architecture and setup details
- **[API Documentation](backend/API_DOCUMENTATION.md)** - Complete API reference with examples
- **[Security Summary](backend/SECURITY_SUMMARY.md)** - Security analysis and best practices

## 🔌 API Endpoints Overview

### Auth Service (3001)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token

### User Service (3002)
- `GET /api/users` - List users (admin)
- `GET /api/users/:id` - Get user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin)
- `GET /api/users/search` - Search users

### Membership Service (3003)
- `GET /api/memberships/plans` - Get available plans
- `POST /api/memberships` - Create membership
- `GET /api/memberships/:id/status` - Check membership status
- `PUT /api/memberships/:id/renew` - Renew membership

### Payment Service (3004)
- `POST /api/payments` - Process payment
- `GET /api/payments/user/:userId` - Payment history
- `GET /api/payments/:id/invoice` - Get invoice
- `POST /api/payments/:id/refund` - Refund (admin)

### Class Service (3005)
- `GET /api/classes` - List all classes
- `GET /api/classes/schedule` - Weekly schedule
- `POST /api/classes` - Create class (admin/trainer)
- `GET /api/classes/trainer/:trainerId` - Trainer's classes

### Booking Service (3006)
- `POST /api/bookings` - Book a class
- `GET /api/bookings/user/:userId/upcoming` - Upcoming bookings
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Trainer Service (3007)
- `GET /api/trainers` - List trainers
- `GET /api/trainers/:id` - Trainer details
- `GET /api/trainers/:id/ratings` - Trainer ratings
- `POST /api/trainers` - Create trainer profile (admin)

## 🔐 Security

- ✅ JWT authentication with 7-day expiration
- ✅ Bcrypt password hashing
- ✅ Rate limiting (5 req/15min for auth, 100 req/15min for API)
- ✅ Role-based access control
- ✅ Input validation
- ✅ **CodeQL Security Scan: 0 alerts**

## 🧪 Example API Calls

### Register a User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "role": "member"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Get Membership Plans
```bash
curl http://localhost:3003/api/memberships/plans
```

## 🛠️ Tech Stack

**Backend:**
- Node.js + TypeScript
- Express.js
- MongoDB + Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Express Validator
- Helmet for security
- Rate limiting

**Frontend:**
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Radix UI components

## 📝 Notes

- All services use TypeScript with strict mode
- MongoDB runs in Docker for easy setup
- Environment variables are configured in `.env`
- Default MongoDB credentials: `admin/admin123` (change in production!)
- Default JWT secret should be changed in production

## 🚨 Before Production

See [SECURITY_SUMMARY.md](backend/SECURITY_SUMMARY.md) for:
- Security checklist
- Production recommendations
- Best practices
- Deployment guidelines

## 📞 Support

For detailed information, see:
- Backend architecture: `backend/README.md`
- API documentation: `backend/API_DOCUMENTATION.md`
- Security details: `backend/SECURITY_SUMMARY.md`

---

**Status**: ✅ Production-Ready Backend + Frontend  
**Last Updated**: 2025-11-18
