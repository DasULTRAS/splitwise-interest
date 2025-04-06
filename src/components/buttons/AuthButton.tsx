"use client";

import { useSession } from "next-auth/react";
import { SignIn, SignOut } from "./AuthComponents";

export default function AuthButton() {
  const session = useSession();

  if (!session || session.status === "loading") return null;

  return (
    <div className="flex items-center">
      {session.data?.user ? (
        <SignOut className="btn_save flex rounded-2xl p-2" />
      ) : (
        <SignIn className="btn_save flex rounded-2xl p-2" provider="splitwise" />
      )}
    </div>
  );
}
