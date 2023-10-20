import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import { connectToDb } from '@/utils/mongodb';
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { Session } from 'next-auth';

export async function GET() {
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
        const user = await User.findOne({ ["username"]: session.user?.name })

        // Get Data from User
        if (!user.splitwise.consumerKey || !user.splitwise.consumerSecret)
            return NextResponse.json(
                { message: 'Splitwise Data in User not found.' },
                { status: 403 }
            );

        return NextResponse.json(
            {
                message: 'Splitwise settings successfully fetched.',
                consumerKey: user.splitwise.consumerKey,
                consumerSecret: user.splitwise.consumerSecret
            },
            { status: 201 }
        );
    } catch (err: any) {
        return NextResponse.json(
            { message: 'Server Error', error: err },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        // Get send data
        const data = await req.json();
        if (!data.consumerKey || !data.consumerSecret)
            return NextResponse.json(
                { message: 'Missing data' },
                { status: 400 }
            );

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

        // Update User
        user.splitwise.consumerKey = data.consumerKey;
        user.splitwise.consumerSecret = data.consumerSecret;
        await user.save();

        return NextResponse.json(
            { message: 'Splitwise settings successfully saved!' },
            { status: 201 }
        );
    } catch (err: any) {
        return NextResponse.json(
            { message: 'Server Error', error: err },
            { status: 500 }
        );
    }
}
