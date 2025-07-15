# ---- Base image with Node and dependencies
FROM node:20.19-bookworm-slim AS base

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

# ---- Build stage
FROM base AS build

WORKDIR /app

COPY . .

RUN yarn build

# ---- Runtime stage
FROM node:20.19-bookworm-slim AS runtime

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --production

COPY --from=build /app/dist ./dist

ARG NODE_ENV=production
COPY .env.${NODE_ENV} .env.${NODE_ENV}

ENV NODE_ENV=${NODE_ENV}

CMD ["node", "dist/index.js"]
