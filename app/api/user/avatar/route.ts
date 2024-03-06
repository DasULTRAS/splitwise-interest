import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import { connectToDb } from '@/utils/mongodb';
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { Session } from 'next-auth';
import { getAvatar } from '@/utils/splitwise/splitwise';

export async function GET() {
    try {
        // Get User session
        const session: Session | null = await getServerSession(options);
        if (!session || !session.user?.name) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const avatar = await getAvatar(session.user.name);

        if (!avatar)
            return NextResponse.json(
                { message: "Avatar in User Object not found." },
                { status: 404 }
            );

        return NextResponse.json(
            { avatar: avatar },
            { status: 201 }
        );
    } catch (err: any) {
        return NextResponse.json(
            { message: 'Server Error', error: err },
            { status: 500 }
        );
    }
}

interface Data {
    avatar: File,
}

export async function POST(req: NextRequest) {

    try {
        // Get send data
        const data: Data = await req.json();

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

        user.avatar = data.avatar;
        user.updatedAt = Date.now();
        await user.save();

        return NextResponse.json(
            { message: 'Avatar successfully saved!' },
            { status: 201 }
        );
    } catch (err: any) {
        return NextResponse.json(
            { message: 'Server Error', error: err },
            { status: 500 }
        );
    }
}
