"use client";

import Image from "next/image";
import { Session } from "next-auth";
import { useState } from "react";
import LoginButton from "@/components/ui/buttons/loginButton";
import Sidebar from "../sidebar/sidebar";

export default function UserAvatar({ session }: { session: Session | null | undefined }) {
    const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

    const handleClick = () => {
        setSidebarIsOpen(!sidebarIsOpen);
    };

    return (
        <>
            <div>
                {session ?
                    <div className="onhover:bg-black/90 rounded-2xl"
                        onClick={handleClick}>
                        {
                            session?.user?.image
                                ? <Image src={session?.user?.image} alt="User Avatar" />
                                : <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                    <span className="font-medium text-gray-600 dark:text-gray-300">{session.user?.name?.substring(0, 2)}</span>
                                </div>
                        }
                    </div>
                    : <LoginButton />
                }
            </div>

            <Sidebar sidebarIsOpen={sidebarIsOpen} closeModal={() => setSidebarIsOpen(false)} session={session} />
        </>
    );
};
