#docker build -t gerschdi/react:2 .
#docker push gerschdi/react:2


FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY ../../../OneDrive/Desktop/änderung .

# Build the React application
RUN npm run build

# Use a second stage to serve the React app with nginx
FROM nginx:alpine

# Copy the build output to the nginx html directory
COPY --from=0 /app/build /usr/share/nginx/html

# Copy nginx configuration file
COPY ../../../OneDrive/Desktop/änderung/nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port nginx is running on
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]