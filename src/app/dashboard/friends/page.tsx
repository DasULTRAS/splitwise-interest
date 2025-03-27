import FriendCard from "@/components/ui/friendCard";
import UnauthorizedPage from "@/components/ui/unauthorisedPage";
import { auth } from "@/lib/auth";
import { CustomSession } from "@/lib/auth/config";
import { IInterests, findInterestsBySplitwiseId } from "@/models/Interests";
import { SplitwiseClient } from "splitwise-sdk";

export default async function FriendsDashboard() {
  const session = (await auth()) as CustomSession;

  if (!session?.user?.id || !session.accessToken) {
    return <UnauthorizedPage href="/">Please login first.</UnauthorizedPage>;
  }

  const splitwise = new SplitwiseClient({
    accessToken: session.accessToken,
  });

  function getAPY(friendId: number, interests: IInterests) {
    const interest = interests?.interests.find((interest) => interest.friendId === friendId);

    if (interest?.settings?.apy) return interest.settings.apy;
    else return 0;
  }

  const interests = await findInterestsBySplitwiseId(Number.parseInt(session.user.id));
  const friends = (await splitwise.getFriends()).friends?.sort((a, b) =>
    (a.first_name || "").localeCompare(b.first_name || ""),
  );

  return (
    <div className="px-10 pb-5">
      <h1 className="m-5 text-center text-4xl font-bold">Dashboard - Friends</h1>
      <div className="flex flex-wrap justify-center gap-4">
        {friends?.map((friend) => {
          if (friend.id === 0 || !friend.id) return null;
          return <FriendCard key={friend.id} friend={friend} apy={interests ? getAPY(friend.id, interests) : 0} />;
        })}
      </div>
    </div>
  );
}
