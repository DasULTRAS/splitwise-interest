import {getServerSession} from "next-auth/next";
import {Session} from 'next-auth';

const Splitwise = require('splitwise');
import {Expense, Friend} from '@/utils/splitwise/datatypes';

import User from '@/models/User';
import {connectToDb} from '@/utils/mongodb';
import {options} from "@/app/api/auth/[...nextauth]/options";
import UnauthorizedPage from '@/components/ui/unauthorised/page';
import FriendCard from "./FriendCard";

export default async function Dashboard() {
    // Get Usersession
    const session: Session | null = await getServerSession(options);
    if (!session) {
        return (<UnauthorizedPage/>)
    }

    // Get User from DB
    await connectToDb();
    const user = await User.findOne({["username"]: session.user?.name})

    // Check if User and atributes exists
    if (!user || !user.splitwise || !user.splitwise.consumerKey || !user.splitwise.consumerSecret)
        return (<UnauthorizedPage href={"/settings/splitwise"}
                                  anchorText={"Your Splitwise Credentials are not set up, make it here."}/>)

    // Get Splitwise Data
    const sw = Splitwise({
        consumerKey: user.splitwise.consumerKey,
        consumerSecret: user.splitwise.consumerSecret
    });

    const friends: Friend[] = await sw.getFriends();

    return (
        <div className="px-10">
            <h1 className="text-4xl font-bold text-center m-5">Dashboard - Friends</h1>
            <div className="flex flex-wrap gap-4 justify-center">
                {
                    friends.map((friend: Friend) => (
                        <FriendCard key={friend.id} friend={friend} />
                    ))
                }
            </div>
        </div>
    )
}
