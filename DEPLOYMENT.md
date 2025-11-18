# CH-Club Gym Management System

Sistema de gestión para gimnasio CH-Club con roles de administrador, entrenador, empleado y cliente.

## 🚀 Despliegue en Vercel

### Opción 1: Despliegue desde GitHub (Recomendado)

1. **Sube tu código a GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/POXTRZ/gym-ch-club.git
   git push -u origin main
   ```

2. **Despliega en Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Inicia sesión con tu cuenta de GitHub
   - Click en "Add New" → "Project"
   - Selecciona el repositorio `gym-ch-club`
   - Configura las variables de entorno:
     - `MONGODB_URI`: tu URL de MongoDB Atlas
   - En "Project Name", escribe: `gym-ch-club`
   - Click en "Deploy"

### Opción 2: Despliegue Directo con Vercel CLI

1. **Instala Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Inicia sesión en Vercel:**
   ```bash
   vercel login
   ```

3. **Despliega el proyecto:**
   ```bash
   vercel --prod
   ```
   - Cuando pregunte por el nombre del proyecto, escribe: `gym-ch-club`
   - Configura la variable de entorno `MONGODB_URI` cuando se solicite

### Variables de Entorno Requeridas

En Vercel, configura estas variables de entorno:

```
MONGODB_URI=mongodb+srv://Mariana_Gutierrez:CHClub123@clusterch.bv1is0b.mongodb.net/?appName=ClusterCH
```

## 📝 Configuración de MongoDB Atlas

Asegúrate de que tu MongoDB Atlas permita conexiones desde cualquier IP:

1. Ve a MongoDB Atlas Dashboard
2. Network Access → Add IP Address
3. Selecciona "Allow Access from Anywhere" (0.0.0.0/0)
4. Click en "Confirm"

## 🌐 URL del Proyecto

Después del despliegue, tu sitio estará disponible en:
- `https://gym-ch-club.vercel.app`
- O un dominio personalizado si lo configuras

## 👥 Usuarios de Prueba

- **Admin:** admin@chclub.com
- **Trainer:** trainer@chclub.com
- **Employee:** employee@chclub.com
- **Client:** client@chclub.com

**Contraseña:** password123

## 🛠️ Desarrollo Local

```bash
npm install --legacy-peer-deps
npm run dev
```

Visita [http://localhost:3000](http://localhost:3000)

## 📦 Tecnologías

- Next.js 16.0.3
- React 19.2.0
- MongoDB Atlas
- Tailwind CSS
- TypeScript
