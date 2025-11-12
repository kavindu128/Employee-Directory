# Use official Node.js runtime (Debian-based for better stability)
FROM node:22

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

# Environment variable
ENV MONGODB_URI=mongodb://mongodb:27017/employeeDirectory

# Start the server
CMD ["npm", "run", "dev"]
