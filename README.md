# Infernet Cloud

## Development

### Setup Local DB

After [installing EdgeDB](https://www.edgedb.com/install), create a local instance of the database deploy the schema:

```bash
# Initialize project (named "infernet_cloud" by default)
edgedb project init

# Deploy schema and generate TS files
npm run edgedb:migrate
```

Then, follow the instructions for [setting up EdgeDB Auth](https://www.edgedb.com/docs/guides/auth/index) via the EdgeDB UI:

```bash
# Launch EdgeDB UI app
edgedb ui
```

#### Updating schema

Every time you update the schema, you can create and execute an incremental schema migration file with:

```bash
# Create and run migration
npm run edgedb:migrate
```

If you make braking changes, or simply want to start with a fresh database, you can **destroy** the local database:

```bash
# Destroy local "infernet_cloud" database
edgedb instance destroy -I "infernet_cloud" --force
```

## Run from Source

***Recommended for development, debugging, and testing***.

First, follow the [local DB setup instructions](#setup-local-db).

Then, create a local environment file. Assuming no changes are made to the default SvelteKit and EdgeDB settings, you should be able to use the `.env.local.example` file without modifications:

```bash
# Creates local environment file
cp .env.local.example .env
```

Finally, run the app in one of the following modes:

#### Development mode

To run your app in development mode:

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev
```

#### Production mode

To create a production version of your app:

```bash
# Install dependencies
npm install

# Build from source
npm run build

# Run in production mode
node build
```

## Run with Docker

***Recommended for production***.

#### Setup

First, setup your **environment file**:

```bash
cp .env.docker.example .env
```

You **should (only) modify** the following variables:
- `EDGEDB_SERVER_PASSWORD`: The admin password for EdgeDB
- `ORIGIN`: The origin (host) from which the server should expect requests (i.e. the origin of the client). If this does not match the `Origin` header in your HTTP requests, you will get a [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) error.
- `SERVER_HOST`: The **external** url of your server (when running / testing locally, can set to `"http://localhost:3000"`).

#### Configure Authentication

The `auth.edgeql` performs the initial setup of the EdgeDB Auth server. You should configure it by modifying its values directly, following the guide's [instructions](https://www.edgedb.com/docs/guides/auth/index).

Most importantly, you **must**:
- Set a unique `auth_signing_key`.
- Decide whether to require email verification (set `require_verification` to `true`).
- Modify the SMTP Configuration to your preferred provider, for sending verification emails.

#### Deploy

You can then build and run the server and database images using `docker compose` as follows:

```bash
# Build images
docker compose build

# Run containers in the background
docker compose up -d
```

You can stop and remove the containers with:

```bash
# Remove containers
docker compose down
```
