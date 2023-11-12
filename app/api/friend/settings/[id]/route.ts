import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import { connectToDb } from '@/utils/mongodb';
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { Session } from 'next-auth';
import { checkApy, checkCycles, checkMinDebtAge, checkNextDate } from '@/utils/validation';

export interface Settings {
    apy: number,
    cycles: number,
    minDebtAge: number,
    nextDate: Date
};

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    // DONT DELETE THE REQ STATEMENT params are only in second arguement
    try {
        // Get Usersession
        const session: Session | null = await getServerSession(options);
        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get User from DB
        await connectToDb();
        const user = await User.findOne({ ["username"]: session.user?.name });

        // Get Data from User
        const id = parseInt(params?.id);
        if (user?.splitwise?.interests && id) {
            const interest = user.splitwise.interests.find((interest: { friend_id: number, settings: Settings }) => interest.friend_id === id);

            if (interest) {
                return NextResponse.json(
                    {
                        message: 'Settings successfully fetched.',
                        settings: interest.settings,
                    },
                    { status: 201 }
                );
            }
        }

        return NextResponse.json(
            {
                message: 'Weekly Rate not defined.'
            },
            { status: 404 }
        );
    } catch (err: any) {
        return NextResponse.json(
            { message: 'Server Error', error: err },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { settings }: { settings: Settings } = await req.json();

        // Check if settings are valid
        let errors = [];
        if (checkApy(settings.apy)) {
            errors.push(checkApy(settings.apy));
        }
        if (checkCycles(settings.cycles)) {
            errors.push(checkCycles(settings.cycles));
        }
        if (checkMinDebtAge(settings.minDebtAge)) {
            errors.push(checkMinDebtAge(settings.minDebtAge));
        }

        if (settings.nextDate && !(settings.nextDate instanceof Date))
            settings.nextDate = new Date(settings.nextDate);
        if (checkNextDate(settings.nextDate)) {
            errors.push(checkNextDate(settings.nextDate));
        }

        if (errors.length > 0) {
            return NextResponse.json(
                { message: 'Invalid Data: ', errors: errors },
                { status: 400 }
            );
        }

        // Get Usersession
        const session: Session | null = await getServerSession(options);
        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get User from DB
        await connectToDb();
        const user = await User.findOne({ ["username"]: session.user?.name })

        const id = parseInt(params?.id);

        // Get Data from User
        if (user?.splitwise?.interests && id) {
            let interest = user.splitwise.interests.find((i: { friend_id: number, settings: Settings }) => i.friend_id === id);

            if (!interest) {
                user.splitwise.interests.push({ friend_id: params.id, settings: {} });
                interest = user.splitwise.interests.find((i: { friend_id: number, settings: Settings }) => i.friend_id === id);
            }


            interest.settings.apy = settings.apy;
            interest.settings.cycles = settings.cycles;
            interest.settings.minDebtAge = settings.minDebtAge;

            if (!interest?.settings?.newDate || !interest.settings?.nextDate?.toDateString()?.localeCompare(settings.nextDate.toDateString()))
                interest.settings.nextDate = settings.nextDate;

            user.updatedAt = Date.now();
            user.save();
            return NextResponse.json(
                {
                    message: 'Settings successfully saved.',
                    settings: interest.settings,
                },
                { status: 201 }
            );
        } else {
            return NextResponse.json(
                {
                    message: 'Splitwise Settings not found.'
                },
                { status: 404 }
            );
        }
    } catch (err: any) {
        return NextResponse.json(
            { message: 'Server Error', error: err },
            { status: 500 }
        );
    }
}
