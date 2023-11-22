import {getServerSession} from "next-auth/next";
import {Session} from 'next-auth';

import User from '@/models/User';
import {connectToDb} from '@/utils/mongodb';
import {options} from "@/app/api/auth/[...nextauth]/options";
import {Expense, Friend} from "./datatypes";

const Sw = require('splitwise');

async function getUsername() {
    // Get Usersession
    const session: Session | null = await getServerSession(options);

    // Stelle sicher, dass eine Session vorhanden ist
    if (!session || !session.user || !session.user.name) {
        throw new Error("No user session found.");
    }

    return session.user.name;
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
    private static instances: { [key: string]: Splitwise } = {};
    public splitwise: any;

    private constructor() {}

    public static async resetInstance() {
        const username: string = await getUsername();

        await Splitwise.resetInstanceByUsername(username);
    }

    public static async resetInstanceByUsername(username: string) {
        // Called at signOut Event
        delete Splitwise.instances[username];
    }

    // Asynchrone Initialisierungsmethode
    public async initialize(username: string): Promise<void> {
        // Get User from DB
        await connectToDb();
        const user = await User.findOne({["username"]: username});

        // Stelle sicher, dass ein User gefunden wurde
        if (!user || !user.splitwise) {
            throw new Error("No user or splitwise data found.");
        }

        // Get Splitwise Data
        this.splitwise = Sw({
            consumerKey: user.splitwise.consumerKey,
            consumerSecret: user.splitwise.consumerSecret,
        });
    }

    public static async getInstanceByUsername(
        username: string
    ): Promise<Splitwise> {
        if (!Splitwise.instances[username]) {
            Splitwise.instances[username] = new Splitwise();
            await Splitwise.instances[username].initialize(username);
        }
        return Splitwise.instances[username];
    }

    public static async getInstance(): Promise<Splitwise> {
        const username = await getUsername();

        return await this.getInstanceByUsername(username);
    }
}

export async function getInventedDebts(
    user_id: number,
    friend_id: number,
    splitwise?: any
) {
    if (!splitwise) splitwise = (await Splitwise.getInstance()).splitwise;

    const friend: Friend = await splitwise.getFriend({id: friend_id});
    const expenses: Expense[] = await splitwise.getExpenses({
        friend_id: friend.id,
        dated_after: getLastMonday().toISOString(),
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
