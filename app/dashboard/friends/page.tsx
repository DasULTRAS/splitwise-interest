import Splitwise from '@/utils/splitwise/splitwise'
import { Friend } from '@/utils/splitwise/datatypes';

import UnauthorizedPage from '@/components/ui/unauthorised/page';
import FriendCard from "./friendCard";

export default async function FriendsDashboard() {
    try {
        const sw = (await Splitwise.getInstance()).splitwise;

        const friends: Friend[] = await sw.getFriends();

        return (
            <div className="px-10 pb-5">
                <h1 className="text-4xl font-bold text-center m-5">Dashboard - Friends</h1>
                <div className="flex flex-wrap gap-4 justify-center">
                    {
                        friends.map((friend: Friend) => (
                            <FriendCard key={friend.id} friend={friend} />
                        ))
                    }
                </div>
            </div>
        );
    } catch (e) {
        return (<UnauthorizedPage />);
    }
}
