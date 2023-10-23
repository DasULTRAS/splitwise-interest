import Image from "next/image";
import { Session } from "next-auth";
import UserAvatar from "@/components/ui/navbar/avatar";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";

import favicon from "@/app/favicon.ico";

export default async function Navbar() {
    const session: Session | null = await getServerSession(options);

    return (
        <div className="sticky w-screen flex row-span-3 bg-white/30 py-2 px-4 dark:bg-black/30 h-16">
            <div className="w-1/5">
                <a title="favicon" href="/">
                    <Image src={favicon} alt="Logo" width={50} height={50} />
                </a>
            </div>

            <nav className="w-4/6 flex items-center">
                <ul className="flex space-x-2 justify-between w-full">
                    <li id="dsn_clickable" className="rounded-2xl"><a href="/">Home</a></li>
                    <li id="dsn_clickable" className="rounded-2xl"><a href="/dashboard">Dashboard</a></li>
                    <li id="dsn_clickable" className="rounded-2xl"><a href="/action">Action</a></li>
                </ul>
            </nav>

            <div className="ml-auto w-1/5 flex flex-row-reverse">
                <UserAvatar session={session} />
            </div>
        </div>
    );
}