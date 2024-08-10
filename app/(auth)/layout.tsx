import { options } from "@/app/api/auth/[...nextauth]/auth.config";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import React from "react";

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  const session: Session | null = await getServerSession(options);
  if (session) redirect("/");

  return <>{children}</>;
}
