# 1) Build the React app
FROM node:20.19-bookworm-slim AS base

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

# ---- Build stage
FROM base AS build

WORKDIR /app

COPY . .

RUN yarn build

# 2) Serve with Nginx
FROM nginx AS runtime

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

ARG NODE_ENV=production
COPY .env.${NODE_ENV} .env.${NODE_ENV}