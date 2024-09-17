# Stage 1: Build the Angular app using Node.js
FROM node:18 as build

WORKDIR /app


COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build -- --configuration production



RUN ls -la /app/dist

# Stage 2: Serve the Angular app using NGINX
FROM nginx:alpine


COPY --from=build /app/dist/aptar-hazard-detection/browser /usr/share/nginx/html


EXPOSE 8080


CMD ["nginx", "-g", "daemon off;"]
