import { Session } from "next-auth";
import UserAvatar from "@/components/ui/navbar/avatar";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";
import Favicon from "@/components/ui/images/favicon";
import Link from "next/link";

export default async function Navbar() {
    const session: Session | null = await getServerSession(options);

    return (
        <div className="sticky row-span-3 flex w-screen bg-black/20 px-4 py-3 dark:bg-black/30">
            <div className="w-1/5">
                <a title="home" href="/">
                    <Favicon width={48} height={48}/>
                </a>
            </div>

            <nav className="flex w-4/6 items-center">
                <ul className="flex w-full justify-between space-x-2">
                    <li className="btn_clickable rounded-2xl p-2"><Link href="/">Home</Link></li>
                    <li className="btn_clickable rounded-2xl p-2"><Link href="/dashboard">Dashboard</Link></li>
                    <li className="btn_clickable rounded-2xl p-2"><Link href="/action">Action</Link></li>
                </ul>
            </nav>

            <div className="ml-auto flex w-1/5 flex-row-reverse">
                <UserAvatar session={session}/>
            </div>
        </div>
    );
}