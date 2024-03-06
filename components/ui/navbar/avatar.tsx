import Image from "next/image";
import { Session } from "next-auth";
import { getAvatar } from "@/utils/splitwise/splitwise";

export default async function UserAvatar({ session, height, width, className = "h-12 w-12" }: { session: Session | null | undefined, height: number, width: number, className: string }) {
    if (!session?.user?.name)
        return (<> <p>Unauthorized</p></>);

    const avatar = await getAvatar(session.user.name);

    return (
        <>
            <div
                className={`btn_clickable relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600 border-1 border-black dark:border-white ${className}`}>
                {
                    avatar ?
                            <Image src={avatar} alt="User Avatar" height={height} width={width} />
                        :
                        <span className="font-medium text-gray-600 dark:text-gray-300">
                            {session.user?.name?.substring(0, 2)}
                        </span>
                }
            </div>
        </>
    );
};
