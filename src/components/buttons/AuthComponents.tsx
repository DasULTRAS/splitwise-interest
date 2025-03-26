"use client";

import { signIn, signOut } from "next-auth/react";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export function SignIn({
  provider = "splitwise",
  children,
  ...props
}: { provider?: string } & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
  return (
    <button onClick={() => signIn(provider)} {...props}>
      {children ?? "Sign In"}
    </button>
  );
}

export function SignOut({
  children,
  ...props
}: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
  return (
    <button onClick={() => signOut({ redirectTo: "/" })} {...props}>
      {children ?? "Sign Out"}
    </button>
  );
}
