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

### Run source

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev
```

### Before pushing

Make sure to always lint and format your code before pushing:

```bash
npm run lint
npm run format
```

## Building

To create a production version of your app:

```bash
# Run in production mode
npm run build
```

You can preview the production build with `npm run preview`.
