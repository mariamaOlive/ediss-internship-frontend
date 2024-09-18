# Stage 1: Build the Angular app using Node.js
FROM node:18 as build

WORKDIR /app


COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

ARG API_URL="http://127.0.0.1:8000"
RUN sed -i "s|apiUrl:.*|apiUrl: '${API_URL}'|" src/app/environments/environment.ts
RUN sed -i "s|apiUrl:.*|apiUrl: '${API_URL}'|" src/app/environments/environment.prod.ts

RUN npm run build -- --configuration production



RUN ls -la /app/dist

# Stage 2: Serve the Angular app using NGINX
FROM nginx:alpine


COPY --from=build /app/dist/aptar-hazard-detection/browser /usr/share/nginx/html


EXPOSE 8080


CMD ["nginx", "-g", "daemon off;"]
