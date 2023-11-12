import User from '@/models/User';
import { connectToDb } from '@/utils/mongodb';
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { Session } from 'next-auth';

import Splitwise from '@/utils/splitwise/splitwise'
import { Friend } from '@/utils/splitwise/datatypes';

import UnauthorizedPage from '@/components/ui/unauthorisedPage';
import FriendCard from "@/components/ui/friendCard";

export default async function FriendsDashboard() {
    try {
        // Get Usersession
        const session: Session | null = await getServerSession(options);
        if (!session)
            throw new Error("Not logged in");

        // Get User from DB
        await connectToDb();
        const user = await User.findOne({ ["username"]: session.user?.name })

        if (!user.splitwise.id)
            throw new Error("Splitwise not connected");

        const sw = (await Splitwise.getInstance()).splitwise;
        const friends: Friend[] = await sw.getFriends();

        // Sort friends by name
        friends.sort((a, b) => a.first_name.localeCompare(b.first_name));

        const getWeeklyRate = function (id: number) {
            const interest = user.splitwise.interests.find((interest: {
                friend_id: number,
                weeklyRate: number
            }) => interest.friend_id === id)
            if (interest?.weeklyRate)
                return interest.weeklyRate;
            else return null;
        }

        return (
            <div className="px-10 pb-5">
                <h1 className="m-5 text-center text-4xl font-bold">Dashboard - Friends</h1>
                <div className="flex flex-wrap justify-center gap-4">
                    {
                        friends.map((friend: Friend) => (
                            <FriendCard key={friend.id} friend={friend} weeklyRate={getWeeklyRate(friend.id)} />
                        ))
                    }
                </div>
            </div>
        );
        
    } catch (e) {
        if (e instanceof Error) {
            if (e.message === "Not logged in")
                return (<UnauthorizedPage />);
            else if (e.message === "Splitwise not connected")
                return (<UnauthorizedPage
                    href='/settings/splitwise'>Please click <b>here</b> to set up your Splitwise connection first.</UnauthorizedPage>);
            else if (e.message === "getFriends - getFriends - authentication failed - client error") {
                return (<UnauthorizedPage
                    href='/settings/splitwise'>Please click <b>here</b> correct your Splitwise credentials first.</UnauthorizedPage>);
            }
        }
        throw new Error("Unknown error: in Dashboard", { cause: e });
    }
}
