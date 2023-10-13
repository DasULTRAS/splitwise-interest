import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import LoginButton from "./(auth)/loginButton";
import { SessionProvider } from "next-auth/react";

export default async function UserAvatar() {
    const session = await getServerSession(options);

    return (
        <div>
            {session &&
                <div>
                    <h2>{session?.user?.name}</h2>
                    {session?.user?.image && <img src={session?.user?.image} alt="User Avatar" />}
                    
                </div> 
            }
            <LoginButton user={session?.user} />
        </div>
    );
};
