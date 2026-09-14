# Stage 1: Build the React client
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install --legacy-peer-deps
COPY client/ ./
RUN npm run build

# Stage 2: Production Server
FROM node:20-alpine
WORKDIR /app

# Install server dependencies
COPY server/package*.json ./server/
RUN cd server && npm install --production

# Copy server code
COPY server/ ./server/

# Copy client built assets into location served by server
COPY --from=client-builder /app/client/dist ./client/dist

# Expose port
ENV PORT=5000
EXPOSE 5000

# Start server
WORKDIR /app/server
CMD ["node", "index.js"]
