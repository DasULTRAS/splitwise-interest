"use client";

import { signIn, signOut } from "next-auth/react";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export function SignIn({
  provider,
  ...props
}: { provider?: string } & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
  return (
    <button onClick={() => signIn(provider)} {...props}>
      Sign In (Client)
    </button>
  );
}

export function SignOut(props: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
  return (
    <button onClick={() => signOut()} {...props}>
      Sign Out (Client)
    </button>
  );
}
