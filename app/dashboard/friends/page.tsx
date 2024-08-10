import { options } from "@/app/api/auth/[...nextauth]/options";
import FriendCard from "@/components/ui/friendCard";
import UnauthorizedPage from "@/components/ui/unauthorisedPage";
import User from "@/models/User";
import { connectToDb } from "@/utils/mongodb";
import { Friend } from "@/utils/splitwise/datatypes";
import Splitwise from "@/utils/splitwise/splitwise";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";

export default async function FriendsDashboard() {
  // Get Usersession
  // TODO: Darf nicht im try catch sein?
  const session: Session | null = await getServerSession(options);
  if (!session) return <UnauthorizedPage />;

  try {
    // Get User from DB
    await connectToDb();
    const user = await User.findOne({ ["username"]: session.user?.name });

    if (!user.splitwise.id)
      return (
        <UnauthorizedPage href="/settings/splitwise">
          Please click <b>here</b> to set up your Splitwise connection first.
        </UnauthorizedPage>
      );

    const sw = (await Splitwise.getInstance()).splitwise;
    const friends: Friend[] = await sw.getFriends();

    // Sort friends by name
    friends.sort((a, b) => a.first_name.localeCompare(b.first_name));

    const getAPY = function (id: number) {
      const interest = user.splitwise.interests.find(
        (interest: { friend_id: number; apy: number }) => interest.friend_id === id,
      );
      if (interest?.settings?.apy) return interest.settings.apy;
      else return null;
    };

    return (
      <div className="px-10 pb-5">
        <h1 className="m-5 text-center text-4xl font-bold">Dashboard - Friends</h1>
        <div className="flex flex-wrap justify-center gap-4">
          {friends.map((friend: Friend) => (
            <FriendCard key={friend.id} friend={friend} apy={getAPY(friend.id)} />
          ))}
        </div>
      </div>
    );
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "getFriends - getFriends - authentication failed - client error") {
        return (
          <UnauthorizedPage href="/settings/splitwise">
            Please click <b>here</b> correct your Splitwise credentials first.
          </UnauthorizedPage>
        );
      }
    }
    throw new Error("Unknown error: in Dashboard", { cause: e });
  }
}
