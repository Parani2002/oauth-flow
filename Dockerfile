# Use a small Node.js image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies first (leverages Docker cache)
COPY package.json package-lock.json* ./
RUN npm ci --production

# Copy app source
COPY . .

# Fix permissions for running as non-root user
RUN chown -R node:node /app
USER node

# Production env
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Simple healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

# Start the app
CMD ["node", "index.js"]
