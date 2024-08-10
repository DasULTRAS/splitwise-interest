import { options } from "@/app/api/auth/[...nextauth]/auth.config";
import Favicon from "@/components/images/favicon";
import UserAvatar from "@/components/ui/navbar/avatar";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import LoginButton from "../../buttons/loginButton";
import SidebarTrigger from "../sidebar/sidebarTigger";

export default async function Navbar() {
  const session: Session | null = await getServerSession(options);

  return (
    <div className="sticky row-span-3 flex h-16 w-screen bg-black/30 p-3 shadow-md shadow-black/30">
      <div className="w-16">
        <a title="home" href="/">
          <Favicon width={40} height={40} className="h-10 w-10" />
        </a>
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
          <SidebarTrigger session={session}>
            <UserAvatar session={session} height={40} width={40} className="h-10 w-10" />
          </SidebarTrigger>
        ) : (
          <LoginButton />
        )}
      </div>
    </div>
  );
}
