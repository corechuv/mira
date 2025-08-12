# build frontend
FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm ci || npm i
RUN npm run build && npm run build:server

# run server
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/server/dist ./server/dist
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm i --omit=dev
EXPOSE 8787
CMD ["node","server/dist/index.js"]
