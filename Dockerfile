# Nginx image as the base image
FROM nginx:alpine

# Copy the Angular app's build output to the Nginx HTML directory
COPY ./dist/aptar-hazard-detection/browser /usr/share/nginx/html

# Copy the custom Nginx configuration file
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080 
EXPOSE 8080

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]