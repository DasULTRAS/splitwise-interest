import Image from "next/image";
import { Session } from "next-auth";
import UserAvatar from "@/components/ui/navbar/avatar";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";

import favicon from "@/app/favicon.ico";

export default async function Navbar() {
    const session: Session | null = await getServerSession(options);

    return (
        <div className="sticky w-screen flex row-span-3 bg-white/30 py-2 px-7 dark:bg-black/30 h-16">
            <div>
                <a title="favicon" href="/">
                    <Image src={favicon} alt="Logo" width={50} height={50} />
                </a>
            </div>

            <nav className="mx-10  flex items-center">
                <ul className="flex  items-center">
                    <li className="mx-5"><a href="/">Home</a></li>
                    <li className="mx-5"><a href="/dashboard">Dashboard</a></li>
                </ul>
            </nav>


            <div className="ml-auto">
                <UserAvatar session={session} />
            </div>
        </div>
    );
}