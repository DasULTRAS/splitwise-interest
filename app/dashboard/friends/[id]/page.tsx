import { Friend, Group} from '@/utils/splitwise/datatypes';
import Splitwise from '@/utils/splitwise/splitwise';

import UnauthorizedPage from '@/components/ui/unauthorised/page';
import WebImage from "@/components/ui/WebImage";

export default async function Friend({ params }: { params: { id: string } }) {
    try {
        const sw = (await Splitwise.getInstance()).splitwise;

        const friend: Friend = await sw.getFriend({ id: params.id });
        var groups: Group[] = [];

        // Verwendung einer for...of-Schleife für asynchrone Operationen
        for (let group of friend.groups) {
            if (group.balance.length > 0) {
                const newGroup = await sw.getGroup({ id: group.group_id });
                groups.push(newGroup);
            }
        }

        return (
            <>
                <div className="flex flex-col justify-center items-center p-10">
                    <div className="flex justify-center items-center m-5">
                        <WebImage className="rounded-full m-5" src={friend.picture.medium} width={75} />
                        <div className="flex flex-col">
                            <p>{friend.id}</p>
                            <h1 className="text-4xl font-bold text-center">{friend.first_name} {friend?.last_name}</h1>
                        </div>
                    </div>

                    <hr />

                    {
                        friend.balance.length > 0 ?
                            <>
                                <h2 className="text-xl font-extralight underline">Balance - {friend.balance[0].amount} {friend.balance[0].currency_code}</h2>
                                <ul>
                                    {groups.map((group: Group) => (
                                        <li key={group.id} className="flex flex-col bg-black/20 rounded-2xl m-2 p-2">
                                            <div className="flex">
                                                <WebImage src={group.avatar.medium} className="rounded-full" width={25} />
                                                {(() => {
                                                    const foundGroup = friend.groups.find(friendGroup => friendGroup.group_id === group.id);
                                                    const bal = foundGroup?.balance[0];
                                                    return bal ? <p className="ml-auto">{bal.amount} {bal.currency_code}</p> : <p>Not Found</p>;
                                                })()}
                                            </div>

                                            <h3 className="truncate whitespace-nowrap overflow-hidden font-mono">{group.name}</h3>

                                            <div className="flex flex-col items-center">
                                                {
                                                    group.original_debts.map((originalDebt: Debt) => {
                                                        if (originalDebt.from === friend.id) {
                                                            return (<p key={`${friend.id}-${group.id}-${originalDebt.from}-${originalDebt.to}`}
                                                                className="text-green-500"
                                                            >{originalDebt.amount} {originalDebt.currency_code}</p>);
                                                        } else if (originalDebt.to === friend.id) {
                                                            return (<p key={`${friend.id}-${group.id}-${originalDebt.from}-${originalDebt.to}`}
                                                                className="text-red-500"
                                                            >{originalDebt.amount} {originalDebt.currency_code}</p>);
                                                        }
                                                        return null; // Geben Sie null zurück, wenn keine der Bedingungen erfüllt ist.
                                                    })
                                                }
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </>
                            : <h2>No interests.</h2>
                    }
                </div>
            </>
        );
    } catch(e) {
        return <UnauthorizedPage />
    }
}
