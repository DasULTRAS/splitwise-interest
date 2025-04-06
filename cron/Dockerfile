FROM alpine:3.21.3

ENV TZ=Europe/Berlin
ENV CRON_VALUE="* * * * *"
ENV CURL_METHOD="POST"
ENV CURL_HOST="app"
ENV CURL_PORT=80
ENV CURL_PATH="/api/cron"
ENV CRON_SECRET="cron"

# Alle benötigten Pakete installieren
RUN apk add --no-cache curl

WORKDIR /app

# Shell-Skripte kopieren + ausführbar machen
COPY *.sh ./
RUN chmod +x ./*.sh

# Healthcheck
# Beispiel: HTTP GET Request an die Ziel-URL, die du prüfen möchtest.
# --fail sorgt dafür, dass ein Fehlercode zurückgegeben wird, 
# sobald keine 2xx- oder 3xx-Antwort kommt.
# -s schaltet "Silent mode" ein, damit keine zu großen Logs entstehen.
HEALTHCHECK --interval=5s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f -s -X "$CURL_METHOD" "http://$CURL_HOST:$CURL_PORT$CURL_PATH" || exit 1
 
ENTRYPOINT [ "/app/entrypoint.sh" ]
CMD ["/usr/sbin/crond", "-f"]
