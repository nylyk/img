FROM node:22-alpine

RUN mkdir /app && chown node /app
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

COPY --chown=node package.json pnpm-lock.yaml ./
RUN corepack enable

USER node

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --frozen-lockfile

COPY --chown=node . .

CMD ["pnpm", "dev"]
