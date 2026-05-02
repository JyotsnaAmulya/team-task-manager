# Stage 1: Build
FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Node/Express
FROM node:20-alpine
WORKDIR /app
# Copy the built assets
COPY --from=build-stage /app/dist ./dist
# Copy package files to install production dependencies
COPY package*.json ./
RUN npm install --production
# Copy the server script
COPY server.js ./

# Railway provides the PORT environment variable
ENV PORT=3000
EXPOSE 3000

CMD ["node", "server.js"]
