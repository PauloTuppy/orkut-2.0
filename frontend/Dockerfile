# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install any needed dependencies
RUN npm install

# Copy the content of the local src directory to the working directory
COPY . .

# Build the application
RUN npm run build

# Command to run the application
CMD ["npm", "run", "preview"]
