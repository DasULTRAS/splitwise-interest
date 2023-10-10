# Build-Image
FROM nouchka/sqlite3 as builder

WORKDIR /db-init

# Kopieren Sie das DB-Initialisierungsskript in das Build-Image
COPY init-db.sql ./init-db.sql
RUN sqlite3 database.db < init-db.sql

# Finale Image
FROM node:lts-slim

# Arbeitsverzeichnis im Container
WORKDIR /usr/src/app

# Abhängigkeiten kopieren
COPY package*.json ./

# Abhängigkeiten installieren
RUN npm ci

# App-Code und initialisierte Datenbank kopieren
COPY --from=builder /db-init/database.db ./db/database.db
COPY . .

ENV DATABASE_URL=sqlite:///usr/src/app/db/database.db

# App auf Port 8080 ausführen
EXPOSE 8080
CMD [ "npm", "start" ]
