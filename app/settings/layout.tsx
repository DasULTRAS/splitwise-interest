import Image from "next/image";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";

export default async function SettingsLayout({ children, }: { children: React.ReactNode }) {
    const session: Session | null = await getServerSession(options);


    return (
        <div className="flex">
            <div className="h-full p-5 bg-black/80">
                    <div className="flex-row justify-between">
                        {
                            session?.user?.image &&
                            <Image src={session?.user?.image} alt="Avatar" width={40} height={40} />
                        }
                        <h1 className="text-2xl font-mono font-bold">{session?.user?.name}</h1>
                    </div>

                    <h2 className="my-5 underline">Settings</h2>
                    <ul>
                        <li>
                            <a href="/settings/profile">Profile</a>
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
