import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";
import LoginButton from "@/components/ui/buttons/loginButton";
import ToggleButton from "../sidebar/toggleButton";

export default async function UserAvatar() {
    const session = await getServerSession(options);

    return (
        <div>
            {session &&
                <div>
                    <ToggleButton>
                        {session?.user?.image
                            ? <img src={session?.user?.image} alt="User Avatar" />
                            : <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                <span className="font-medium text-gray-600 dark:text-gray-300">{session.user?.name?.substring(0, 2)}</span>
                            </div>}
                    </ToggleButton>
                </div>
            }
            <LoginButton user={session?.user} />
        </div>
    );
};
