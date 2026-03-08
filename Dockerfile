FROM node:18-alpine

WORKDIR /app

# Install dependencies (use npm ci for reproducible builds)
COPY package*.json ./
# Use npm install when package-lock.json may be missing (Cloud Build environment)
# Install only production dependencies and skip audit/fund messages to keep image build quiet
ENV NODE_ENV=production
RUN npm install --production --no-audit --no-fund

# Copy application source
COPY . .

ENV PORT=8080
EXPOSE 8080

CMD ["npm", "start"]
