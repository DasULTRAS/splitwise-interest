"use client";

import { useSession } from "next-auth/react";
import { SignIn, SignOut } from "./AuthComponents";

export default function AuthButton() {
  const session = useSession();

  if (!session || session.status === "loading") return null;

  return (
    <div className="flex items-center">
      {session.data?.user ? <SignOut /> : <SignIn provider="splitwise" />}
      {
        // <button className="btn_clickable flex rounded-2xl p-2" type="button">
        //   {loading && (
        //     <svg className="m-auto mr-3 h-5 w-5 animate-spin" viewBox="0 0 24 24">
        //       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        //       <path
        //         className="opacity-75"
        //         fill="currentColor"
        //         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        //       ></path>
        //     </svg>
        //   )}
        //   Logout
        // </button>
        // <Link className="btn_save rounded-2xl p-2" onClick={() => signIn("splitwise")}>
        //   Login
        // </Link>
      }
    </div>
  );
}
