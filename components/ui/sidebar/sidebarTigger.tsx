"use client";

import { Session } from "next-auth";
import { useState } from "react";
import Sidebar from "./sidebar";

export default function SidebarTrigger({ children, session }: { children: React.ReactNode; session: Session }) {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

  const handleClick = () => {
    setSidebarIsOpen(!sidebarIsOpen);
  };

  return (
    <>
      {sidebarIsOpen ? (
        <>
          <Sidebar closeModal={() => setSidebarIsOpen(false)} session={session} />
          {children}
        </>
      ) : (
        <div onClick={handleClick}>{children}</div>
      )}
    </>
  );
}
