import { NextRequest, NextResponse } from 'next/server';
import { connectToDb } from "@/utils/mongodb";
import User, { MongoUser } from "@/models/User";

let lastCronRun: Date | null = null;

export async function GET(req: NextRequest) {
    try {
        const authorizationHeader = req.headers.get('Authorization');
        const token = authorizationHeader?.split(' ')[1];

if (!token || token !== process.env.CRON_SECRET) {
            console.log(`CRON: Unauthorized access attempt${!token && " (Token not offered)"}.`);
            console.log(`${process.env.CRON_SECRET} != ${token}`);
            return NextResponse.json({ status: 401 });
        }

        // Test if last run was to near
        if (lastCronRun != null && lastCronRun.valueOf() > (Date.now() - 23 * 60 * 60000))
            return NextResponse.json(
                {
                    message: `Last run was at ${lastCronRun.toLocaleDateString()}.`,
                },
                { status: 400 });

        // Update last run
        lastCronRun = new Date();

        // Get User from DB
        await connectToDb();
        const users: MongoUser[] = await User.find();

        // check interests
        users.forEach((user) => {
            const hasInterest = user.splitwise.interests.find((interest) => { interest?.weeklyRate > 0 });
            if (hasInterest)
                console.log(`CRON: User ${user.username} has interests.`);
            else
                console.log(`CRON: User ${user.username} has no interests.`);
        })

        return NextResponse.json(
            {
                message: "CRON RUN.",
                users: users
            },
            { status: 200 }
        );

    } catch (err: any) {
        return NextResponse.json(
            { message: 'Server Error', error: err },
            { status: 500 }
        );
    }
}
