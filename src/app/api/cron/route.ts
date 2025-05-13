import Account, { IAccount } from "@/models/Account";
import { findInterestsBySplitwiseId } from "@/models/Interests";
import { findSettingBySplitwiseId } from "@/models/Setting";
import User, { IUser } from "@/models/User";
import { createInterests } from "@/services/splitwise";
import { connect } from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { SplitwiseClient } from "splitwise-sdk";
import { components } from "splitwise-sdk/dist/types/openapi-types";

let lastCronRun: Date | null = null;

export async function POST(req: NextRequest) {
  try {
    const authorizationHeader = req.headers.get("Authorization");
    if (!authorizationHeader) {
      console.log("CRON: Unauthorized access attempt (No Authorization header).");
      return NextResponse.json({ status: 401 });
    }

    const [scheme, token] = authorizationHeader.split(" ");

    if (scheme !== "Bearer" || token !== process.env.CRON_SECRET) {
      console.log(`CRON: Unauthorized access attempt (Invalid token).`);
      return NextResponse.json({ status: 401 });
    }

    // Test if last run was to near
    if (lastCronRun != null && lastCronRun.valueOf() + 24 * 60 * 3600 * 1000 > Date.now())
      return NextResponse.json(
        {
          message: `Last run was at ${lastCronRun.toLocaleTimeString()}.`,
        },
        { status: 200 },
      );

    // Update last run
    lastCronRun = new Date();

    // Get User from DB
    await connect();
    const accounts: IAccount[] = await Account.find();
    const createdInterests: components["schemas"]["expense"][] = [];

    // check interests
    for (const account of accounts) {
      const user = ((await User.findById(account.userId)) ?? null) as IUser | null;
      const settings = await findSettingBySplitwiseId(account.providerAccountId);
      const interests = await findInterestsBySplitwiseId(account.providerAccountId);

      if (!user) {
        console.log(`CRON: User mit SplitwiseId ${account.providerAccountId} not found.`);
        continue;
      }

      const hasInterest = interests?.interests.find(
        (interest) => interest.settings.apy > 0 && interest.settings?.nextDate.valueOf() < Date.now(),
      );
      if (hasInterest && interests) {
        if (!settings?.oauth?.consumerKey || !settings?.oauth?.consumerSecret) {
          console.log(`CRON: User ${user.name} has interests but no Splitwise settings.`);
          continue;
        }

        const client = new SplitwiseClient({
          consumerKey: settings.oauth.consumerKey,
          consumerSecret: settings.oauth.consumerSecret,
        });

        console.log(`CRON: User ${user.name} has interests.`);
        createdInterests.push(...(await createInterests(interests, account.providerAccountId, client)));
      } else {
        console.log(`CRON: User ${user.name} has no interests.`);
      }
    }

    return NextResponse.json(
      {
        message: "CRON RUN.",
        interests: createdInterests,
      },
      { status: 201 },
    );
  } catch (err) {
    return NextResponse.json({ message: "Server Error", error: err }, { status: 500 });
  }
}
