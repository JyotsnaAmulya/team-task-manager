# Stage 1: Build
FROM node:20-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve
FROM node:20-alpine
WORKDIR /app
COPY --from=build-stage /app/dist ./dist
RUN npm install -g serve
EXPOSE 3000
# Railway provides the PORT environment variable
CMD ["sh", "-c", "serve -s dist -l $PORT"]
