# use in local to create db container
# version: '3.8'

# services:
#   postgres:
#     container_name: 'chaxis'
#     image: postgres:latest
#     ports:
#       - '5432:5432'
#     environment:
#       POSTGRES_USER: chaxis
#       POSTGRES_PASSWORD: root
#       POSTGRES_DB: chaxis
#       PGDATA: /data/postgres
#     volumes:
#       - ./data/pg:/data/postgres

# -----------------------------------------------------

# Use an official Node.js runtime as a parent image
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) before other files
# Leverage Docker cache to save time on dependency installation
COPY package*.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm run install

# Copy the rest of your application code to the container
COPY . .

# Build the NestJS application
RUN npm run prebuild
RUN npm run build

# Expose the port that your NestJS app runs on
EXPOSE 3000

# Define the command to run your app
CMD ["node", "dist/src/main"]
