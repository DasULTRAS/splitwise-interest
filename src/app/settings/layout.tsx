"use server";

import WebImage from "@/components/images/WebImage";
import { auth } from "@/lib/auth";
import Link from "next/link";
import React from "react";

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="flex min-h-full">
      <div className="min-h-full bg-black/80 p-4 sm:p-6">
        <div className="flex-row justify-between">
          {session?.user?.image && <WebImage src={session?.user?.image} width={40} height={40} />}
          <h2 className="font-mono text-2xl font-bold text-white">{session?.user?.name}</h2>
        </div>

        <hr className="mb-6 border-t" />

        <p className="my-5 text-white underline">Settings</p>
        <ul className="space-y-2 text-white">
          <li>
            <Link className="btn_clickable rounded-md p-1" href="/settings/splitwise">
              Splitwise
            </Link>
          </li>
        </ul>
      </div>

      {children}
    </div>
  );
}
