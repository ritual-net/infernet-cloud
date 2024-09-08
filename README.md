# Infernet Cloud

**Infernet Cloud** is a self-hostable UI for configuring, deploying and monitoring [Infernet](https://docs.ritual.net/infernet/about) [node](https://docs.ritual.net/infernet/node/introduction) clusters and Infernet-compatible [containers](https://docs.ritual.net/infernet/node/containers) using major cloud hosting providers ([AWS](https://aws.amazon.com), [Google Cloud](https://cloud.google.com)).

## Table of contents

* **[Local setup](#local-setup)**
* **[Docker Compose setup](#docker-compose-setup)**
	* **[Development scripts (Docker Compose setup)](#development-scripts-docker-compose-setup)**
* **[Usage](#usage)**
	* **[Development scripts (local setup)](#development-scripts-local-setup)**

## Local setup

1. [Install pnpm](https://pnpm.io/installation).
2. [Install EdgeDB](https://www.edgedb.com/install).
3. [Install Terraform](https://developer.hashicorp.com/terraform/install).
4. Initialize the project:

	```bash
	pnpm run init:local
	```

	This script will:
	* Create an [.env.local](.env.local) file with default values
	* Initialize a local EdgeDB project (default name: `"infernet_cloud"`)
	* Perform EdgeDB database migrations
	* Install npm package dependencies

5. Configure environment variables by editing the [`.env.local`](.env.local) file:
	* `SERVER_HOST`: The public-facing URL of your server (default `http://localhost:3000` when running locally).
	* `EDGEDB_BASE_URL`: The URL of your EdgeDB instance.

6. Start the server:

	Development mode:
	```bash
	pnpm run start:local
	```

7. Navigate to [http://localhost:3000](http://localhost:3000) in your browser to access the UI.

---

### Development scripts (local setup)

#### Server

```bash
pnpm run local:server
```

* Start the local [Vite](https://vitejs.dev) server. Changes to the SvelteKit backend or frontend will cause an automatic hot-reload.

```bash
pnpm run local:server:debug
```

* Start the local [Vite](https://vitejs.dev) server with Node.js debugging enabled.

#### EdgeDB (database)

* Initialize a local EdgeDB database instance (default name: "infernet_cloud").
	```bash
	pnpm run local:edgedb:init
	```

* Create and apply migrations to local EdgeDB database instance after making changes to [dbschema/schema.esdl](dbschema/schema.esdl), and generate TypeScript types.
	```bash
	pnpm run local:edgedb:migrate
	```

* Destroy the local EdgeDB database instance and all its data.
	```bash
	pnpm run local:edgedb:destroy
	```

* Open an [EdgeDB CLI](https://www.edgedb.com/docs/cli/overview) session.
	```bash
	pnpm run local:edgedb:cli
	```

* Open the [EdgeDB UI](https://www.edgedb.com/docs/ui/overview).
	```bash
	pnpm run local:edgedb:ui
	```


Find more commands and their definitions in the `scripts` section of [package.json](package.json).

## Docker Compose setup (recommended for production)

1. Install [Docker Compose](https://docs.docker.com/compose/install) or an equivalent GUI ([Docker Desktop](https://www.docker.com/products/docker-desktop/), [OrbStack](https://orbstack.dev), [Podman](https://podman-desktop.io), etc.)
2. [Install pnpm](https://pnpm.io/installation).
3. Initialize the project:

	```bash
	pnpm run docker:init
	```

	* Creates an `.env.docker` file with default values
	* Installs npm package dependencies

4. Configure environment variables by editing the [`.env.docker`](.env.docker) file:
	* `SERVER_HOST`: The public-facing URL of your Infernet Cloud server (default `http://localhost:3000` when running locally).
	* `EDGEDB_SERVER_PASSWORD`: The admin password for the EdgeDB database.
	* `SENDGRID_KEY` (optional): A [SendGrid API Key](https://www.twilio.com/docs/sendgrid/api-reference) used to authenticate the SendGrid email relay service.
		* To use a different email relay service, modify the environment variables in [docker-compose.yml](docker-compose.yml) found at `services` › `smtp` › `environment`.

5. Configure [EdgeDB Auth](https://docs.edgedb.com/guides/auth#email-and-password):
	* Open [dbschema/auth.edgeql](dbschema/auth.edgeql) in a text editor.
	* Set to value of `ext::auth::AuthConfig::allowed_redirect_urls` to the public-facing URL of your Infernet Cloud server (matching the `SERVER_HOST` environment variable from above).
	* Set the value of `ext::auth::AuthConfig::auth_signing_key` to a unique high-entropy value.
	* Set the value `ext::auth::SMTPConfig::sender` to the email address to send verification emails from. Configure the other SMTP configuration values according to your email relay service as needed.
	* To require new accounts to verify their email address before logging in, set `ext::auth::AuthConfig::require_verification` to `true`, otherwise set it to `false`.
	* Save [dbschema/auth.edgeql](dbschema/auth.edgeql).

	For more information, see the [EdgeDB Auth](https://docs.edgedb.com/guides/auth#email-and-password) documentation.

6. If hosting on a cloud provider, configure the reverse proxy:
	* Open [caddy/Caddyfile](caddy/Caddyfile) in a text editor.
	* Replace `my.infernet-cloud.instance.example` with the public-facing URL of your Infernet Cloud server (matching the `SERVER_HOST` environment variable from above).
	* Save [caddy/Caddyfile](caddy/Caddyfile).
	* Ensure the corresponding port (default `3000`) is forwarded and whitelisted in the cloud provider's firewall settings.

7. Start all services:

	```bash
	pnpm run docker:up
	```

	Docker images will be installed from Docker Hub on first run

	### List of services:

	* `caddy` – [reverse proxy](https://caddyserver.com)
		* First run: generates a self-signed SSL certificate using [Let's Encrypt](https://letsencrypt.org).

	* `server` – [Node.js web server](https://nodejs.org)
		* First run: installs npm package dependencies and builds Node.js production server using [SvelteKit](https://kit.svelte.dev).

	* `edgedb` – [EdgeDB](https://www.edgedb.com) database
		* First run: initializes Docker volume at [./edgedb-data](edgedb-data), configures EdgeDB Auth, and performs schema migrations.
		* **IMPORTANT**: **Keep the `edgedb-data` directory safe. If you delete it, you will lose all data stored in the database!**

	* `smtp` – email relay service (used for sending user verification emails)

8. Access the UI by opening a web browser and navigating to [http://localhost:3000](http://localhost:3000) (or the public URL of your server defined in the `SERVER_HOST` environment variable).

9. Stop all services:

	```bash
	pnpm run docker:down
	```

---

### Development scripts (Docker Compose setup)

#### Docker Compose

* Start all Docker services in detached mode and display logs.
	```bash
	pnpm run docker:up
	```

* Rebuild Docker images without cache, then (re)start all services.
	```bash
	pnpm run docker:up:force
	```

* Stop and remove all Docker services.
	```bash
	pnpm run docker:down
	```

* Remove unused Docker data (images, containers, networks, and volumes).
	```bash
	pnpm run docker:clean
	```

#### `server` service:

* Rebuild and restart `server` service after making changes to SvelteKit backend or frontend.
	```bash
	pnpm run docker:server:restart
	```

#### `edgedb` service:

* Restart `edgedb` service and migrate the database after making changes to EdgeDB schema / migrations.
	```bash
	pnpm run docker:edgedb:restart
	```

* Create a timestamped backup of the EdgeDB Docker volume.
	```bash
	pnpm run docker:edgedb:backup
	```

* Permanently delete the current EdgeDB Docker volume after confirmation.
	```bash
	pnpm run docker:edgedb:destroy
	```

* Open an [EdgeDB CLI](https://docs.edgedb.com/cli) session from inside the `edgedb` Docker container.
	```bash
	pnpm run docker:edgedb:cli
	```

Find more commands and their definitions in the `scripts` section of [package.json](package.json).

## Usage

### 1. Create an account
* Navigate to **Log in**.
* Choose an email and password.
* Verify your email address using the link sent to your email.
* Log in.

### 2. Connect a cloud provider
* Navigate to **Accounts** › **Connect Cloud Account**.
* Choose a cloud provider (AWS or Google Cloud), name your account, and click **Continue**.
* Follow the instructions to install the cloud provider's CLI, run a script to generate credentials, and paste the credentials into the form.

### 3. Connect a Docker account to run private Docker images (optional)
* Navigate to **Accounts** › **Connect Docker account**.
* Follow the instructions to log into Docker Hub, generate credentials, and paste the credentials into the form.

### 4. Create container templates (optional)
* Navigate to **Templates** › **Create template**.
* Under "Container template name", choose a template name.
* Under "Node configuration", specify the conditions needed for a node to run the container.
	* To use a private Docker image, choose the owner's Docker Hub account.
* Under "Customize container", specify the container's configuration.
	* To use a private Docker image, look for image IDs grouped under the owner's Docker Hub username.
* Click **Add container template**.

### 5. Create a cluster
* Navigate to **Clusters** › **Create cluster**.
* Choose a connected cloud account to deploy the cluster with.
* Set a name, firewall rules, and default region and zone for the [Infernet Router](https://docs.ritual.net/infernet/router/introduction) and [Infernet Nodes](https://docs.ritual.net/infernet/node/introduction).
* If desired, configure the location and machine type of the [Infernet Router](https://docs.ritual.net/infernet/router/introduction).
* Configure one or more [Infernet Nodes](https://docs.ritual.net/infernet/node/introduction) and their containers.
	* To add a container to a node, click "Add container". You can choose an existing container template or create a new one.
* Click "Create cluster".

### 6. Monitor and manage a cluster (and router)
* Navigate to **Clusters** to view your clusters.
* Click on a cluster to view its details, or right-click to trigger actions:
	* **Edit cluster**: modify the configuration of the cluster (and router).
	* **Trigger update**: manually trigger a redeployment of the cluster and provisioning of associated cloud resources.
	* **Destroy cluster**: tear down the cluster and all associated nodes and cloud resources.
	* **Recreate cluster**: recreate a destroyed cluster by reusing the existing configuration.
	* **Delete cluster**: PERMANENTLY delete the configuration and deployment history of a destroyed cluster.
* Scroll down to browse details about the cluster's cloud resources and deployment history.

### 7. Monitor and manage nodes
* Navigate to a cluster detail page,
* Click on a node to view its details, or right-click to trigger actions:
	* **Edit node**: modify the node's configuration.
	* **Start node**: start a stopped node.
	* **Stop node**: stop a running node.
* To add a node to an existing cluster, click "Add node".
* Scroll down to browse logs and container details.
