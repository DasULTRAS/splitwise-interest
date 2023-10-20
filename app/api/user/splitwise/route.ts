import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import { connectToDb } from '@/utils/mongodb';
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { Session } from 'next-auth';

export async function POST(req: NextRequest) {
    try {
        // Get send data
        const data = await req.json();

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
