import { Session } from "next-auth";
import UserAvatar from "@/components/ui/navbar/avatar";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";
import Favicon from "@/components/ui/images/favicon";
import Link from "next/link";
import SidebarTrigger from "../sidebar/sidebarTigger";
import LoginButton from "../buttons/loginButton";

export default async function Navbar() {
    const session: Session | null = await getServerSession(options);

    return (
        <div className="sticky w-screen h-16 p-3 row-span-3 flex bg-black/30 shadow-md shadow-black/30">
            <div className="w-16">
                <a title="home" href="/">
                    <Favicon width={40} height={40} className="w-10 h-10" />
                </a>
            </div>

            {session &&
                <nav className="flex w-4/6 items-center">
                    <ul className="flex w-full justify-start space-x-2">
                        <li className="btn_clickable rounded-2xl p-2"><Link href="/dashboard">Dashboard</Link></li>
                        <li className="btn_clickable rounded-2xl p-2"><Link href="/action">Action</Link></li>
                    </ul>
                </nav>
            }

            <div className="ml-auto w-1/6 flex flex-row-reverse">
                {session ?
                    <SidebarTrigger session={session}>
                        <UserAvatar session={session} height={40} width={40} className="w-10 h-10" />
                    </SidebarTrigger>
                    : <LoginButton />
                }
            </div>
        </div>
    );
}