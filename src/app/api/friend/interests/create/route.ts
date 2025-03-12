import { auth } from "@/lib/auth";
import User from "@/models/User";
import { createInterests } from "@/services/splitwise";
import { connect } from "@/utils/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get Usersession
    const session = await auth();

    if (!session?.user?.name) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get User from DB
    await connect();
    const user = await User.findOne({ ["username"]: session.user.name });

    return await createInterests(user);
  } catch (err: any) {
    return NextResponse.json({ message: "Server Error", error: err }, { status: 500 });
  }
}
