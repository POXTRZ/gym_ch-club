# 🏋️ CH Club - Guía de Configuración e Inicialización

Esta guía te ayudará a configurar completamente el sistema de gestión de gimnasio CH Club.

## ✅ Prerrequisitos Completados

- ✅ Node.js instalado (v22.19.0)
- ✅ npm instalado (v11.6.0)
- ✅ Dependencias instaladas (`npm install --legacy-peer-deps`)
- ✅ MongoDB Atlas conectado
- ✅ Variables de entorno configuradas (`.env.local`)

## 🚀 Paso 1: Inicializar la Base de Datos

El proyecto incluye un endpoint especial para poblar la base de datos con datos de prueba.

### Opción A: Usando el navegador (más fácil)

1. Asegúrate de que el servidor esté corriendo:
```powershell
npm run dev
```

2. Abre en tu navegador:
```
http://localhost:3000/api/init-db
```

3. Verás una respuesta JSON similar a:
```json
{
  "success": true,
  "message": "Base de datos inicializada con datos de prueba",
  "data": {
    "users": 5,
    "membershipPlans": 6,
    "products": 8
  }
}
```

### Opción B: Usando PowerShell

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/init-db" -Method POST
```

## 👥 Usuarios de Prueba Creados

Después de inicializar la DB, tendrás estos usuarios disponibles:

| Email | Contraseña | Rol | Nombre |
|-------|-----------|-----|--------|
| admin@chclub.com | password123 | ADMIN | Ana Martínez |
| trainer@chclub.com | password123 | TRAINER | Carlos Hernández |
| employee@chclub.com | password123 | EMPLOYEE | María García |
| client@chclub.com | password123 | CLIENT | Juan Pérez |
| laura@chclub.com | password123 | CLIENT | Laura Gómez |

## 🎯 Paso 2: Probar el Sistema

### 1. Iniciar Sesión

Abre http://localhost:3000/login y usa cualquiera de los usuarios de arriba.

### 2. Explorar Dashboards por Rol

Dependiendo del rol del usuario que uses, serás redirigido a:

- **Admin** → `/admin/dashboard` - Ver estadísticas, reportes, gestión completa
- **Cliente** → `/client/dashboard` - Ver membresía, rutinas, progreso
- **Entrenador** → `/trainer/clients` - Gestionar clientes y rutinas
- **Empleado** → `/employee/checkin` - Registrar check-ins y gestionar inventario

### 3. Registrar un Nuevo Usuario

1. Ve a http://localhost:3000/register
2. Llena el formulario
3. Selecciona un rol (por defecto: CLIENT)
4. El usuario se guardará en MongoDB

## 📊 APIs Disponibles

Aquí están todas las APIs creadas y funcionales:

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar nuevo usuario

### Usuarios/Miembros
- `GET /api/members` - Obtener todos los miembros
  - Query params: `?role=CLIENT&status=active`

### Estadísticas
- `GET /api/stats` - Estadísticas del dashboard (usado por admin)

### Productos
- `GET /api/products` - Listar productos
  - Query params: `?category=SUPPLEMENT&lowStock=true`
- `POST /api/products` - Crear producto
- `PUT /api/products` - Actualizar producto

### Check-ins
- `GET /api/check-ins` - Listar check-ins
  - Query params: `?userId=xxx&today=true`
- `POST /api/check-ins` - Registrar check-in
- `PUT /api/check-ins` - Registrar check-out

### Membresías
- `GET /api/membership-plans` - Listar planes disponibles
- `GET /api/memberships` - Listar membresías activas
  - Query params: `?userId=xxx`
- `POST /api/memberships` - Crear nueva membresía

### Utilidades
- `GET /api/test-db` - Probar conexión a MongoDB
- `POST /api/init-db` - Inicializar DB con datos de prueba

## 🧪 Probar APIs Manualmente

### Ejemplo 1: Obtener Estadísticas
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/stats" -Method GET
```

### Ejemplo 2: Listar Productos
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method GET
```

### Ejemplo 3: Crear un Check-in
```powershell
$body = @{
    userId = "ID_DEL_USUARIO"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/check-ins" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

## 📁 Estructura de Colecciones en MongoDB

El sistema usa las siguientes colecciones en la base de datos `gym_ch_club`:

1. **users** - Usuarios del sistema (admin, trainers, employees, clients)
2. **membership_plans** - Planes de membresía disponibles
3. **memberships** - Membresías activas/históricas de usuarios
4. **products** - Inventario de productos (suplementos, accesorios, etc.)
5. **check_ins** - Registro de asistencias
6. **payments** - Registro de pagos (opcional, aún no implementado completamente)
7. **routines** - Rutinas asignadas a clientes (opcional)
8. **physical_progress** - Registro de progreso físico (opcional)
9. **sales** - Ventas de productos (opcional)

## 🔧 Solución de Problemas

### Error: "next" no se reconoce
```powershell
# Reinstalar dependencias
npm install --legacy-peer-deps
```

### Error: MongoDB connection failed
1. Verifica que `.env.local` tenga la URI correcta
2. Comprueba que tu IP esté en la whitelist de MongoDB Atlas
3. Prueba la conexión con: http://localhost:3000/api/test-db

### Error al hacer login
1. Asegúrate de haber inicializado la DB primero (`/api/init-db`)
2. Usa exactamente: email `admin@chclub.com` y password `password123`
3. Revisa la consola del navegador (F12) para ver errores

## 📝 Próximos Pasos (Implementaciones Pendientes)

Esto es lo que se está trabajando actualmente:

- [ ] Completar páginas de Cliente (membresía, rutinas, progreso)
- [ ] Completar páginas de Empleado (check-in UI, inventario)
- [ ] Completar páginas de Entrenador (asignar rutinas)
- [ ] Página de Reportes del Admin con gráficas (Recharts)
- [ ] Sistema de pagos completo
- [ ] Upload de fotos para progreso físico
- [ ] Notificaciones de renovación de membresía
- [ ] Sistema de roles y permisos más granular

## 💡 Tips de Desarrollo

1. **Hot Reload**: Cualquier cambio en `.tsx`, `.ts` se refleja automáticamente
2. **Logs**: Revisa la consola de PowerShell donde corre `npm run dev` para ver logs del servidor
3. **MongoDB Atlas**: Puedes ver las colecciones directamente en el dashboard de Atlas
4. **Tailwind**: El proyecto usa Tailwind v4 - revisa `globals.css` para los estilos personalizados

## 🆘 Comandos Útiles

```powershell
# Reiniciar servidor de desarrollo
# (Ctrl+C para detener, luego:)
npm run dev

# Ver errores de TypeScript
npm run lint

# Compilar para producción
npm run build

# Limpiar node_modules y reinstalar
Remove-Item -Recurse -Force node_modules
npm install --legacy-peer-deps

# Ver estructura de DB en MongoDB
# Abre MongoDB Compass y conecta con tu URI
```

## 🎉 ¡Listo!

Si llegaste hasta aquí, tu sistema debería estar completamente funcional. Puedes:

1. ✅ Iniciar sesión con diferentes roles
2. ✅ Ver dashboards personalizados
3. ✅ Consultar estadísticas en tiempo real
4. ✅ Gestionar productos
5. ✅ Ver miembros

Para cualquier duda o error, revisa los logs en la terminal o abre las DevTools del navegador (F12).

---

**Desarrollado para CH Club** 🏋️‍♂️
