# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm install --legacy-peer-deps

# Copiar código fuente
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Instalar dumb-init para manejo adecuado de signals
RUN apk add --no-cache dumb-init

# Copiar solo lo necesario del builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public

# Crear usuario no-root por seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

USER nextjs

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Usar dumb-init para ejecutar el proceso
ENTRYPOINT ["dumb-init", "--"]

# Comando de inicio
CMD ["npm", "start"]
