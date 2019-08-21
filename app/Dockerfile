# Create image based on the official Node 10 image from dockerhub
FROM node:12.8.0-alpine

# Create a directory where our app will be placed
RUN mkdir -p /app

# Set Timezone
ENV TZ=Australia/Melbourne

# Change directory so that our commands run inside this new directory
WORKDIR /app

# Copy dependency definitions
COPY package*.json /app/

# Install dependecies
RUN npm install --silent

# Get all the code needed to run the app
COPY . /app/

# Expose the port the app runs in
EXPOSE 3535

# Serve the app
# CMD ["npm", "start"]
