import { options } from "@/app/api/auth/[...nextauth]/options";
import User from "@/models/User";
import { saltRounds } from "@/utils/constants";
import { connectToDb } from "@/utils/mongodb";
import { checkPassword } from "@/utils/validation";
import bcrypt from "bcrypt";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

interface Data {
  password: string;
}

export async function POST(req: NextRequest) {
  const data = (await req.json()) as Data;
  if (!data?.password)
    return NextResponse.json(
      { message: "Invalid data!", errors: { password: "Password is required." } },
      { status: 400 },
    );

  const password = data.password;

  // Check if the input data is valid
  let errors: { password?: string } = {};
  errors.password = checkPassword(password);

  if (errors.password) {
    return NextResponse.json({ message: "Password is not acceptable!", errors: errors }, { status: 400 });
  }

  try {
    // Get User session
    const session: Session | null = await getServerSession(options);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get User from DB
    await connectToDb();
    const user = await User.findOne({ ["username"]: session.user?.name });

    // Hash the password
    const hashedPassword: string = await bcrypt.hash(password, saltRounds);

    user.password = hashedPassword;

    // Save the new user
    user.updatedAt = Date.now();
    user.lastPasswordUpdatedAt = Date.now();
    await user.save();

    return NextResponse.json({ message: "Password successfully saved!" }, { status: 201 });
  } catch (err: any) {
    console.error("Error while registering user: " + err);
    return NextResponse.json({ message: "Server Error", error: err }, { status: 500 });
  }
}
