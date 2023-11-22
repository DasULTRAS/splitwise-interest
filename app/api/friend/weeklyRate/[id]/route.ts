import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import { connectToDb } from '@/utils/mongodb';
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { Session } from 'next-auth';

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
        const user = await User.findOne({ ["username"]: session.user?.name })

        // Get Data from User
        const id = parseInt(params?.id);
        if (user?.splitwise?.interests && id) {
            const interest = user.splitwise.interests.find((interest: { friend_id: number, weeklyRate: number }) => interest.friend_id === id);

            if (interest) {
                return NextResponse.json(
                    {
                        message: 'Weekly interest Rate successfully fetched.',
                        weeklyRate: interest.weeklyRate
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

        const id = parseInt(params?.id);
        // Get Data from User
        if (user?.splitwise?.interests && id) {
            // Versuchen Sie, das entsprechende Interesse zu finden
            const interest = user.splitwise.interests.find((i: { friend_id: number, weeklyRate: number }) => i.friend_id === id);

            if (interest) {
                // Wenn das Interesse gefunden wurde, aktualisieren Sie es
                interest.weeklyRate = data.weeklyRate;
            } else {
                // Andernfalls fügen Sie ein neues Interesse hinzu
                user.splitwise.interests.push({ friend_id: params.id, weeklyRate: data.weeklyRate });
            }

            user.updatedAt = Date.now();
            user.save();
            return NextResponse.json(
                {
                    message: 'Weekly interest Rate successfully saved.',
                    weeklyRate: data.weeklyRate
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
