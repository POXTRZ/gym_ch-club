# CH Club — Sistema de gestión para gimnasio

Este repositorio contiene la aplicación web "CH Club", una interfaz administrativa y cliente para la gestión de un gimnasio: socios, rutinas, progreso, inventario y reportes.

El proyecto está construido con Next.js (app router) y TypeScript, usa TailwindCSS para estilos y varias utilidades (Radix UI, react-hook-form, zod, recharts, entre otras).

Descripción corta
- Nombre: CH Club
- Propósito: Sistema integral de gestión para un gimnasio (administración, control de membresías, rutinas y reportes).

Características principales
- Rutas separadas para administradores, empleados, clientes y entrenadores.
- Páginas para registro/login, paneles (dashboard), membresías, inventario y reportes.
- Integración con analíticas de Vercel.

Stack
- Next.js 16 (App Router)
- React 19
- TypeScript
- TailwindCSS
- Radix UI (componentes accesibles)
- react-hook-form + zod (formularios y validación)
- Recharts (gráficas)
- Vercel Analytics

Instalación (desarrollo)

1. Clona el repositorio:

```powershell
git clone <tu-repo-url>
cd "C:\5to Semestre\proyecto olmos\gym_ch-club"
```

2. Instala las dependencias (usa npm, pnpm o yarn según prefieras). Este proyecto incluye un lockfile de pnpm, por lo que recomiendo usar pnpm:

```powershell
pnpm install
# o con npm: npm install
# o con yarn: yarn
```

3. Ejecuta en modo desarrollo:

```powershell
pnpm dev
# o npm run dev
```

Scripts disponibles
- dev: Ejecuta Next.js en modo desarrollo (hot-reload)
- build: Compila la aplicación para producción
- start: Inicia el servidor Next.js sobre los archivos compilados
- lint: Ejecuta ESLint

Consulta `package.json` para ver la lista completa de scripts.

Configuración y variables de entorno

Este README asume que la aplicación puede requerir variables de entorno para servicios (p. ej. base de datos, API de pagos, VERCEL_ANALYTICS_ID, etc.). Crea un archivo `.env.local` en la raíz y define las variables necesarias. Ejemplos posibles:

- NEXT_PUBLIC_API_URL: URL de la API/Backend
- DATABASE_URL: Cadena de conexión a la base de datos (si aplica)
- VERCEL_ANALYTICS_ID o configuración de analytics

Estructura relevante del proyecto
- `app/` — rutas del App Router de Next.js (páginas y layout principal)
  - `login/`, `register/` — autenticación
  - `admin/`, `client/`, `trainer/`, `employee/` — áreas por rol
- `components/` — componentes UI reutilizables (navbar, cards, providers)
- `components/ui/` — primitives y componentes de diseño (Radix wrappers, botones, inputs)
- `lib/` — lógica compartida (p. ej. `auth-context.tsx`, utilidades)
- `hooks/` — hooks personalizados
- `public/` — assets públicos (imágenes, iconos)

Buenas prácticas y recomendaciones
- TypeScript: mantener strict en `tsconfig.json` y añadir tipos a la mayor cantidad de módulos.
- Formularios: usar `react-hook-form` + `zod` para validación invasiva y segura.
- Autenticación y autorización: centralizar en `lib/auth-context.tsx` y proteger rutas server-side si hay un backend.
- Componentes UI: mantener primitives dentro de `components/ui/` para facilitar tests y reutilización.

Despliegue

Recomendado: Vercel (integración directa con Next.js). Pasos básicos:

1. Conecta el repositorio a Vercel.
2. Define las variables de entorno necesarias en el dashboard de Vercel.
3. Presiona Deploy. Vercel detectará que es una app Next.js y correrá el build automáticamente.

Si se usa otro hosting, asegúrate de compilar con `pnpm build` y ejecutar `pnpm start` en el servidor.

Notas de configuración específicas encontradas
- `next.config.mjs` tiene `typescript.ignoreBuildErrors: true` — esto permite builds aun con errores de tipo; para producción recomiendo quitarlo o establecer un flujo de CI que falle cuando hay errores de tipos.
- `next.config.mjs` además marca `images.unoptimized: true` — si esperas usar imágenes optimizadas de Next, revisa esta opción.

Pruebas y calidad
- Añadir tests unitarios (Jest + Testing Library) para componentes críticos.
- Añadir CI (GitHub Actions) para ejecutar lint, typecheck y tests en cada PR.

Contribuir
- Fork y crea un PR con descripciones claras de cambios.
- Mantén los commits atómicos y con mensajes descriptivos.

Licencia
- Añade una licencia (p. ej. MIT) si quieres permitir contribuciones públicas.

Contacto
- Si necesitas ayuda con el repo o deseas que prepare scripts adicionales (CI, tests, Dockerfile), dime y lo preparo.

---
Pequeño checklist para mejorar el proyecto (sugerencias inmediatas):
- [ ] Añadir un `.env.example` con variables esperadas
- [ ] Habilitar `typescript: { ignoreBuildErrors: false }` y arreglar errores de tipos
- [ ] Añadir GitHub Actions (lint, typecheck, test)
- [ ] Documentar la API/backend si existe

Fin del README.
# gym_ch-club
Pagina web para hacer microservicios y pagos de eñ gimnasio
