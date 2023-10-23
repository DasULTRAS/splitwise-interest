import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";
import React from "react";
import { redirect } from "next/navigation";

export default async function SettingsLayout({ children, }: { children: React.ReactNode }) {
    const session: Session | null = await getServerSession(options);
    if (session)
        redirect("/");

    return (
        <>
            {children}
        </>
    );
}
