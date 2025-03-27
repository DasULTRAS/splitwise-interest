import { auth } from "@/lib/auth";
import Setting, { findSettingBySplitwiseId, ISetting } from "@/models/Setting";
import { connect } from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { SplitwiseClient } from "splitwise-sdk";

export async function GET() {
  try {
    // Get Usersession
    const session = await auth();
    if (!session || !session?.user?.id || isNaN(Number(session.user.id))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get User from DB
    await connect();
    const setting = await findSettingBySplitwiseId(Number(session.user?.id));

    // Get Data from User
    if (!setting?.oauth?.consumerKey || !setting?.oauth?.consumerSecret)
      return NextResponse.json({ message: "Splitwise Data in User not found." }, { status: 404 });

    return NextResponse.json(
      {
        message: "Splitwise settings successfully fetched.",
        ...setting.oauth,
      },
      { status: 201 },
    );
  } catch (err: unknown) {
    return NextResponse.json({ message: "Server Error", error: err }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Get send data
    const data = await req.json();
    if (!data.consumerKey || !data.consumerSecret)
      return NextResponse.json({ message: "Missing data" }, { status: 400 });

    // Get Usersession
    const session = await auth();
    if (!session?.user?.id || isNaN(Number(session.user.id))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get User from DB
    await connect();
    const setting =
      (await findSettingBySplitwiseId(Number(session.user?.id))) ??
      (new Setting({
        splitwiseId: Number(session.user?.id),
        oauth: {
          consumerKey: "",
          consumerSecret: "",
        },
      }) as ISetting);

    // Test connection
    try {
      setting.oauth.consumerKey = data.consumerKey;
      setting.oauth.consumerSecret = data.consumerSecret;

      const sw = new SplitwiseClient({ consumerKey: data.consumerKey, consumerSecret: data.consumerSecret });
      await sw.getCurrentUser();

      await setting.save();

      return NextResponse.json({ message: "Splitwise settings successfully saved!" }, { status: 201 });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return NextResponse.json({ message: "Splitwise Credentials are not correct." }, { status: 406 });
    }
  } catch (err) {
    return NextResponse.json({ message: "Server Error", error: err }, { status: 500 });
  }
}
