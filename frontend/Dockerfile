# Use official Node.js runtime (Debian-based for better stability)
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose backend port
EXPOSE 5000


# Start the server
CMD ["npm", "run", "dev","--","--host","0.0.0.0","--port","5173"]
