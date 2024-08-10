import { options } from "@/app/api/auth/[...nextauth]/auth.config";
import User from "@/models/User";
import { createInterests } from "@/services/splitwise";
import { connectToDb } from "@/utils/mongodb";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

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
