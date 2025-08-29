FROM node:22.17-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

RUN npm i

# Build the application
RUN npm run build

# Expose port
ARG PORT=3000
ENV PORT=${PORT}
EXPOSE ${PORT}

# Start the application
CMD ["npm", "run", "dev", "--port", "$PORT"]
