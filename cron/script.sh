#!/bin/sh

execute_command() {
    curl -s -X "$CURL_METHOD" \
         -H "Accept: application/json" \
         -H "Content-Type: application/json" \
         -H "Authorization: Bearer $CRON_SECRET" \
         "http://$CURL_HOST:$CURL_PORT$CURL_PATH"
}

# Ausführung des Befehls
OUTPUT=$(execute_command 2>&1)
STATUS=$?

# Überprüfung, ob die Ausgabe das Wort "could not" enthält
if [ $STATUS -ne 0 ] || echo "$OUTPUT" | grep -qi "could not"; then
    echo "Fehler beim Ausführen des Befehls:"
    echo "curl -X $CURL_METHOD -H \"Accept: application/json\" -H \"Content-Type: application/json\" -H \"Authorization: Bearer $CRON_SECRET\" http://$CURL_HOST:$CURL_PORT$CURL_PATH"
    echo "Fehlermeldung:"
    echo "$OUTPUT"
    exit 1
else
    echo "Befehl erfolgreich ausgeführt. Response Body:"
    echo "$OUTPUT"
fi

exit 0
