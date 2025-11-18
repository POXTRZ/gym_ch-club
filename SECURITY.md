# 🔐 SECURITY.md - Guía de Seguridad CH-Club

## Principios de Seguridad Implementados

### 1. **Variables de Entorno**
- ✅ Nunca hardcodear secrets
- ✅ Usar `.env.local` en desarrollo
- ✅ Variables seguras en dashboard de Vercel/Railway/Render
- ✅ `.env.production` en `.gitignore`

### 2. **Autenticación & Sesiones**
```
- NextAuth.js maneja sesiones seguras
- NEXTAUTH_SECRET debe ser fuerte
- Sessions en JWT (seguro para APIs)
- Cookies httpOnly (protegidas contra XSS)
```

### 3. **Base de Datos**
```
- MongoDB Atlas con autenticación
- IP Whitelist configurada
- Usuarios con permisos mínimos
- Backup automático en Atlas
```

### 4. **Datos Sensibles**
```
- Contraseñas hasheadas con bcryptjs
- Nunca loguear credenciales
- HTTPS obligatorio en producción
- Rate limiting en APIs
```

### 5. **Dominio Público**
```
- CORS configurado correctamente
- CSP headers recomendados
- HSTS enabled
- Headers de seguridad
```

---

## Configuración Recomendada

### next.config.mjs - Headers de Seguridad

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  
  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
    ]
  },
}

export default nextConfig
```

---

## Checklist de Seguridad

### Antes de Desplegar:

- [ ] NEXTAUTH_SECRET generado y configurado
- [ ] Variables de entorno NO en repositorio
- [ ] MongoDB IP Whitelist configurada
- [ ] .env.production en .gitignore
- [ ] HTTPS verificado en dominio público
- [ ] Admin/trainer usuarios cambiados
- [ ] Logs sensibles removidos

### Después de Desplegar:

- [ ] Probar login desde incógnito
- [ ] Verificar HTTPS en navegador (🔒)
- [ ] Revisar logs en dashboard
- [ ] Monitorear accesos
- [ ] Backup de MongoDB configurado

---

## Contraseñas Fuertes

### Para usuarios administrativos:

```
❌ NO: admin, 123456, password
✅ SÍ: K7#mP9$xQ2@wL8*vN1&jF4
```

Generador online:
- https://passwordsgenerator.net/

---

## Monitoreo Continuo

### Verificar que está arriba:

```bash
# Desde cualquier terminal
curl https://gym-ch-club.vercel.app/api/health

# Debería devolver: {"status":"ok"}
```

### Alertas recomendadas:

En Vercel Dashboard:
1. Settings → Notifications
2. Enable "Build" alerts
3. Enable "Deployment" errors

---

## En Caso de Emergencia

### Si comprometen credenciales:

1. **Inmediatamente:**
   - Cambiar NEXTAUTH_SECRET
   - Cambiar contraseña MongoDB
   - Revisar logs

2. **En Vercel:**
   - Redeploy proyecto
   - Invalidar sesiones activas

3. **En MongoDB:**
   - Cambiar usuario/contraseña
   - Revisar Activity Log

---

## Recursos Útiles

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Next.js Security: https://nextjs.org/docs/going-to-production
- MongoDB Security: https://docs.mongodb.com/manual/security/
