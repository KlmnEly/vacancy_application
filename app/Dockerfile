FROM node:20-alpine

# Define working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json before the code
COPY package*.json ./

# Install dependencies (only on the base image)
RUN npm install

# Expose the port
EXPOSE 3000

# Default command
CMD ["npm", "run", "start:dev"]