import FriendCard from "@/components/ui/friendCard";
import UnauthorizedPage from "@/components/ui/unauthorisedPage";
import { auth } from "@/lib/auth";
import { CustomSession } from "@/lib/auth/config";
import { getInterests } from "@/services/interests";
import { SplitwiseClient } from "splitwise-sdk";

export default async function FriendsDashboard() {
  const session = (await auth()) as CustomSession;

  if (!session?.user?.id || !session.accessToken) {
    return <UnauthorizedPage href="/">Please login first.</UnauthorizedPage>;
  }

  const splitwise = new SplitwiseClient({
    accessToken: session.accessToken,
  });

  async function fetchFriends() {
    if (!splitwise) return [];
    try {
      const res = await splitwise.getFriends();

      const friends = res?.friends;

      if (!friends) return [];

      friends.sort((a, b) => (a.first_name || "").localeCompare(b.first_name || ""));
      return friends;
    } catch (e) {
      console.error("Error fetching friends", e);
    }
  }

  function getAPY(friendId: number) {
    const interest = interests?.interests.find((interest) => interest.friendId === friendId);
    if (interest?.settings?.apy) return interest.settings.apy;
    else return null;
  }

  const interestsPromise = getInterests();
  const friendsPromise = fetchFriends();

  const [interests, friends] = await Promise.all([interestsPromise, friendsPromise]);

  return (
    <div className="px-10 pb-5">
      <h1 className="m-5 text-center text-4xl font-bold">Dashboard - Friends</h1>
      <div className="flex flex-wrap justify-center gap-4">
        {friends?.map((friend) => {
          if (friend.id === 0 || !friend.id) return null;
          return <FriendCard key={friend.id} friend={friend} apy={getAPY(friend.id)} />;
        })}
      </div>
    </div>
  );
}
