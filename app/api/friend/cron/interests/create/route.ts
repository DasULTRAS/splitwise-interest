import { NextResponse } from 'next/server';
import User from '@/models/User';
import { connectToDb } from '@/utils/mongodb';
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { Session } from 'next-auth';
import Splitwise, { getLastMonday, getInventedDebts, roundUpToTwoDecimals } from '@/utils/splitwise/splitwise'
import { Expense } from '@/utils/splitwise/datatypes';

export async function GET() {
    try {
        // Get Usersession
        const session: Session | null = await getServerSession(options);
        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get User from DB
        await connectToDb();
        const user = await User.findOne({ ["username"]: session.user?.name })

        // Get Splitwise Connection
        const sw = (await Splitwise.getInstance()).splitwise;
        const interests = [];

        for (const friend of user?.splitwise?.interests) {
            if (friend.weeklyRate > 0) {
                const expenses: Expense[] = await sw.getExpenses({ friend_id: friend.id, dated_after: getLastMonday(0).toISOString(), limit: 0 });

                let lastInterest: Expense | undefined = undefined;
                expenses.forEach((expense: Expense) => {
                    if (!expense.deleted_at && expense.category.id === 4 && expense.description.includes("Zins"))
                        expense.repayments.forEach(repayment => {
                            if (repayment.from === friend.friend_id && repayment.to === user.splitwise.id) {
                                lastInterest = expense;
                            }
                        });
                })

                if (!lastInterest) {

                    const inventedDebt = await getInventedDebts(user.splitwise.id, friend.friend_id);
                    const interest = roundUpToTwoDecimals(inventedDebt * friend.weeklyRate / 100);

                    const res = await sw.createExpense({
                        cost: interest,
                        description: `Weekly Zins ${friend.weeklyRate}%`,
                        group_id: 0,
                        split_equally: false,
                        category_id: 4,
                        details: `Automatically Generated: ${inventedDebt} * ${friend.weeklyRate} / 100 = ${interest}`,
                        repeat_interval: "never",
                        users: [
                            {
                                user_id: user.splitwise.id,
                                paid_share: `${interest}`,
                                owed_share: '0.00',
                            },
                            {
                                user_id: friend.friend_id,
                                paid_share: '0.00',
                                owed_share: `${interest}`,
                            }
                        ],
                    });
                    interests.push(res);
                }
            }
        }

        if (interests.length > 0)
            return NextResponse.json(
                {
                    message: "New Interests Created.",
                    interests: interests
                },
                { status: 201 }
            );
        else
            return NextResponse.json(
                {
                    message: "No new Interests Created.",
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
