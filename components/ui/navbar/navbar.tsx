import Image from "next/image";
import { Session } from "next-auth";
import UserAvatar from "@/components/ui/navbar/avatar";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";

import favicon from "@/app/favicon.ico";

export default async function Navbar() {
    const session : Session | null = await getServerSession(options);

    return (
        <div className="sticky items-center w-screen flex row-span-3 justify-between bg-white/30 py-2 px-5 dark:bg-black/30 h-16">
            <div>
                <Image src={favicon} alt="Logo" width={40} height={40} />
            </div>
            <h1>Navigation</h1>
            <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                </ul>
            </nav>
            <UserAvatar session={session} />
        </div>
    );
}