# splitwise-interest

A simple web app to calculate the interest on the splitwise balance.

## How to use the image

### docker stack or docker-compose

Example `docker-compose.yml` for `splitwise-interest`:

```yml
version: '3'

services:
  app:
    image: dasultras/splitwise-interest
    restart: unless-stopped
    ports:
      - "3100:80"
    env_file:
      - stack.env

  cron:
    image: dasultras/curl-cron:latest
    restart: unless-stopped
    environment:
      - CURL_HOST=app
      - CURL_PORT=80
    env_file:
      - stack.env
    depends_on: [ app ]

  db:
    image: mongo
    restart: unless-stopped
    ports:
      - "27017:27017"
    volumes:
      - data:/data/db
      - configdb:/data/configdb
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${DB_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${DB_PASS}
    env_file:
      - stack.env

  mongo-express:
    image: mongo-express
    restart: on-failure
    ports:
      - "3101:8081"
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: ${DB_USER}
      ME_CONFIG_MONGODB_ADMINPASSWORD: ${DB_PASS}
      ME_CONFIG_MONGODB_URL: mongodb://${DB_USER}:${DB_PASS}@db:27017/
    depends_on: [ db ]

volumes:
  data:
  configdb:
```

Run `docker stack deploy -c docker-compose.yml splitwise-interest` (or `docker-compose up -d`), wait for it to initialize completely, and visit *http://localhost:3100*, or *http://host-ip:3100* (as appropriate).

## Getting Started

### Environment Variables

1. Use the `.env.example` file to create a `.env` file in the _root directory_ of the project.
2. Add the values for the environment variables.
3. And duplicate the `.env` file in the _**db**_ directory.

### DB

start the Mongo DB server with docker-compose in the _**db**_ directory

```bash
docker-compose up -d
```

**MONGO EXPRESS**
> admin
> pass

### Site

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build

Docker build command using buildx Tools.

> Supported Platforms: amd64 und arm64

```bash
docker buildx build --platform linux/amd64,linux/arm64 -t dasultras/splitwise-interest:latest --push .
```
