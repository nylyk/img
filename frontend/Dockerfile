FROM node:22-alpine

RUN mkdir /app && chown node /app
WORKDIR /app

ENV NODE_ENV="development"
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

USER node

COPY --chown=node package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --frozen-lockfile

CMD ["pnpm", "dev"]
