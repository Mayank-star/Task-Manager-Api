# Base Image
FROM node:22-alpine

# Working Directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Dependencies
RUN npm ci

# Copy Project
COPY . .

# Port
EXPOSE 5000

# Start Application
CMD ["npm", "start"]