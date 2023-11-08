import Image from "next/image";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";
import React from "react";
import Link from "next/link";

export default async function SettingsLayout({ children, }: { children: React.ReactNode }) {
    const session: Session | null = await getServerSession(options);


    return (
        <div className="flex min-h-full">
            <div className="min-h-full bg-black/80 p-6">
                <div className="flex-row justify-between">
                    {
                        session?.user?.image &&
                        <Image src={session?.user?.image} alt="Avatar" width={40} height={40} />
                    }
                    <h1 className="font-mono text-2xl font-bold text-white">{session?.user?.name}</h1>
                </div>

                <hr className="mb-6 border-t" />

                <h2 className="my-5 text-white underline">Settings</h2>
                <ul className="text-white space-y-2">
                    <li>
                        <Link className="btn_clickable rounded-md p-1" href="/settings/profile">Profile</Link>
                    </li>
                    <li>
                        <Link className="btn_clickable rounded-md p-1" href="/settings/password">Password</Link>
                    </li>
                    <li>
                        <Link className="btn_clickable rounded-md p-1" href="/settings/splitwise">Splitwise</Link>
                    </li>
                </ul>
            </div>

            {children}
        </div>
    )
}
