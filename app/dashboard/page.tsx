import {getServerSession} from "next-auth/next";
import {Session} from 'next-auth';

const Splitwise = require('splitwise');

import User from '@/models/User';
import {connectToDb} from '@/utils/mongodb';
import {options} from "@/app/api/auth/[...nextauth]/options";
import UnauthorizedPage from '@/components/ui/unauthorised/page';

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

    interface Balance {
        currency_code: string,
        amount: string,
    };

    interface Group {
        group_id: number,
        balance: Balance[],
    };

    interface Friend {
        id: number,
        first_name: string | null,
        last_name: string | null,
        email: string | null,
        registration_status: string,
        picture: {
            small: string | null,
            medium: string | null,
            large: string | null
        },
        balance: Balance[],
        groups: Group[],
        updated_at: string
    };

    interface Repayment {
        from: number,
        to: number,
        amount: string,
    };

    interface User {
        id: number,
        first_name: string,
        last_name: string,
        email: string,
        registration_status: "confirmed" | "dummy" | "invited",
        picture: {
            small?: string,
            medium?: string,
            large?: string
        },
        custom_picture?: false
    };

    interface Expense {
        id: number,
        group_id: number | null,
        friendship_id: number | null,
        expense_bundle_id: number | null,
        description: string,
        repeats: boolean,
        repeat_interval: "never" | "weekly" | "fortnightly" | "monthly" | "yearly" | null,
        email_reminder: boolean,
        email_reminder_in_advance: number,
        next_repeat: boolean,
        details: string | null,
        comments_count: number,
        payment: boolean,
        creation_method: string | null,
        transaction_method: string,
        transaction_confirmed: boolean | null,
        transaction_id: number | null,
        transaction_status: null,
        cost: string,
        currency_code: string,
        repayments: Repayment[],
        date: string,
        created_at: string,
        created_by: User | null,
        updated_at: string,
        updated_by: User | null,
        deleted_at: string | null,
        deleted_by: User | null,
        category: {
            id: number,
            name: string
        }[],
        receipt: {
            large: string | null,
            original: string | null
        },
        users: {
            user: User,
            user_id: number,
            paid_share: string,
            owed_share: string,
            net_balance: string,
        }[]
    };

    const friends: Friend[] = await sw.getFriends();
    const felix: Friend = await sw.getFriend({id: friends[0].id});
    const expenses = await sw.getExpense({id: 2695863776});
    console.log(expenses);

    return (
        <div className="h-full">
            <h1 className="text-4xl font-bold text-center">Dashboard</h1>
            <div className="flex flex-col m-10 justify-center items-center">
                <h2>Friends</h2>
                {
                    friends.map((friend: Friend) => (
                        <div className="w-full flex row-span-3 justify-between" key={friend.id}>
                            <p>{friend.id}</p>
                            <p>{friend.first_name}</p>
                            <p>{friend.last_name}</p>
                            <p>{JSON.stringify(friend.balance)}</p>
                        </div>
                    ))
                }
            </div>
            <div className="flex flex-col m-10 justify-center items-center">
                <h2>Friend Felix</h2>
                <div className="w-full flex row-span-3 justify-between" key={felix.id}>
                    <p>{felix.id}</p>
                    <p>{felix.first_name}</p>
                    <p>{felix.last_name}</p>
                    <p>{JSON.stringify(felix.balance)}</p>
                </div>
            </div>
        </div>
    )
}
