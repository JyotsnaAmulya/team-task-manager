# Stage 1: Build
FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx, using PORT env variable
FROM nginx:stable-alpine
WORKDIR /app

# Copy build output
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy a startup script that generates nginx.conf with the correct port at runtime
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 8080

CMD ["/docker-entrypoint.sh"]
