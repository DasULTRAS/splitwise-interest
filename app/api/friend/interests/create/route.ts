import { options } from "@/app/api/auth/[...nextauth]/auth.config";
import User from "@/models/User";
import { connectToDb } from "@/utils/mongodb";
import { Expense } from "@/utils/splitwise/datatypes";
import Splitwise, { getInventedDebts, roundUpToTwoDecimals } from "@/utils/splitwise/splitwise";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function createInterests(user: any) {
  // Get Splitwise Connection
  const sw = (await Splitwise.getInstanceByUsername(user.username)).splitwise;
  const interests = [];

  for (const friend of user?.splitwise?.interests) {
    if (friend.settings.apy > 0 && friend.settings.nextDate < new Date()) {
      const lastExceptedDay = new Date(Date.now() - friend.settings.cycles * 24 * 60 * 60 * 1000);
      const expenses: Expense[] = await sw.getExpenses({
        friend_id: friend.friend_id,
        dated_after: lastExceptedDay.toISOString(),
        limit: 0,
      });

      let lastInterest: Expense | undefined = undefined;
      expenses.forEach((expense: Expense) => {
        if (!expense.deleted_at && expense.category?.id === 4 && expense.description.includes("Zins"))
          expense.repayments.forEach((repayment) => {
            if (repayment.from === friend.friend_id && repayment.to === user.splitwise.id) {
              lastInterest = expense;
            }
          });
      });

      if (!lastInterest) {
        const inventedDebt = await getInventedDebts(
          user.splitwise.id,
          friend.friend_id,
          friend.settings.minDebtAge,
          sw,
        );
        if (inventedDebt > friend.settings.minAmount) {
          const interest = roundUpToTwoDecimals(
            (((inventedDebt * friend.settings.apy) / 100) * friend.settings.cycles) / 365,
          );

          if (interest > 0) {
            const res = await sw.createExpense({
              cost: interest,
              description: `Zins ${friend.settings.apy}%`,
              group_id: 0,
              split_equally: false,
              category_id: 4,
              details: `Automatically Generated: ${inventedDebt} * ${friend.settings.apy} / 100 * ${friend.settings.cycles} / 365 = ${interest} 
                        \n ${friend.settings.cycles} days between interests 
                        \n ${lastExceptedDay.toLocaleDateString()} last excepted day`,
              repeat_interval: "never",
              users: [
                {
                  user_id: user.splitwise.id,
                  paid_share: `${interest}`,
                  owed_share: "0.00",
                },
                {
                  user_id: friend.friend_id,
                  paid_share: "0.00",
                  owed_share: `${interest}`,
                },
              ],
            });
            interests.push(res);

            friend.settings.nextDate = new Date(Date.now() + friend.settings.cycles * 24 * 60 * 60 * 1000);
          }
        }
      }
    }
  }

  if (interests.length > 0) {
    await user.save();
    return NextResponse.json(
      {
        message: `${user.username} has charged new interest.`,
        interests: interests,
        username: user.username,
        splitwise: user.splitwise,
      },
      { status: 201 },
    );
  } else
    return NextResponse.json(
      {
        message: "No new interest charged.",
        username: user.username,
        splitwise: user.splitwise,
      },
      { status: 200 },
    );
}

export async function GET() {
  try {
    // Get Usersession
    const session: Session | null = await getServerSession(options);
    if (!session?.user?.name) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get User from DB
    await connectToDb();
    const user = await User.findOne({ ["username"]: session.user.name });

    return await createInterests(user);
  } catch (err: any) {
    return NextResponse.json({ message: "Server Error", error: err }, { status: 500 });
  }
}
