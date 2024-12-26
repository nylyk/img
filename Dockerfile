ARG ALPINE_VERSION=3.21

# base image for deps and build
FROM node:22-alpine${ALPINE_VERSION} AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV="production"

COPY backend /backend
COPY frontend /frontend
COPY common /common

WORKDIR /backend
RUN corepack enable

# deps image
FROM base AS deps

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --prod --frozen-lockfile

WORKDIR /frontend
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --prod --frozen-lockfile

# build image
FROM base AS build

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --frozen-lockfile
RUN pnpm run build

WORKDIR /frontend
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --frozen-lockfile
RUN pnpm run build

# final image 
FROM alpine:${ALPINE_VERSION}
ENV NODE_ENV="production"

RUN apk add --no-cache libstdc++ dumb-init \
  && addgroup -g 1000 node && adduser -u 1000 -G node -s /bin/sh -D node \
  && chown node:node ./

COPY --from=build /usr/local/bin/node /usr/local/bin
COPY --from=build /usr/local/bin/docker-entrypoint.sh /usr/local/bin
ENTRYPOINT ["docker-entrypoint.sh"]
USER node

COPY --from=deps /backend/node_modules /backend/node_modules
COPY --from=build /backend/dist /backend/dist
COPY --from=build /frontend/dist /frontend/dist

CMD ["dumb-init", "node", "/backend/dist/app.js"]
