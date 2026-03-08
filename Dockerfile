FROM node:18-alpine

WORKDIR /app

# Install dependencies (use npm ci for reproducible builds)
COPY package*.json ./
RUN npm ci --only=production

# Copy application source
COPY . .

ENV PORT=8080
EXPOSE 8080

CMD ["npm", "start"]
