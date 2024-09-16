# Stage 1: Build the Angular app using Node.js
FROM node:18 as build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the source code and build the app
COPY . .
RUN npm run build -- --configuration production

# Debugging step to list files in the dist directory
RUN ls -la /app/dist

# Stage 2: Serve the Angular app using NGINX
FROM nginx:alpine

# Copy the Angular app's build output to Nginx HTML directory
COPY --from=build /app/dist/aptar-hazard-detection/browser /usr/share/nginx/html

# Expose port 8080
EXPOSE 8080

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
