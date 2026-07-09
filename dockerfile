FROM node:20-alpine
# Directorio de trabajo dentro del contenedor
WORKDIR /app

# ─────────────────────────────────────────────
# Copiar manifiestos primero para aprovechar
# el cache de capas de Docker.
# Si package.json/package-lock.json no cambian,
# la capa de instalación se reutiliza.
# ─────────────────────────────────────────────
COPY package*.json ./

# Instalar solo dependencias de producción.
# package-lock.json está presente → usamos npm ci
# (más rápido y reproducible que npm install)
RUN npm ci --omit=dev

# ─────────────────────────────────────────────
# Copiar únicamente el código del servidor API.
# El cliente React se buildea en su propio
# contenedor (ver client/Dockerfile).
# ─────────────────────────────────────────────
COPY server/ ./server/

EXPOSE 3000

# Punto de entrada: inicia el servidor Express
CMD ["node", "./server/server.js"]