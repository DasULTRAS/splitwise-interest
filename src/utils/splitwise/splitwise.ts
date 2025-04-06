import { SplitwiseClient } from "splitwise-sdk";

export function getLastMonday(daysAgo: number = 14) {
  const now = new Date();

  // Setzt die Uhrzeit auf 0 Uhr
  now.setHours(0, 0, 0, 0);

  // Ermittelt den aktuellen Wochentag (0 für Sonntag, 1 für Montag, ... 6 für Samstag)
  const currentDayOfWeek = now.getDay();

  // Ermittelt die Anzahl der Tage, die seit dem letzten Sonntag vergangen sind
  // Wenn heute Sonntag ist, ist der Wert 0, ansonsten addieren wir 1,
  // um zum vorherigen Sonntag zu gelangen
  const daysSinceLastMonday = currentDayOfWeek === 1 ? 0 : currentDayOfWeek;

  // Ermittelt die Anzahl der Tage, die zurückgegangen werden müssen, um zwei Wochen
  // vorherigen Sonntag zu erreichen. Dies umfasst 14 Tage plus die Tage seit dem letzten Sonntag.
  const daysToGoBack = daysAgo + daysSinceLastMonday;

  // Geht die benötigte Anzahl von Tagen zurück
  now.setDate(now.getDate() - daysToGoBack);

  return now;
}

export function roundUpToTwoDecimals(num: number) {
  return Math.ceil(num * 100) / 100;
}

export async function getInventedDebts(
  user_id: number,
  friend_id: number,
  minDebtAge: number,
  splitwise: SplitwiseClient,
) {
  const { friend } = await splitwise.getFriend(friend_id);
  const { expenses } = await splitwise.getExpenses({
    friend_id: friend?.id,
    dated_after: new Date(Date.now() - minDebtAge * 24 * 60 * 60 * 1000).toISOString(),
    limit: 0,
  });

  // Sum all transactions in last two weeks
  let inventedDebts = 0;
  // add general debts
  if (friend?.balance?.[0]) inventedDebts += Number(friend.balance[0].amount);

  expenses?.forEach((expense) => {
    if (!expense.deleted_at)
      expense?.repayments?.forEach((repayment) => {
        if (repayment.from === friend?.id && repayment.to === user_id) {
          inventedDebts -= Number(repayment.amount);
        } /* else if (repayment.from === user_id && repayment.to === friend.id) {
                    inventedDebts -= Number(repayment.amount);
                }*/
      });
  });

  // if he has payed some things in the last two weeks the balance could get less zero
  if (inventedDebts < 0) inventedDebts = 0;

  return roundUpToTwoDecimals(inventedDebts);
}
