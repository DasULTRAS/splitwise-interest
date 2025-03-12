import FriendCard from "@/components/ui/friendCard";
import UnauthorizedPage from "@/components/ui/unauthorisedPage";
import { auth } from "@/lib/auth";
import Interests, { IInterests } from "@/models/Interests";
import { connect } from "@/utils/mongodb";
import { Friend } from "@/utils/splitwise/datatypes";
import Splitwise from "@/utils/splitwise/splitwise";

export default async function FriendsDashboard() {
  const session = await auth();

  if (!session) {
    return <UnauthorizedPage />;
  }

  try {
    // Get User from DB
    await connect();
    const interests: IInterests =
      (await Interests.findOne({ ["id"]: session.user?.id })) ??
      new Interests({
        id: Number(session.user?.id),
        splitwise: {
          interests: [],
        },
      });

    const sw = (await Splitwise.getInstanceById(String(interests.id))).splitwise;
    const friends: Friend[] = await sw.getFriends();

    // Sort friends by name
    friends.sort((a, b) => a.first_name.localeCompare(b.first_name));

    const getAPY = function (friendId: number) {
      const interest = interests.interests.find((interest) => interest.friendId === friendId);
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
