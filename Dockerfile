# build environment
FROM node:12.8.0-alpine as build
# Create a directory where our app will be placed
RUN mkdir -p /app
# Set pat variables for node modules
ENV PATH /app/node_modules/.bin:$PATH
# Change directory so that our commands run inside this new directory
WORKDIR /app
# Copy dependency definitions
COPY app/package.json  /app/
# Install dependecies
RUN npm install --silent
# Get all the code needed to run the app
COPY app /app/
# Build the the app
RUN npm run build

# production environment
FROM nginx:1.17.2-alpine
RUN echo Healthy > /usr/share/nginx/html/status.html
ENV TZ=Australia/Melbourne
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
