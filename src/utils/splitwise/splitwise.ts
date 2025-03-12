import { auth } from "@/lib/auth";
import Setting, { ISetting } from "@/models/Setting";
import { connect } from "@/utils/mongodb";
import { Expense, Friend } from "./datatypes";

const Sw = require("splitwise");

async function getSettingFromDB(id: string): Promise<ISetting | null> {
  await connect();
  return Setting.findOne({ id });
}

async function getId() {
  // Get Usersession
  const session = await auth();

  // Stelle sicher, dass eine Session vorhanden ist
  if (!session?.user?.id) throw new Error("No user session found.");

  return session.user.id;
}

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

// Splitwise Class unsing Singleton Princip
export default class Splitwise {
  private static instances: Map<string, Splitwise> = new Map();
  public splitwise: any;
  private static maxCacheSize: number = 100; // Optionale Cache-Limitierung

  private constructor() {}

  /**
   * Löscht die Instanz für den aktuellen Benutzer basierend auf `getId()`
   */
  public static async resetInstance(): Promise<void> {
    const id: string = await getId();
    this.resetInstanceById(id);
  }

  /**
   * Löscht eine Instanz anhand der ID
   */
  public static resetInstanceById(id: string): void {
    this.instances.delete(id);
  }

  /**
   * Löscht und erstellt eine neue Instanz mit ID, consumerKey & consumerSecret
   */
  public static resetInstanceWithCredentials(id: string, consumerKey: string, consumerSecret: string): void {
    this.resetInstanceById(id);
    const instance = new Splitwise();
    instance.initializeWithCredentials(consumerKey, consumerSecret);
    this.cacheInstance(id, instance);
  }

  /**
   * Initialisiert die Instanz mit Daten aus der Datenbank
   */
  private async initialize(id: string): Promise<void> {
    const setting = await getSettingFromDB(id);

    if (!setting?.oauth?.consumerKey || !setting?.oauth?.consumerSecret) {
      throw new Error("No user or splitwise data found.");
    }

    this.splitwise = Sw({
      ...setting.oauth,
    });
  }

  /**
   * Initialisiert die Instanz mit direkt übergebenen Anmeldeinformationen
   */
  private initializeWithCredentials(consumerKey: string, consumerSecret: string): void {
    this.splitwise = Sw({
      consumerKey,
      consumerSecret,
    });
  }

  /**
   * Holt eine Instanz nach ID, lädt sie falls nicht vorhanden
   */
  public static async getInstanceById(id: string): Promise<Splitwise> {
    if (this.instances.has(id)) {
      return this.instances.get(id)!;
    }

    const instance = new Splitwise();
    await instance.initialize(id);
    this.cacheInstance(id, instance);

    return instance;
  }

  /**
   * Holt eine Instanz für den aktuellen Benutzer
   */
  public static async getInstance(): Promise<Splitwise> {
    const id = await getId();
    return this.getInstanceById(id);
  }

  /**
   * Speichert eine Instanz im Cache mit Begrenzung der maxCacheSize
   */
  private static cacheInstance(id: string, instance: Splitwise): void {
    if (this.instances.size >= this.maxCacheSize) {
      const firstKey = this.instances.keys().next().value;
      this.instances.delete(firstKey);
    }
    this.instances.set(id, instance);
  }
}

export async function getInventedDebts(user_id: number, friend_id: number, minDebtAge: number, splitwise?: any) {
  if (!splitwise) splitwise = (await Splitwise.getInstance()).splitwise;

  const friend: Friend = await splitwise.getFriend({ id: friend_id });
  const expenses: Expense[] = await splitwise.getExpenses({
    friend_id: friend.id,
    dated_after: new Date(Date.now() - minDebtAge * 24 * 60 * 60 * 1000).toISOString(),
    limit: 0,
  });

  // Sum all transactions in last two weeks
  let inventedDebts = 0;
  // add general debts
  if (friend.balance[0]) inventedDebts += Number(friend.balance[0].amount);

  expenses.forEach((expense) => {
    if (!expense.deleted_at)
      expense.repayments.forEach((repayment) => {
        if (repayment.from === friend.id && repayment.to === user_id) {
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
