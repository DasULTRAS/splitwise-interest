import Image from "next/image";
import {Session} from "next-auth";
import UserAvatar from "@/components/ui/navbar/avatar";
import {getServerSession} from "next-auth/next";
import {options} from "@/app/api/auth/[...nextauth]/options";

export default async function Navbar() {
    const session: Session | null = await getServerSession(options);

    return (
        <div className="sticky row-span-3 flex h-16 w-screen bg-white/30 px-4 py-2 dark:bg-black/30">
            <div className="w-1/5">
                <a title="favicon" href="/">
                    <Image src="/favicon.ico" alt="Logo" width={50} height={50}/>
                </a>
            </div>

            <nav className="flex w-4/6 items-center">
                <ul className="flex w-full justify-between space-x-2">
                    <li id="dsn_clickable" className="rounded-2xl"><a href="/">Home</a></li>
                    <li id="dsn_clickable" className="rounded-2xl"><a href="/dashboard">Dashboard</a></li>
                    <li id="dsn_clickable" className="rounded-2xl"><a href="/action">Action</a></li>
                </ul>
            </nav>

            <div className="ml-auto flex w-1/5 flex-row-reverse">
                <UserAvatar session={session}/>
            </div>
        </div>
    );
}