import NextAuth from "next-auth";
import "next-auth/jwt";
import nextConfig from "./config";

export { default as config } from "./config";

export const { handlers, auth, signIn, signOut } = NextAuth(nextConfig);
