FROM alpine:3

ENV TZ=Europe/Berlin
ENV CRON_VALUE="* * * * *"
ENV CURL_METHOD="POST"
ENV CURL_HOST="app"
ENV CURL_PORT=80
ENV CURL_PATH="/api/cron"
ENV CRON_SECRET="cron"

RUN ln -snf "/usr/share/zoneinfo/$TZ" /etc/localtime && echo "$TZ" > /etc/timezone

# Install all dependencies
RUN apk add --no-cache curl


WORKDIR /app

# Copy default shell scripts
COPY *.sh .
# Make shell scripts executable
RUN chmod +x ./*.sh

ENTRYPOINT [ "/app/entrypoint.sh" ]

CMD ["/usr/sbin/crond", "-f"]
