"use server";

import AuthButton from "@/components/buttons/AuthButton";
import Favicon from "@/components/images/favicon";
import UserAvatar from "@/components/ui/navbar/avatar";
import { auth } from "@/lib/auth";
import Link from "next/link";
import SidebarTrigger from "../sidebar/sidebarTigger";

export default async function Navbar() {
  const session = await auth();

  return (
    <div className="sticky row-span-3 flex h-16 w-screen bg-black/30 p-3 shadow-md shadow-black/30">
      <div className="w-16">
        <Link title="home" href="/">
          <Favicon width={40} height={40} className="h-10 w-10" />
        </Link>
      </div>

      {session && (
        <nav className="flex w-4/6 items-center">
          <ul className="flex w-full justify-start space-x-2">
            <li className="btn_clickable rounded-2xl p-2">
              <Link href="/dashboard">Dashboard</Link>
            </li>
            <li className="btn_clickable rounded-2xl p-2">
              <Link href="/action">Action</Link>
            </li>
          </ul>
        </nav>
      )}

      <div className="ml-auto flex w-1/6 flex-row-reverse">
        {session ? (
          <SidebarTrigger>
            <UserAvatar height={40} width={40} className="h-10 w-10" />
          </SidebarTrigger>
        ) : (
          <AuthButton />
        )}
      </div>
    </div>
  );
}
