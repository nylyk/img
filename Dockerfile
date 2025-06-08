# base image for deps and build
FROM node:22.16-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV="production"

COPY backend /backend
COPY frontend /frontend
COPY common /common

RUN corepack enable

# deps image
FROM base AS deps

WORKDIR /backend
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --prod --frozen-lockfile

# build image
FROM base AS build

WORKDIR /backend
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --frozen-lockfile
RUN pnpm run build

WORKDIR /frontend
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --frozen-lockfile
RUN pnpm run build

# final image 
FROM gcr.io/distroless/nodejs22-debian12:nonroot

ENV NODE_ENV="production"

USER 1000:1000
COPY --from=deps /backend/node_modules /backend/node_modules
COPY --from=build /backend/dist /backend/dist
COPY --from=build /frontend/dist /frontend/dist

CMD ["/backend/dist/app.js"]
