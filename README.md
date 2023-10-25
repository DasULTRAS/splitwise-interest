# splitwise-interest

A simple web app to calculate the interest on the splitwise balance.

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
