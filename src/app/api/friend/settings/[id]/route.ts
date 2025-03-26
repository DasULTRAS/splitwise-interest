import { auth } from "@/lib/auth";
import Interests, { findInterestsBySplitwiseId, IInterestPair } from "@/models/Interests";
import { connect } from "@/utils/mongodb";
import { checkApy, checkCycles, checkMinDebtAge, checkNextDate } from "@/utils/validation";
import { NextRequest, NextResponse } from "next/server";

export interface Settings {
  apy: number;
  cycles: number;
  minDebtAge: number;
  minAmount: number;
  nextDate: Date;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // DONT DELETE THE REQ STATEMENT params are only in second arguement
  try {
    // Get Usersession
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get User from DB
    await connect();
    const interests =
      (await findInterestsBySplitwiseId(Number(session.user?.id))) ?? new Interests({ id: Number(session.user?.id) });

    // Get Data from User
    const friendId = parseInt((await params).id);
    if (interests?.interests && friendId) {
      const interest = interests.interests.find((interest) => interest.friendId === friendId);

      if (interest) {
        return NextResponse.json(
          {
            message: "Settings successfully fetched.",
            settings: interest.settings,
          },
          { status: 201 },
        );
      }
    }
    return NextResponse.json(
      {
        message: "Not found.",
      },
      { status: 404 },
    );
  } catch (err) {
    return NextResponse.json({ message: "Server Error", error: err }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { settings }: { settings: Settings } = await req.json();

    // Check if settings are valid
    const errors = [];
    if (checkApy(settings.apy)) {
      errors.push(checkApy(settings.apy));
    }
    if (checkCycles(settings.cycles)) {
      errors.push(checkCycles(settings.cycles));
    }
    if (checkMinDebtAge(settings.minDebtAge)) {
      errors.push(checkMinDebtAge(settings.minDebtAge));
    }

    if (settings.nextDate && !(settings.nextDate instanceof Date)) settings.nextDate = new Date(settings.nextDate);
    if (checkNextDate(settings.nextDate)) {
      errors.push(checkNextDate(settings.nextDate));
    }

    if (errors.length > 0) {
      return NextResponse.json({ message: "Invalid Data: ", errors: errors }, { status: 400 });
    }

    // Get Usersession
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get User from DB
    await connect();
    const interests =
      (await findInterestsBySplitwiseId(Number(session.user?.id))) ??
      new Interests({ splitwiseId: Number(session.user?.id) });

    const friendId = parseInt((await params)?.id);

    // Get Data
    let interest = interests.interests.find((i) => i.friendId === friendId);

    if (!interest) {
      interest = {
        friendId: friendId,
        settings: {
          apy: 0,
          cycles: 0,
          minDebtAge: 0,
          minAmount: 0,
          nextDate: new Date(),
        },
      } as IInterestPair;

      interests.interests.push(interest);
    }

    interest.settings.apy = settings.apy;
    interest.settings.cycles = settings.cycles;
    interest.settings.minAmount = settings.minAmount;
    interest.settings.minDebtAge = settings.minDebtAge;
    if (
      !interest?.settings?.nextDate ||
      !(interest.settings.nextDate?.toDateString() === settings.nextDate.toDateString())
    )
      interest.settings.nextDate = settings.nextDate;

    try {
      interests.interests = interests.interests.map((i) => (i.friendId === friendId ? interest : i));
      await interests.save();
    } catch (err: unknown) {
      if (err && err instanceof Error && err?.name === "ValidationError") {
        return NextResponse.json({ message: "Invalid Data: ", error: err.message }, { status: 400 });
      } else return NextResponse.json({ message: "Error saving settings", error: err }, { status: 500 });
    }
    return NextResponse.json(
      {
        message: "Settings successfully saved.",
        settings: interest.settings,
      },
      { status: 201 },
    );
  } catch (err) {
    return NextResponse.json({ message: "Server Error", error: err }, { status: 500 });
  }
}
