import { auth } from "@/lib/auth";
import { CustomSession } from "@/lib/auth/config";
import { findAccountByProviderAccountId } from "@/models/Account";
import { findInterestsBySplitwiseId } from "@/models/Interests";
import { createInterests } from "@/services/splitwise";
import { connect } from "@/utils/mongodb";
import { NextResponse } from "next/server";
import { SplitwiseClient } from "splitwise-sdk";

export async function POST() {
  try {
    // Get Usersession
    const session = (await auth()) as CustomSession;

    if (!session?.user?.id || isNaN(Number(session.user.id))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get User from DB
    await connect();
    const account = await findAccountByProviderAccountId(Number(session.user.id));
    if (!account) {
      return NextResponse.json({ message: "Account not found." }, { status: 404 });
    }
    const interests = await findInterestsBySplitwiseId(account.providerAccountId);

    const client = new SplitwiseClient({
      accessToken: session.accessToken,
    });

    const createdInterests = await createInterests(interests, account.providerAccountId, client);
    return NextResponse.json(
      { message: "Interest created", interests: createdInterests },
      { status: createdInterests.length > 0 ? 201 : 200 },
    );
  } catch (err) {
    return NextResponse.json({ message: "Server Error", error: err }, { status: 500 });
  }
}
