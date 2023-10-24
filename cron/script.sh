#!/bin/sh

COMMAND="curl -X $CURL_METHOD -H \"Accept: application/json\" -H \"Content-Type: application/json\" -H \"Authorization: Bearer $CRON_SECRET\" http://$CURL_HOST:$CURL_PORT$CURL_PATH"

# Ausführung des Befehls
OUTPUT=$($COMMAND 2>&1)
STATUS=$?

# Überprüfung, ob die Ausgabe das Wort "failed" enthält
if [ $STATUS -ne 0 ] || echo "$OUTPUT" | grep -qi "failed"; then
    echo "Fehler beim Ausführen des Befehls:"
    echo "$COMMAND"
    echo "Fehlermeldung:"
    echo "$OUTPUT"
    exit 1
fi

echo "Command: $COMMAND"
echo "Output: $OUTPUT"

exit 0
