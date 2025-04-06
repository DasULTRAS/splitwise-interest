import RateSettingsForm from "@/app/dashboard/friends/[id]/RateSettingsForm";
import PageNotFound from "@/app/not-found";
import WebImage from "@/components/images/WebImage";
import UnauthorizedPage from "@/components/ui/unauthorisedPage";
import { auth } from "@/lib/auth";
import { CustomSession } from "@/lib/auth/config";
import { getInventedDebts } from "@/utils/splitwise/splitwise";
import { SplitwiseClient } from "splitwise-sdk";
import GroupCard from "./GroupCard";

export default async function Friend({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const friend_id = parseInt(id);
  if (isNaN(friend_id)) {
    return <PageNotFound message="Friend not found" />;
  }
  try {
    const session = (await auth()) as CustomSession;

    const accessToken = session?.accessToken;
    if (!session?.user?.id || !accessToken) {
      return <UnauthorizedPage href="/">Please login first.</UnauthorizedPage>;
    }

    const sw = new SplitwiseClient({ accessToken });

    const { friend } = await sw.getFriend(friend_id);
    if (!friend) return <PageNotFound message="Friend not found" />;

    const { user: me } = await sw.getCurrentUser();
    if (!me) return <PageNotFound message="User not found" />;

    // TODO: getInventedDebts() is not working properly
    const inventedDebts = await getInventedDebts(me.id, friend.id, 1, sw);

    // Verwendung einer for...of-Schleife für asynchrone Operationen
    const activeFriendGroups = friend.groups.filter((value) => value.balance && value.balance.length > 0);
    const groups = await Promise.all(
      activeFriendGroups
        .filter((group) => group.group_id !== undefined)
        .map((group) => sw.getGroup(group.group_id as number)),
    );

    return (
      <div className="flex flex-col items-center justify-center px-10 py-5">
        <div className="mb-5 flex items-center justify-center">
          <WebImage
            className="m-5 rounded-full"
            src={friend.picture?.medium ?? "/icons/favicon-light.png"}
            width={75}
          />
          <div className="flex flex-col">
            <p>{friend.id}</p>
            <h1 className="text-center text-4xl font-bold">
              {friend.first_name} {friend?.last_name}
            </h1>
          </div>
        </div>

        {friend.balance && friend.balance.length > 0 ? (
          <>
            <h3 className="font-extralight underline">
              Balance: {friend.balance[0].amount} {friend.balance[0].currency_code}
            </h3>
            <p>
              Currently included debts: {inventedDebts} {friend.balance[0].currency_code}
            </p>

            <div className="my-5 flex flex-col items-center justify-between px-5">
              <RateSettingsForm friend_id={friend.id} />
            </div>

            {activeFriendGroups.length > 0 && (
              <ul key={friend.id} className="flex w-full flex-wrap justify-center">
                {activeFriendGroups.map((i) => {
                  if (!i.balance || !i.group_id) return null;
                  // Sum of all balances in the group
                  const amount = i.balance.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
                  const currency_code = i.balance[0].currency_code;

                  const group = groups.find((g) => g.group?.id === i.group_id)?.group;
                  if (!group) return null;

                  return (
                    <GroupCard
                      key={group.id}
                      id={group.id}
                      balance={{ amount, currency_code }}
                      name={group.name}
                      avatarSrc={group.avatar?.medium}
                    />
                  );
                })}
              </ul>
            )}
          </>
        ) : (
          <h2 className="text-xl font-extralight underline">Balance - 0 EUR</h2>
        )}
      </div>
    );
  } catch (e) {
    throw new Error("Unknown error: in Dashboard", { cause: e });
  }
}
