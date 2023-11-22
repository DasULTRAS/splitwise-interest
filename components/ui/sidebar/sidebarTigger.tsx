"use client";

import Sidebar from "./sidebar";
import { useState } from "react";
import { Session } from "next-auth";

export default function SidebarTrigger({ children, session }: { children: React.ReactNode, session: Session }) {
    const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

    const handleClick = () => {
        setSidebarIsOpen(!sidebarIsOpen);
    };

    return (<>
        {sidebarIsOpen ?
            <>
                <Sidebar closeModal={() => setSidebarIsOpen(false)} session={session} />
                {children}
            </>
            :
            <div onClick={handleClick}>
                {children}
            </div>
        }
    </>);
}
