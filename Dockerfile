# Use Node.js LTS version
FROM node:20-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the application
CMD [ "node", "server.js" ]
