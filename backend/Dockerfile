# Use Debian-based Node image (not Alpine)
FROM node:22-alpine
# Set working directory
WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose backend port
EXPOSE 5000


# Start the server
CMD ["npm", "run", "dev"]
