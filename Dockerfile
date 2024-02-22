FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json ./

# Clean install all modules
RUN npm install -g pnpm
RUN pnpm i

FROM deps AS builder
COPY . .
COPY .env.docker.example .env

# Build SvelteKit app
RUN pnpm build

# Remove dev dependencies
RUN pnpm prune

FROM base AS runtime
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/package.json package.json
COPY --from=builder /app/node_modules node_modules/
COPY --from=builder /app/.env .env
COPY --from=builder /app/src/lib/deploy src/lib/deploy

# Install Terraform
ENV TERRAFORM_VERSION=1.7.0

RUN apk add --update curl unzip
RUN curl -fsSL https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip -o terraform.zip \
    && unzip terraform.zip \
    && mv terraform /usr/local/bin/ \
    && rm -f terraform.zip

# Entry point for the app
ENV NODE_ENV=production
CMD ["node", "-r", "dotenv/config", "build"]
