"use server";

import { IInterests } from "@/models/Interests";
import { roundUpToTwoDecimals } from "@/utils/splitwise/splitwise";
import { SplitwiseClient } from "splitwise-sdk";
import { CreateExpenseRequest } from "splitwise-sdk/dist/types/api";
import { components } from "splitwise-sdk/dist/types/openapi-types";

export async function createInterests(
  interests: IInterests,
  splitwiseId: number,
  client: SplitwiseClient,
): Promise<components["schemas"]["expense"][]> {
  // Get Splitwise Connection
  const createdInterests: components["schemas"]["expense"][] = [];

  const { friends } = await client.getFriends();
  if (!friends) {
    return [];
  }

  for (const friend of interests.interests) {
    if (friend.settings.apy > 0 && friend.settings.nextDate < new Date()) {
      const splitwiseFriend = friends.find((f) => f.id === friend.friendId);
      if (!splitwiseFriend) {
        continue;
      }

      const settings = friend.settings;
      const latestDate = new Date(
        Date.now() -
        (settings.cycles > settings.minDebtAge ? settings.cycles : settings.minDebtAge) * 24 * 60 * 60 * 1000,
      );
      const { expenses: latestExpenses } = await client.getExpenses({
        friend_id: friend.friendId,
        dated_after: latestDate.toISOString(),
        limit: 50,
      });

      const lastInterest = latestExpenses?.find(
        (expense) =>
          !expense.deleted_at &&
          expense.category?.id === 4 &&
          expense.description.includes("Zins") &&
          expense.repayments.some((repayment) => repayment.from === friend.friendId && repayment.to === splitwiseId),
      );

      if (!lastInterest) {
        // Calculate Sum of Balance
        const balance = Number(splitwiseFriend.balance.find((b) => b.currency_code === "EUR")?.amount) ?? 0;

        const exceptedBalance =
          latestExpenses
            ?.filter(
              (expense) =>
                !expense.deleted_at &&
                Date.parse(expense.date) > Date.now() - settings.minDebtAge * 24 * 60 * 60 * 1000,
            )
            ?.reduce((acc, expense) => {
              const user = expense.users.find((user) => user.user.id === splitwiseId);
              if (user) {
                return acc + Number(user.paid_share) - Number(user.owed_share);
              } else {
                return acc;
              }
            }, 0) ?? 0;

        // const inventedDebt = await getInventedDebts(splitwiseId, friend.friendId, friend.settings.minDebtAge, client);
        const inventedDebt = balance - exceptedBalance;

        if (inventedDebt > friend.settings.minAmount) {
          const interest = roundUpToTwoDecimals(
            inventedDebt * (friend.settings.apy / 100) * (friend.settings.cycles / 365),
          );

          if (interest > 0) {
            const res = await client.createExpense({
              cost: String(interest),
              currency_code: "EUR",
              group_id: 0,

              category_id: 4,

              users__0__owed_share: "0.00",
              users__0__paid_share: interest.toFixed(2),
              users__0__user_id: splitwiseId,
              users__1__owed_share: interest.toFixed(2),
              users__1__paid_share: "0.00",
              users__1__user_id: friend.friendId.toString(),

              date: new Date().toISOString(),

              description: `Zins ${friend.settings.apy}%`,
              details: `Automatically Generated: ${inventedDebt} * ${friend.settings.apy} / 100 * ${friend.settings.cycles} / 365 = ${interest} 
                            \n ${friend.settings.cycles} days between interests 
                            \n Last ${friend.settings.minDebtAge} days not excepted`,
            } as unknown as CreateExpenseRequest);

            if (res?.errors?.base?.length ?? 0 > 0) {
              throw new Error(`Error creating interest for ${friend.friendId}`, { cause: res?.errors?.base?.join(", ") });
            }

            if (res.expenses) {
              res.expenses.forEach((expense) => {
                createdInterests.push(expense);
              });
            }

            friend.settings.nextDate = new Date(Date.now() + friend.settings.cycles * 24 * 60 * 60 * 1000);
          }
        }
      }
    }
  }

  return createdInterests;
}
