#Stage 1 - build

FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm run build

#stage 2 - serve

FROM nginx:stable-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80