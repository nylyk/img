### base image
FROM node:26-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV="production"

COPY common /common
COPY backend/package.json backend/pnpm-lock.yaml backend/pnpm-workspace.yaml /backend/
COPY frontend/package.json frontend/pnpm-lock.yaml frontend/pnpm-workspace.yaml /frontend/

RUN npm install -g corepack@0.36.0 && corepack enable

### dev image
FROM base AS dev

ENV NODE_ENV="development"
ARG service

WORKDIR /$service
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --frozen-lockfile

### dependencies image
FROM base AS deps

WORKDIR /backend
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --prod --frozen-lockfile

### build image
FROM base AS build

WORKDIR /backend
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --frozen-lockfile
WORKDIR /frontend
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --frozen-lockfile

WORKDIR /backend
COPY backend .
RUN pnpm run build

WORKDIR /frontend
COPY frontend .
RUN pnpm run build

### final image 
FROM gcr.io/distroless/nodejs26-debian13:nonroot

ENV NODE_ENV="production"

USER 1000:1000
COPY --from=deps /backend/node_modules /backend/node_modules
COPY --from=build /backend/dist /backend/dist
COPY --from=build /frontend/dist /frontend/dist

CMD ["/backend/dist/app.js"]
