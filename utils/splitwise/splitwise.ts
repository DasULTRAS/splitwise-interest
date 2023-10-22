import { getServerSession } from "next-auth/next";
import { Session } from 'next-auth';
const Sw = require('splitwise');
import User from '@/models/User';
import { connectToDb } from '@/utils/mongodb';
import { options } from "@/app/api/auth/[...nextauth]/options";
import { Expense, Friend } from "./datatypes";

function getLastMonday(daysAgo: number = 14) {
    const now = new Date();

    // Setzt die Uhrzeit auf 0 Uhr
    now.setHours(0, 0, 0, 0);

    // Ermittelt den aktuellen Wochentag (0 für Sonntag, 1 für Montag, ... 6 für Samstag)
    const currentDayOfWeek = now.getDay();

    // Ermittelt die Anzahl der Tage, die seit dem letzten Sonntag vergangen sind
    // Wenn heute Sonntag ist, ist der Wert 0, ansonsten addieren wir 1, 
    // um zum vorherigen Sonntag zu gelangen
    const daysSinceLastMonday = (currentDayOfWeek === 1) ? 0 : currentDayOfWeek;

    // Ermittelt die Anzahl der Tage, die zurückgegangen werden müssen, um zwei Wochen 
    // vorherigen Sonntag zu erreichen. Dies umfasst 14 Tage plus die Tage seit dem letzten Sonntag.
    const daysToGoBack = daysAgo + daysSinceLastMonday;

    // Geht die benötigte Anzahl von Tagen zurück
    now.setDate(now.getDate() - daysToGoBack);

    return now;
}

function roundUpToTwoDecimals(num:number) {
    return Math.ceil(num * 100) / 100;
}

// Splitwise Class unsing Singleton Princip
export default class Splitwise {
    private static instance: Splitwise;
    public splitwise: any;

    private constructor() {

    }

    // Asynchrone Initialisierungsmethode
    public async initialize(): Promise<void> {
        // Get Usersession
        const session: Session | null = await getServerSession(options);

        // Stelle sicher, dass eine Session vorhanden ist
        if (!session || !session.user || !session.user.name) {
            throw new Error("No user session found.");
        }

        // Get User from DB
        await connectToDb();
        const user = await User.findOne({ ["username"]: session.user.name });

        // Stelle sicher, dass ein User gefunden wurde
        if (!user || !user.splitwise) {
            throw new Error("No user or splitwise data found.");
        }

        // Get Splitwise Data
        this.splitwise = Sw({
            consumerKey: user.splitwise.consumerKey,
            consumerSecret: user.splitwise.consumerSecret
        });
    }

    public static async getInstance(): Promise<Splitwise> {
        if (!Splitwise.instance) {
            Splitwise.instance = new Splitwise();
            await Splitwise.instance.initialize();
        }
        return Splitwise.instance;
    }
}

export async function getInventedDebts(user_id: number, friend_id: number) {
    const sw = (await Splitwise.getInstance()).splitwise;

    const friend: Friend = await sw.getFriend({ id: friend_id });
    const expenses: Expense[] = await sw.getExpenses({ friend_id: friend.id, dated_after: getLastMonday().toISOString(), limit: 0 });

    // Sum all transactions in last two weeks
    var userInterest = 0;
    expenses.forEach(expense => {
        expense.repayments.forEach(repayment => {

            if (repayment.from === friend.id && repayment.to === user_id) {
                userInterest += Number(repayment.amount);
            }

        });
    });

    // remove debts from last two weeks
    var inventedDebts: number = -1 * userInterest;
    // add general debts
    if (friend.balance[0])
        inventedDebts += Number(friend.balance[0].amount);
    // if he has payed some things in the last two weeks the balance could get less zero
    if (inventedDebts < 0)
        inventedDebts = 0;

    return roundUpToTwoDecimals(inventedDebts);
}
