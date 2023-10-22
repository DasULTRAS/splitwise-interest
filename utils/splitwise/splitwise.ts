import { getServerSession } from "next-auth/next";
import { Session } from 'next-auth';
const Sw = require('splitwise');
import User from '@/models/User';
import { connectToDb } from '@/utils/mongodb';
import { options } from "@/app/api/auth/[...nextauth]/options";

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
