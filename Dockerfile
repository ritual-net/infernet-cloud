FROM node:22-alpine AS base

# Include pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app


FROM base AS prod-deps

# pnpm install (production)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile


FROM base AS build

COPY .env.docker .env

# pnpm install
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build SvelteKit app
RUN pnpm svelte-kit sync
RUN pnpm run build


FROM base AS runtime

# Install curl and unzip
RUN apk add --update curl unzip

# Install dotenvx
RUN curl -fsS https://dotenvx.sh/ | sh

# Install Terraform
ENV TERRAFORM_VERSION=1.9.0
RUN curl -fsSL https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip -o terraform.zip \
    && unzip terraform.zip -d /usr/local/bin/ \
    && rm -f terraform.zip


FROM runtime AS app

COPY --from=prod-deps /app/node_modules/ /app/node_modules/
COPY --from=build /app/build/ /app/build/
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/.env /app/.env
COPY --from=build /app/infernet-deploy /app/infernet-deploy
WORKDIR /app

# Entry point for the app
ENV NODE_ENV=production
CMD ["dotenvx", "run", "--", "node", "build"]
