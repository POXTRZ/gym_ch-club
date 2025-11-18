# 🚀 PASO A PASO - Hacer tu app PÚBLICA y SEGURA

## 📌 EL OBJETIVO
Tu app estará disponible en internet, accesible desde cualquier computadora, CON HTTPS (seguro).

**Ejemplo URL final:** `https://gym-ch-club.vercel.app`

---

## 🎯 OPCIÓN 1: VERCEL (RECOMENDADO - 5 MINUTOS)

### PASO 1️⃣: Abre Vercel
- Ve a **[vercel.com](https://vercel.com)**
- Click azul: "Sign Up"
- Escoge "GitHub"
- Autoriza Vercel

### PASO 2️⃣: Importa tu proyecto
- En Vercel, click "Add New" → "Project"
- Busca `gym-ch-club`
- Click "Import"

### PASO 3️⃣: Agrega variables de entorno
En la pantalla "Configure Project", en la sección "Environment Variables":

⚠️ **IMPORTANTE:** Copia los nombres EXACTAMENTE como están. Solo LETRAS MAYÚSCULAS y guiones bajos (_).

**Variable 1:**
```
Nombre: MONGODB_URI
Valor: mongodb+srv://Mariana_Gutierrez:CHClub123@clusterch.bv1is0b.mongodb.net/gym-ch-club?retryWrites=true&w=majority
Ambiente: Production
```
Click "Add"

**Variable 2:**
```
Nombre: NEXTAUTH_SECRET
Valor: 32U7n8K9mL2pQ1xW5vH6jF3dG4bN7cM0Ry8kP9wS2tZ
Ambiente: Production
```
(Si el valor de arriba no te gusta, puedes generar otro aquí: https://generate-secret.vercel.app/32 - pero copia el resultado completo)

Click "Add"

**Variable 3:**
```
Nombre: NEXTAUTH_URL
Valor: https://gym-ch-club.vercel.app
Ambiente: Production
```
Click "Add"

**Variable 4:**
```
Nombre: NEXT_PUBLIC_API_URL
Valor: https://gym-ch-club.vercel.app/api
Ambiente: Production
```
Click "Add"

### PASO 4️⃣: Deploy
Click botón azul "Deploy"

**Espera 2-3 minutos...** ✅ ¡LISTO! 

Tu app está en: **https://gym-ch-club.vercel.app**

---

## ✅ VERIFICA QUE FUNCIONA

1. Abre en navegador: `https://gym-ch-club.vercel.app`
2. Deberías ver la página de login
3. Intenta login con:
   - Email: `admin@chclub.com`
   - Contraseña: `password123`
4. ¿Funciona? ✅ **¡ÉXITO!**

---

## 🔄 DESPUÉS: Actualizaciones Automáticas

Cada vez que hagas `git push` a GitHub:
1. Vercel automáticamente detecta cambios
2. Hace build automático
3. Deploy automático
4. **Tu app se actualiza sin hacer nada más**

---

## 🎯 OPCIÓN 2: RAILWAY (Alternativa fácil, 10 min)

Si prefieres otra plataforma:

1. Ve a **[railway.app](https://railway.app)**
2. Click "Start a New Project"
3. "Deploy from GitHub"
4. Selecciona `gym-ch-club`
5. Agrega las mismas variables de entorno
6. ¡Listo!

Tu URL será algo como: `https://gym-ch-club-prod.railway.app`

---

## 🌊 OPCIÓN 3: RENDER (Alternativa con free tier)

1. Ve a **[render.com](https://render.com)**
2. "New +" → "Web Service"
3. Conecta GitHub
4. Selecciona `gym-ch-club`
5. Agrega variables de entorno
6. ¡Listo!

Tu URL será algo como: `https://gym-ch-club.onrender.com`

---

## 🔐 SEGURIDAD - IMPORTANTE

### ✅ HAZLO:
- ✅ Generar NEXTAUTH_SECRET fuerte
- ✅ Configurar variables en dashboard (NO en código)
- ✅ Usar HTTPS (automático en Vercel)

### ❌ NO HAGAS ESTO:
- ❌ Poner contraseñas en archivos .env
- ❌ Hacer `git push` archivos `.env`
- ❌ Compartir NEXTAUTH_SECRET
- ❌ Dejar usuarios de prueba (cambiar admin)

---

## 📊 DESPUÉS DEL DEPLOY

### Ver logs (si hay errores):
En Vercel dashboard:
1. Abre tu proyecto
2. Tab "Logs"
3. Verás qué falló

### Errores comunes:

**Error: "MONGODB_URI is undefined"**
- Solución: Agregaste mal la variable. Verifica nombre exacto: `MONGODB_URI`

**Error: "Build failed"**
- Solución: Revisa logs, generalmente falta alguna variable

**App carga pero no anda**
- Solución: Verifica NEXTAUTH_SECRET no está vacío

---

## 📱 COMPARTIR CON USUARIOS

Tu app ahora está **PÚBLICA**. Puedes compartir el link:

```
https://gym-ch-club.vercel.app
```

Con:
- 📱 Clientes del gimnasio (por WhatsApp, email)
- 👨‍🏫 Trainers
- 🛠️ Staff/Empleados
- 📊 Administradores

**Todo el mundo puede acceder desde cualquier lugar.**

---

## 🆘 PROBLEMAS?

**¿Aparece error: "The name contains invalid characters"?**

Significa que escribiste mal el nombre de la variable. **Soluciones:**

1. ❌ **NO escribas:**
   - `MONGODB-URI` (guion medio, debe ser guion BAJO `_`)
   - `mongodb_uri` (minúsculas, debe ser MAYÚSCULAS)
   - `MongoDb_Uri` (mezcla de mayúsculas/minúsculas)
   - `NEXT_PUBLIC-API_URL` (mezcla de guiones)

2. ✅ **ESCRIBE EXACTAMENTE:**
   - `MONGODB_URI` (todo mayúsculas, guion bajo)
   - `NEXTAUTH_SECRET` (todo mayúsculas)
   - `NEXTAUTH_URL` (todo mayúsculas)
   - `NEXT_PUBLIC_API_URL` (todo mayúsculas, guion bajo)

3. 💡 **TRUCO:** Copia y pega los nombres de arriba en lugar de escribirlos manualmente.

4. 📋 **GUÍA COMPLETA:** Ver archivo `VERCEL-VARIABLES-EXACTO.md`

---

**¿La app no carga?**
1. Espera 2-3 minutos más (puede tardar)
2. Recarga la página (Ctrl+R)
3. Revisa los logs en Vercel

**¿Error al login?**
1. Verifica MONGODB_URI está bien
2. En MongoDB Atlas: Network Access → Allow 0.0.0.0/0
3. Redeploy en Vercel

**¿URL no funciona?**
1. Verifica que escribiste bien: `https://gym-ch-club.vercel.app`
2. No: `http://` (debe ser `https://`)
3. Espera a que termine el deploy

---

## ✨ DOMINIO PERSONALIZADO (Opcional)

Si quieres `app.migimnasio.com` en lugar de `gym-ch-club.vercel.app`:

1. Compra dominio (GoDaddy, Namecheap, etc)
2. En Vercel → Project Settings → Domains
3. Agrega tu dominio
4. Sigue instrucciones de DNS
5. Espera 24-48 horas

---

## 🎉 ¡FELICIDADES!

Tu app está:
- ✅ PÚBLICA (accesible desde internet)
- ✅ SEGURA (HTTPS automático)
- ✅ EN LÍNEA (funcionando sin localhost)
- ✅ SIN LÍMITE DE USUARIOS

**¡Ahora todos pueden usarla desde cualquier computadora!** 🚀

---

**¿Preguntas?** Revisa:
- `DEPLOYMENT-GUIDE.md` - Guía completa
- `SECURITY.md` - Seguridad detallada
