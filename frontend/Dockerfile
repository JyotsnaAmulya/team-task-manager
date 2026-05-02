# Stage 1: Build
FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Copy build output
COPY --from=build-stage /app/dist /usr/share/nginx/html

# The official nginx image automatically runs envsubst on files in /etc/nginx/templates/*.template
# and outputs the result to /etc/nginx/conf.d/*.conf
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# No EXPOSE or CMD needed - Railway and Nginx handle it
