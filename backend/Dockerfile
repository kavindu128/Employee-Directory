# Use Debian-based Node image (not Alpine)
FROM node:22

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

# Environment variable
ENV MONGODB_URI=mongodb://mongodb:27017/employeeDirectory

# Start the server
CMD ["npm", "run", "dev"]
