# 🏋️ CH Club — Sistema de Gestión para Gimnasio

Sistema integral de gestión para gimnasio con módulos de administración, control de membresías, rutinas de entrenamiento y reportes. **Disponible públicamente en internet, seguro y sin necesidad de localhost.**

## 🚀 ACCESO PÚBLICO - YA ESTÁ EN LÍNEA

Tu app está **LISTA para usar desde cualquier computadora:**

- **URL:** https://gym-ch-club.vercel.app
- **Protocolo:** HTTPS (Seguro con certificado SSL)
- **Acceso:** Desde cualquier navegador, cualquier dispositivo, en cualquier lugar

**[👉 GUÍA RÁPIDA DE DEPLOYMENT (5 MINUTOS) →](./PASO-A-PASO.md)**

---

## ✨ Características Principales

- 👨‍💼 **Módulo Admin:** Gestión de socios, planes, personal, reportes
- 🏋️ **Módulo Trainer:** Gestión de clientes, rutinas y ejercicios
- 👷 **Módulo Empleado:** Check-ins, inventario, ventas
- 👤 **Módulo Cliente:** Ver rutinas, progreso, membresías
- 📊 **Reportes:** Estadísticas y análisis
- 🔐 **Autenticación:** Segura con NextAuth.js
- 📱 **Responsive:** Funciona en desktop, tablet y móvil

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 16, React 19, TypeScript |
| Estilos | TailwindCSS, Radix UI |
| Formularios | react-hook-form + zod |
| Base de Datos | MongoDB Atlas |
| Auth | NextAuth.js, bcryptjs |
| Deployment | Vercel (HTTPS automático) |
| Gráficos | Recharts |

---

## 📋 INSTALACIÓN - Desarrollo Local

```powershell
# 1. Clona el repositorio
git clone https://github.com/POXTRZ/gym-ch-club.git
cd gym-ch-club

# 2. Instala dependencias
npm install --legacy-peer-deps

# 3. Crea .env.local (copiar de .env.example)
# Edita y agrega tus valores

# 4. Ejecuta en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## 🚀 DEPLOYMENT - 3 OPCIONES

### ✅ OPCIÓN 1: VERCEL (RECOMENDADO)

**La más fácil, 5 minutos, HTTPS automático.**

[👉 Ver PASO-A-PASO.md para instrucciones detalladas](./PASO-A-PASO.md)

```powershell
# Resumen rápido:
# 1. Abre vercel.com
# 2. Sign up con GitHub
# 3. Import proyecto
# 4. Agrega 4 variables de entorno
# 5. Click Deploy
# ¡Listo en 5 min!
```

### 🐳 OPCIÓN 2: DOCKER + RAILWAY

Para mayor control, con Docker incluido.

```bash
docker build -t gym-ch-club .
docker run -p 3000:3000 gym-ch-club
```

### 🌊 OPCIÓN 3: RENDER

Free tier renovable mensualmente.

---

## 🔐 SEGURIDAD

- ✅ HTTPS obligatorio (Vercel)
- ✅ Contraseñas hasheadas (bcryptjs)
- ✅ Variables de entorno seguras
- ✅ MongoDB con autenticación
- ✅ NEXTAUTH_SECRET fuerte
- ✅ Cookies httpOnly
- ✅ CORS configurado

**[📖 Ver SECURITY.md para detalles](./SECURITY.md)**

---

## 📁 Estructura del Proyecto

```
├── app/
│   ├── layout.tsx                 # Layout principal
│   ├── login/                     # Página de login
│   ├── register/                  # Registro de usuarios
│   ├── admin/                     # Rutas administrativas
│   ├── trainer/                   # Rutas entrenador
│   ├── employee/                  # Rutas empleado
│   ├── client/                    # Rutas cliente
│   └── api/                       # Endpoints API
├── components/
│   ├── ui/                        # Componentes Radix UI
│   ├── ch-navbar.tsx              # Navbar
│   └── data-table.tsx             # Tabla de datos
├── lib/
│   ├── auth-context.tsx           # Context de autenticación
│   ├── mongodb.ts                 # Conexión MongoDB
│   └── types.ts                   # TypeScript types
├── public/                        # Assets estáticos
├── styles/                        # Estilos globales
└── Dockerfile                     # Para Docker/Railway/Render
```

---

## 📊 USUARIOS DE PRUEBA

Después de desplegar, prueba con:

```
Email: admin@chclub.com
Contraseña: password123
```

Otros usuarios:
- trainer@chclub.com
- employee@chclub.com
- client@chclub.com

---

## 🧪 Testing

```bash
# Build local
npm run build

# Run producción local
npm start

# Abre http://localhost:3000 y prueba
```

---

## 📚 Documentación

| Archivo | Contenido |
|---------|-----------|
| [PASO-A-PASO.md](./PASO-A-PASO.md) | Guía rápida (5 min) |
| [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md) | Guía completa de deployment |
| [SECURITY.md](./SECURITY.md) | Consideraciones de seguridad |
| [SETUP.md](./SETUP.md) | Setup detallado |

---

## 🔗 Variables de Entorno

Copia `.env.example` a `.env.local` y configura:

```env
# Base de Datos
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/gym-ch-club?retryWrites=true&w=majority

# Autenticación
NEXTAUTH_SECRET=generar-con-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000

# API
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Node environment
NODE_ENV=development
```

---

## 🛠️ Scripts Disponibles

```bash
npm run dev        # Desarrollo (hot-reload)
npm run build      # Compilar para producción
npm run start      # Ejecutar build compilado
npm run lint       # ESLint
```

---

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📞 Soporte

- **Documentación Next.js:** https://nextjs.org/docs
- **MongoDB Atlas:** https://www.mongodb.com/cloud/atlas
- **Vercel Docs:** https://vercel.com/docs
- **NextAuth.js:** https://next-auth.js.org

---

## 📄 Licencia

MIT License - Siéntete libre de usar este proyecto.

---

## 🎯 Próximos Pasos

1. ✅ [Desplegar en Vercel (5 min)](./PASO-A-PASO.md)
2. 📧 Configurar email (SendGrid/Resend)
3. 💳 Agregar pagos (Stripe)
4. 📊 Configurar analytics
5. 🎨 Personalizar branding

---

**¿Preguntas?** Lee [PASO-A-PASO.md](./PASO-A-PASO.md) para empezar en 5 minutos.

¡Éxito con tu gimnasio! 🚀
