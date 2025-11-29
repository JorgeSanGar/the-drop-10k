# Usa Node.js LTS
FROM node:18-slim

# Directorio de trabajo
WORKDIR /app

# Copia package files
COPY package*.json ./

# Instala dependencias
RUN npm ci --only=production

# Copia el resto del código
COPY . .

# Expone el puerto (Cloud Run usa PORT env variable)
EXPOSE 8080

# Comando de inicio
CMD ["node", "server.js"]
