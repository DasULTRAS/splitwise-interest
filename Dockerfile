FROM node:lts-slim

# Arbeitsverzeichnis im Container
WORKDIR /usr/src/app

# Abhängigkeiten kopieren
COPY package*.json ./

# Abhängigkeiten installieren
RUN npm ci

COPY . .

# Enviroment Variables
ENV POSTGRES_USER=user POSTGRES_PASSWORD=pw POSTGRES_DB=splitwise POSTGRES_HOST=db POSTGRES_PORT=5432

# App auf Port 8080 ausführen
EXPOSE 8080
CMD [ "npm", "start" ]
