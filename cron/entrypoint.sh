#!/bin/sh

echo "entrypoint.sh: Renewed Crontab"

echo -e "$CRON_VALUE sh /app/script.sh; echo \"Cron ran \$(date)\"" >> cron.tmp
crontab cron.tmp
cat cron.tmp
rm -rf cron.tmp

# Zeitzone setzen
ln -snf "/usr/share/zoneinfo/$TZ" /etc/localtime && echo "$TZ" > /etc/timezone

exec "$@"
