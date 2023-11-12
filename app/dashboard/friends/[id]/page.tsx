import { Friend, Group, User } from '@/utils/splitwise/datatypes';
import Splitwise, { getInventedDebts } from '@/utils/splitwise/splitwise';

import UnauthorizedPage from '@/components/ui/unauthorisedPage';
import WebImage from "@/components/images/WebImage";
import WeeklyRateForm from "@/app/dashboard/friends/[id]/RateSettingsForm";

export default async function Friend({ params }: { params: { id: number } }) {
    try {
        const sw = (await Splitwise.getInstance()).splitwise;

        const friend: Friend = await sw.getFriend({ id: params.id });
        const me: User = await sw.getCurrentUser();
        const groups: Group[] = [];

        // Verwendung einer for...of-Schleife für asynchrone Operationen
        for (const group of friend.groups) {
            if (group.balance.length > 0) {
                const newGroup = await sw.getGroup({ id: group.group_id });
                groups.push(newGroup);
            }
        }

        const inventedDebts = await getInventedDebts(me.id, friend.id);

        return (
            <div className="flex flex-col items-center justify-center px-10 py-5">
                <div className="flex mb-5 items-center justify-center">
                    <WebImage className="m-5 rounded-full" src={friend.picture.medium} width={75} />
                    <div className="flex flex-col">
                        <p>{friend.id}</p>
                        <h1 className="text-center text-4xl font-bold">{friend.first_name} {friend?.last_name}</h1>
                    </div>
                </div>

                {
                    friend.balance.length > 0 ?
                        <>
                            <h3 className="font-extralight underline">
                                Balance - {friend.balance[0].amount} {friend.balance[0].currency_code}</h3>
                            <p>Currently included debts: {inventedDebts} {friend.balance[0].currency_code}</p>

                            <div className="my-5 flex flex-col items-center justify-between px-5">
                                <WeeklyRateForm friend_id={friend.id} />
                            </div>

                            <ul>
                                {groups.map((group: Group) => (
                                    <li key={group.id} className="m-2 flex flex-col rounded-2xl bg-black/20 p-2">
                                        <div className="flex">
                                            <WebImage src={group.avatar.medium} className="rounded-full"
                                                width={25} />
                                            {(() => {
                                                const foundGroup = friend.groups.find(friendGroup => friendGroup.group_id === group.id);
                                                const bal = foundGroup?.balance[0];
                                                return bal ?
                                                    <p className="ml-auto">{bal.amount} {bal.currency_code}</p> :
                                                    <p>Not Found</p>;
                                            })()}
                                        </div>

                                        <b className="overflow-hidden truncate whitespace-nowrap font-mono">{group.name}</b>
                                    </li>
                                ))}
                            </ul>
                        </>
                        : <h2 className="text-xl font-extralight underline">Balance - 0 EUR</h2>
                }
            </div>
        );

    } catch (e) {
        if (e instanceof Error) {
            if (e.message === "getFriends - getFriends - authentication failed - client error") {
                return (<UnauthorizedPage
                    href='/settings/splitwise'>Please click <b>here</b> correct your Splitwise credentials first.</UnauthorizedPage>);
            }
        }
        throw new Error("Unknown error: in Dashboard", { cause: e });
    }
}
