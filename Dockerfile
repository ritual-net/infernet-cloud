FROM node:22-alpine AS base


FROM base AS deps
WORKDIR /app
COPY package.json ./

# Clean install all modules
RUN npm install -g pnpm
RUN pnpm i


FROM deps AS builder
COPY . .
COPY .env.docker .env

# Build SvelteKit app
RUN pnpm svelte-kit sync
RUN pnpm build

# Remove dev dependencies
RUN pnpm prune


FROM base AS runtime
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/package.json package.json
COPY --from=builder /app/node_modules node_modules/
COPY --from=builder /app/.env .env
COPY --from=builder /app/infernet-deploy infernet-deploy

# Install curl and unzip
RUN apk add --update curl unzip

# Install dotenvx
RUN curl -fsS https://dotenvx.sh/ | sh

# Install Terraform
ENV TERRAFORM_VERSION=1.8.5
RUN curl -fsSL https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip -o terraform.zip \
    && unzip terraform.zip -d /usr/local/bin/ \
    && rm -f terraform.zip


# Entry point for the app
ENV NODE_ENV=production
CMD ["dotenvx", "run", "--", "node", "build"]
