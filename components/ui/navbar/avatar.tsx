"use client";

import Image from "next/image";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import LoginButton from "@/components/ui/buttons/loginButton";
import Sidebar from "../sidebar/sidebar";

export default function UserAvatar({ session }: { session: Session | null | undefined }) {
    const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
    const [avatar, setAvatar] = useState("");

    useEffect(() => {
        const fetchAvatar = async () => {
            const response = await fetch("/api/user/avatar", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                cache: 'force-cache'
            });
            if (response.ok) {
                const data = await response.json();
                return data?.avatar;
            }
            else return undefined;
        };

        if (session)
            fetchAvatar().then(avatar => { if (avatar) setAvatar(avatar) });
    }, [session]);

    const handleClick = () => {
        setSidebarIsOpen(!sidebarIsOpen);
    };

    return (
        <>
            {session ?
                <div
                    className="btn_clickable relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600"
                    onClick={handleClick}>
                    {
                        avatar ?
                            <Image src={avatar} alt="User Avatar" height={50} width={50} />
                            :
                            <span className="font-medium text-gray-600 dark:text-gray-300">
                                {session.user?.name?.substring(0, 2)}
                            </span>
                    }
                </div>
                : <LoginButton />
            }
            <Sidebar sidebarIsOpen={sidebarIsOpen} closeModal={() => setSidebarIsOpen(false)} session={session} />
        </>
    );
};
