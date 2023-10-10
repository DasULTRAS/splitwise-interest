FROM node:lts-slim

# Arbeitsverzeichnis im Container
WORKDIR /usr/src/app

# Abhängigkeiten kopieren
COPY package*.json ./

# Abhängigkeiten installieren
RUN npm ci

COPY . .

# Enviroment Variables
ENV POSTGRES_USER=user
ENV POSTGRES_PASSWORD=pw
ENV POSTGRES_DB=splitwise
ENV POSTGRES_HOST=db
ENV POSTGRES_PORT=5432

# App auf Port 8080 ausführen
EXPOSE 8080
CMD [ "npm", "start" ]
