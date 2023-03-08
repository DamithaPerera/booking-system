# Base image
FROM node:16.17.1-alpine

# Set working directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Build TypeScript code
RUN npm run build-prod

# Expose port 3000
EXPOSE 3000

# Start the app
CMD [ "node", "./dist/index.js" ]
