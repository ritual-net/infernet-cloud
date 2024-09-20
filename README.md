# Infernet Cloud

**Infernet Cloud** is a self-hostable UI for configuring, deploying and monitoring [Infernet](https://docs.ritual.net/infernet/about) [node](https://docs.ritual.net/infernet/node/introduction) clusters and Infernet-compatible [containers](https://docs.ritual.net/infernet/node/containers) using major cloud hosting providers ([AWS](https://aws.amazon.com), [Google Cloud](https://cloud.google.com)).


## Table of contents

* **[Local setup](#local-setup)**
	* [Development scripts](#development-scripts-local-setup)

* **[Docker Compose setup](#docker-compose-setup)**
	* [Development scripts](#development-scripts-docker-compose-setup)

* **[Using Infernet Cloud](#using-infernet-cloud)**
	1. [Create an account](#1-create-an-account)
	2. [Connect a cloud provider](#2-connect-a-cloud-provider)
	3. [Connect a Docker account to run private Docker images (optional)](#3-connect-a-docker-account-to-run-private-docker-images-optional)
	4. [Create container templates (optional)](#4-create-container-templates-optional)
	5. [Create a cluster](#5-create-a-cluster)
	6. [Monitor and manage a cluster (and router)](#6-monitor-and-manage-a-cluster-and-router)
	7. [Monitor and manage nodes](#7-monitor-and-manage-nodes)


## Local setup

1. Install [Node.js](https://nodejs.org/en/download/package-manager) and [pnpm](https://pnpm.io/installation#using-npm).

2. Install [EdgeDB](https://www.edgedb.com/install).

3. Install [Terraform](https://developer.hashicorp.com/terraform/install).

4. Initialize the local setup:

	```bash
	pnpm init:local
	```

	This script will:
	* Create an [`.env.local`](.env.local) file with default values copied from [`.env.local.example`](.env.local.example), if one doesn't already exist
	* Install package dependencies from npm
	* Initialize a local EdgeDB instance (default name: `infernet_cloud`)
	* Apply EdgeDB database migrations

	If you have already created an EdgeDB instance with the default name and want to start over, run:

	```bash
	pnpm local:edgedb:destroy
	```

5. Configure environment variables:
	* Open [`.env.local`](.env.local) in a text editor and adjust the following environment variables:
		* `SERVER_HOST`: The public-facing URL of your Infernet Cloud server (default [`http://localhost:5173`](http://localhost:5173) when running locally).
		* `EDGEDB_HOST`, `EDGEDB_PORT`, `EDGEDB_SERVER_USER`, `EDGEDB_BRANCH`: The connection details of your EdgeDB instance.
			* Make sure these values match your EdgeDB instance configuration. To find the details of your local EdgeDB instance, run:
				```bash
				edgedb instance credentials
				```
	* Save [`.env.local`](.env.local).

6. Configure [EdgeDB Auth](https://docs.edgedb.com/guides/auth#extension-configuration)
	* Open [`dbschema/bootstrap/auth.edgeql`](dbschema/bootstrap/auth.edgeql) in a text editor.
		* Set `ext::auth::AuthConfig::allowed_redirect_urls` to the public-facing URL of your Infernet Cloud server (matching the `SERVER_HOST` environment variable from above).
		* Set `ext::auth::AuthConfig::auth_signing_key` to a unique high-entropy value.
		* Set `ext::auth::SMTPConfig::sender` to the email address to send verification emails from. Configure the other SMTP configuration values according to your email relay service as needed.
		* Under `ext::auth::EmailPasswordProviderConfig`, set `require_verification` to `true` to require new accounts to verify their email address before logging in; otherwise set it to `false`.
	* Save [`dbschema/bootstrap/auth.edgeql`](dbschema/bootstrap/auth.edgeql).
	* Apply changes to EdgeDB Auth settings:

		```bash
		pnpm local:edgedb:init:auth
		```

	For more information, see the [EdgeDB Auth documentation](https://docs.edgedb.com/guides/auth#extension-configuration).

7. Start the server:

	```bash
	pnpm start:local
	```

8. Access the Infernet Cloud UI:

	* Open a web browser and navigate to [`http://localhost:5173`](http://localhost:5173) (or the URL of your server defined in the `SERVER_HOST` environment variable).

	* Jump to **[Using Infernet Cloud](#using-infernet-cloud)** to get started with deploying an Infernet Node.

---

### Development scripts (local setup)

#### Server

* Start the local [Vite](https://vitejs.dev) server. Changes to the SvelteKit backend or frontend will cause an automatic hot-reload:

	```bash
	pnpm local:server:start
	```

* Start the local Vite server with Node.js debugging enabled:

	```bash
	pnpm local:server:debug
	```

#### EdgeDB (database)

* Initialize a local EdgeDB database instance (default name: `infernet_cloud`):

	```bash
	pnpm local:edgedb:init
	```

* After making changes to [`dbschema/schema.esdl`](dbschema/schema.esdl), create and apply migrations to local EdgeDB database instance, and regenerate TypeScript types:

	```bash
	pnpm local:edgedb:migrate
	```

* Destroy the local EdgeDB database instance and all its data:

	```bash
	pnpm local:edgedb:destroy
	```

* Open an [EdgeDB CLI](https://www.edgedb.com/docs/cli/overview) session:

	```bash
	pnpm local:edgedb:cli
	```

* Open the [EdgeDB UI](https://www.edgedb.com/docs/ui/overview):

	```bash
	pnpm local:edgedb:ui
	```


Find more commands and their definitions in the `scripts` section of [`package.json`](package.json).


## Docker Compose setup (recommended for production)

1. Install [Docker Compose](https://docs.docker.com/compose/install) or an equivalent GUI ([Docker Desktop](https://www.docker.com/products/docker-desktop/), [OrbStack](https://orbstack.dev), [Podman](https://podman-desktop.io), etc.)

2. Install [pnpm](https://pnpm.io/installation).

3. Initialize the Docker Compose setup:

	```bash
	pnpm init:docker
	```

	This script will:
	* Create an [`.env.docker`](.env.docker) file with default values copied from [`.env.docker.example`](.env.docker.example), if one doesn't already exist
	* Install package dependencies from npm
	* Intialize Docker volume for `edgedb` service at [`./edgedb-data/`](edgedb-data), apply default EdgeDB Auth config, and perform schema migrations.

4. Configure environment variables:
		* Open [`.env.docker`](.env.docker) in a text editor and adjust the following environment variables:
			* `SERVER_HOST`: The public-facing URL of your Infernet Cloud server (default [`http://localhost:3000`](http://localhost:3000) when running locally).
			* `EDGEDB_SERVER_PASSWORD`: The admin password for the EdgeDB database.
			* `SENDGRID_KEY` (optional): A [SendGrid API Key](https://www.twilio.com/docs/sendgrid/api-reference) used to authenticate the SendGrid email relay service.
				* To use a different email relay service, modify the environment variables found at [`docker-compose.yml`](docker-compose.yml) › `services` › `smtp` › `environment`.
		* Save [`.env.docker`](.env.docker).

	### Configure [EdgeDB Auth](https://docs.edgedb.com/guides/auth#extension-configuration):
		* Open [`dbschema/bootstrap/auth.edgeql`](dbschema/bootstrap/auth.edgeql) in a text editor.
			* Set `ext::auth::AuthConfig::allowed_redirect_urls` to the public-facing URL of your Infernet Cloud server (matching the `SERVER_HOST` environment variable from above).
			* Set `ext::auth::AuthConfig::auth_signing_key` to a unique high-entropy value.
			* Set `ext::auth::SMTPConfig::sender` to the email address to send verification emails from. Configure the other SMTP configuration values according to your email relay service as needed.
			* Under `ext::auth::EmailPasswordProviderConfig`, set `require_verification` to `true` to require new accounts to verify their email address before logging in; otherwise set it to `false`.
		* Save [`dbschema/bootstrap/auth.edgeql`](dbschema/bootstrap/auth.edgeql).
		* Apply changes to EdgeDB Auth settings:

			```bash
			pnpm docker:edgedb:init:auth
			```

		For more information, see the [EdgeDB Auth documentation](https://docs.edgedb.com/guides/auth#extension-configuration).

6. If hosting Infernet Cloud on a cloud provider with a public-facing URL, configure the reverse proxy:
	* Open [`caddy/Caddyfile`](caddy/Caddyfile) in a text editor.
	* Replace `localhost:3000` with the public-facing domain of your Infernet Cloud server (matching the `SERVER_HOST` environment variable from above, with `http://` or `https://` omitted).
	* Save [`caddy/Caddyfile`](caddy/Caddyfile).
	* Ensure the corresponding port (default `3000`) is forwarded and whitelisted in your cloud provider's firewall settings.

	For more information, see the [Caddyfile documentation](https://caddyserver.com/docs/caddyfile).

7. Start all services:

	```bash
	pnpm docker:start
	```

	Docker images for all services will be installed from Docker Hub on first run.

	#### List of services:

	* `caddy` – [reverse proxy](https://caddyserver.com)
		* First run: generates a self-signed SSL certificate using [Let's Encrypt](https://letsencrypt.org).

	* `server` – [Node.js web server](https://nodejs.org)
		* First run: installs npm package dependencies and builds Node.js production server using [SvelteKit](https://kit.svelte.dev).

	* `smtp` – email relay service (used for sending user verification emails)

	* `edgedb` – [EdgeDB](https://www.edgedb.com) database
		* First run: initializes Docker volume at [`./edgedb-data/`](edgedb-data), configures EdgeDB Auth, and performs schema migrations.
		* **IMPORTANT**: **Keep the contents of the `./edgedb-data/` directory safe. If you modify/delete it, you will lose data stored in the database!**

8. Access the Infernet Cloud UI:
	* Open a web browser and navigate to [`http://localhost:3000`](http://localhost:3000) (or the public URL of your server defined in the `SERVER_HOST` environment variable).

	* If you're having trouble, double-check that the following values match:
		* The `SERVER_HOST` environment variable in [`.env.docker`](.env.docker)
		* The value of `ext::auth::AuthConfig::allowed_redirect_urls` in [`dbschema/bootstrap/auth.edgeql`](dbschema/bootstrap/auth.edgeql)
		* The domain name in [`caddy/Caddyfile`](caddy/Caddyfile) (with `http://` or `https://` omitted)

	* Jump to **[Using Infernet Cloud](#using-infernet-cloud)** to get started with deploying an Infernet Node.

9. Stop all services:

	```bash
	pnpm docker:stop
	```

---

### Development scripts (Docker Compose setup)

#### Docker Compose

* Run the Docker Compose CLI with the [`.env.docker`](.env.docker) environment variables applied:

	```bash
	pnpm docker-compose
	```

* Start all Docker services in detached mode and display logs (wraps `docker compose up` command):

	```bash
	pnpm docker:start
	```

* Rebuild Docker images without cache, then (re)start all services:

	```bash
	pnpm docker:start:force
	```

* Stop and remove all Docker services (wraps `docker compose down` command):

	```bash
	pnpm docker:stop
	```

* Remove unused Docker data (images, containers, networks, and volumes):

	```bash
	pnpm docker:clean
	```

#### `server` service:

* Rebuild and restart `server` service after making changes to SvelteKit backend or frontend:

	```bash
	pnpm docker:server:restart
	```

#### `edgedb` service:

* Restart `edgedb` service and migrate the database after making changes to EdgeDB schema / migrations:

	```bash
	pnpm docker:edgedb:restart
	```

* Create a timestamped backup of the EdgeDB Docker volume ([`./edgedb-data/`](edgedb-data)):

	```bash
	pnpm docker:edgedb:backup
	```

* Permanently delete the current EdgeDB Docker volume ([`./edgedb-data/`](edgedb-data)) after confirmation:

	```bash
	pnpm docker:edgedb:destroy
	```

* Open an [EdgeDB CLI](https://docs.edgedb.com/cli) session from inside the `edgedb` Docker container:

	```bash
	pnpm docker:edgedb:cli
	```

Find more commands and their definitions in the `scripts` section of [`package.json`](package.json).


## Using Infernet Cloud

### 1. Create an account

* Navigate to **Log in** › **Sign up**.

* Choose a name, email address, and password.

* If email verification is enabled, verify your email address using the link sent to your email.

* Log in.

### 2. Connect a cloud account

* Navigate to **Accounts** › **Connect Cloud Account**.

* Choose a cloud provider (AWS or Google Cloud), name your account, and click **Continue**.

* Follow the instructions to install the cloud provider's CLI, run a script to generate credentials, and paste the credentials into the form.

### 3. Connect a Docker account to run private Docker images (optional)

* Navigate to **Accounts** › **Connect Docker account**.

* Follow the instructions to [log into Docker Hub](https://hub.docker.com), generate credentials, and paste the credentials into the form.

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

* From **Clusters**, navigate to a cluster detail page.

* Click on a node to view its details, or right-click to trigger actions:
	* **Edit node**: modify the node's configuration.
	* **Start node**: start a stopped node.
	* **Stop node**: stop a running node.

* To add a node to an existing cluster, click "Add node".

* Scroll down to browse logs and container details.
