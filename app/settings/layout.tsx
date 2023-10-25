import Image from "next/image";
import {Session} from "next-auth";
import {getServerSession} from "next-auth/next";
import {options} from "@/app/api/auth/[...nextauth]/options";
import React from "react";

export default async function SettingsLayout({children,}: { children: React.ReactNode }) {
    const session: Session | null = await getServerSession(options);


    return (
        <div className="flex h-full">
            <div className="h-full bg-black/80 p-6">
                <div className="flex-row justify-between">
                    {
                        session?.user?.image &&
                        <Image src={session?.user?.image} alt="Avatar" width={40} height={40}/>
                    }
                    <h1 className="font-mono text-2xl font-bold">{session?.user?.name}</h1>
                </div>

                <hr className="mb-6 border-t"/>

                <h2 className="my-5 underline">Settings</h2>
                <ul className="space-y-2">
                    <li>
                        <a href="/settings/profile">Profile</a>
                    </li>
                    <li>
                        <a href="/settings/password">Password</a>
                    </li>
                    <li>
                        <a href="/settings/splitwise">Splitwise</a>
                    </li>
                </ul>
            </div>

            {children}
        </div>
    )
}
