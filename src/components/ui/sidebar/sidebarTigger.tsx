"use client";

import { useState } from "react";
import Sidebar from "./sidebar";

export default function SidebarTrigger({ children }: { children: React.ReactNode }) {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

  const handleClick = () => {
    setSidebarIsOpen(!sidebarIsOpen);
  };

  return (
    <>
      {sidebarIsOpen ? (
        <>
          <Sidebar closeModal={() => setSidebarIsOpen(false)} />
          {children}
        </>
      ) : (
        <div onClick={handleClick}>{children}</div>
      )}
    </>
  );
}
