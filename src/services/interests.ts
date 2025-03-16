"use server";

import { auth } from "@/lib/auth";
import Interests, { IInterests } from "@/models/Interests";
import { connect } from "@/utils/mongodb";

export async function getInterests(): Promise<IInterests> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Get User from DB
  await connect();

  let interests: IInterests | null | undefined = await Interests.findOne({ ["id"]: session?.user?.id });

  if (!interests) {
    interests = new Interests({
      id: Number(session.user?.id),
      splitwise: {
        interests: [],
      },
    });
    interests?.save();
    if (!interests) throw new Error("Could not create interests");
    return interests;
  } else return interests;
}
