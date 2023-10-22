"use client";

import Image from "next/image";
import { Session } from "next-auth";
import { useState, useEffect } from "react";
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
            const data = await response.json();
            setAvatar(data?.avatar);
        };

        if (session)
            fetchAvatar();
    }, [session]);

    const handleClick = () => {
        setSidebarIsOpen(!sidebarIsOpen);
    };

    return (
        <>
            {session ?
                <div id="dsn_clickable" className="relative inline-flex items-center justify-center overflow-hidden rounded-full"
                    onClick={handleClick}>
                    {
                        avatar ?
                            <Image src={avatar} alt="User Avatar" height={50} width={50} />
                            :
                            <span className="font-medium text-gray-600 dark:text-gray-300">{session.user?.name?.substring(0, 2)}</span>
                    }
                </div>
                : <LoginButton />
            }
            <Sidebar sidebarIsOpen={sidebarIsOpen} closeModal={() => setSidebarIsOpen(false)} session={session} />
        </>
    );
};
