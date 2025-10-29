# Use official Node.js runtime as base image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Define environment variable
ENV MONGODB_URI=mongodb://mongodb:27017/employeeDirectory

# Start the application
CMD ["npm", "run", "dev"]