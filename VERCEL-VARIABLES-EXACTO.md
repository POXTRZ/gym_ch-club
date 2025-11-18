# 🔧 GUÍA EXACTA - Variables de Entorno en Vercel (SIN ERRORES)

## ⚠️ ERROR COMÚN

**Error que aparece:**
```
The name contains invalid characters. Only letters, digits, and underscores 
are allowed. Furthermore, the name should not start with a digit.
```

**Causa:** Escribiste mal el nombre de la variable.

---

## ✅ NOMBRES EXACTOS - CÓPIALOS COMO ESTÁN

### Variable 1: Base de Datos

**NOMBRE (EXACTO):**
```
MONGODB_URI
```

**VALOR:**
```
mongodb+srv://Mariana_Gutierrez:CHClub123@clusterch.bv1is0b.mongodb.net/gym-ch-club?retryWrites=true&w=majority
```

**AMBIENTE:** Production

---

### Variable 2: Autenticación - Secret

**NOMBRE (EXACTO):**
```
NEXTAUTH_SECRET
```

**VALOR (ELIGE UNA - son válidas todas):**
- `32U7n8K9mL2pQ1xW5vH6jF3dG4bN7cM0Ry8kP9wS2tZ`
- `X4jL9mP2nQ5rS8tU1vW3xY6zA0bC7dE9fG2hI5jK8`
- `aB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0uV1wX2yZ3aB4`

O genera aquí: https://generate-secret.vercel.app/32

**AMBIENTE:** Production

---

### Variable 3: Autenticación - URL

**NOMBRE (EXACTO):**
```
NEXTAUTH_URL
```

**VALOR:**
```
https://gym-ch-club.vercel.app
```

**AMBIENTE:** Production

---

### Variable 4: API Pública

**NOMBRE (EXACTO):**
```
NEXT_PUBLIC_API_URL
```

**VALOR:**
```
https://gym-ch-club.vercel.app/api
```

**AMBIENTE:** Production

---

## 🎯 INSTRUCCIONES PASO A PASO EN VERCEL

### Paso 1: Abre la sección de variables

En Vercel, cuando estés importando el proyecto, verás:

```
Configure Project
├── Project Name: gym-ch-club
├── Environment Variables  ← AQUÍ HACES CLIC
```

Click en "Environment Variables"

### Paso 2: Agrega PRIMERA variable (MONGODB_URI)

1. **Campo "Name":** Escribe:
   ```
   MONGODB_URI
   ```
   (Mayúsculas, con guion bajo)

2. **Campo "Value":** Pega:
   ```
   mongodb+srv://Mariana_Gutierrez:CHClub123@clusterch.bv1is0b.mongodb.net/gym-ch-club?retryWrites=true&w=majority
   ```

3. **Dropdown "Environments":** Selecciona **Production**

4. Click **"Add"** o **"Save"**

### Paso 3: Agrega SEGUNDA variable (NEXTAUTH_SECRET)

1. Click **"Add Another"** (o el botón para agregar más)

2. **Campo "Name":**
   ```
   NEXTAUTH_SECRET
   ```

3. **Campo "Value":** Copia UNA de estas:
   ```
   32U7n8K9mL2pQ1xW5vH6jF3dG4bN7cM0Ry8kP9wS2tZ
   ```

4. **Dropdown "Environments":** **Production**

5. Click **"Add"**

### Paso 4: Agrega TERCERA variable (NEXTAUTH_URL)

1. Click **"Add Another"**

2. **Campo "Name":**
   ```
   NEXTAUTH_URL
   ```

3. **Campo "Value":**
   ```
   https://gym-ch-club.vercel.app
   ```

4. **Dropdown "Environments":** **Production**

5. Click **"Add"**

### Paso 5: Agrega CUARTA variable (NEXT_PUBLIC_API_URL)

1. Click **"Add Another"**

2. **Campo "Name":**
   ```
   NEXT_PUBLIC_API_URL
   ```

3. **Campo "Value":**
   ```
   https://gym-ch-club.vercel.app/api
   ```

4. **Dropdown "Environments":** **Production**

5. Click **"Add"**

### Paso 6: Deploy

Click botón azul **"Deploy"**

---

## 🆘 SI SIGUE DANDO ERROR

### Error: "The name contains invalid characters"

**Posibles causas:**

❌ **Escribiste:**
- `MONGODB-URI` (guion medio, NO es guion bajo)
- `MongoDb_Uri` (mayúsculas en lugares raros)
- `NEXT_PUBLIC-API_URL` (mezcla de guiones)
- `next_public_api_url` (minúsculas - NO)

✅ **Correcto:**
- `MONGODB_URI`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_API_URL`

### Solución:

1. **Copia exactamente los nombres de arriba**
2. **No escribas manualmente** - copia y pega
3. **Revisa mayúsculas/minúsculas**
4. **Verifica que NO tengas espacios antes/después**

---

## 🔍 VERIFICAR VARIABLES

Después de agregar todas 4 variables, antes de hacer Deploy, debería verse así:

```
✓ MONGODB_URI                → mongodb+srv://...
✓ NEXTAUTH_SECRET             → 32U7n8K9mL2...
✓ NEXTAUTH_URL                → https://gym-ch-club.vercel.app
✓ NEXT_PUBLIC_API_URL         → https://gym-ch-club.vercel.app/api
```

Si ves eso, entonces **SÍ puedes hacer Deploy**.

---

## ✅ AHORA SÍ FUNCIONA

1. Todas las variables correctas ✓
2. Click "Deploy"
3. Espera 2-3 minutos
4. ¡Tu app está en LÍNEA! 🚀

---

## 📸 SCREENSHOT AYUDA

Si sigues con dudas, verifica que en Vercel se vea así:

```
FIELD          VALUE                                          ENV
─────          ─────                                          ───
MONGODB_URI    mongodb+srv://Mariana_Gut...                 Prod
NEXTAUTH_...   32U7n8K9mL2pQ1xW5...                         Prod
NEXTAUTH_URL   https://gym-ch-club.vercel.app               Prod
NEXT_PUBLIC... https://gym-ch-club.vercel.app/api           Prod
```

Si está así, click Deploy y listo.

---

## 💬 DUDAS COMUNES

**P: ¿Puedo poner variables en Development también?**
A: No es necesario. Solo Production.

**P: ¿Importa el orden?**
A: No, el orden no importa.

**P: ¿Qué pasa si me equivoco?**
A: El build fallará. Verás error en "Deployments" tab. Corriges la variable y Vercel redeploy automático.

---

¡Ahora sí debería funcionar! 🎉
