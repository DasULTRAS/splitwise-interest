import Splitwise from "@/utils/splitwise/splitwise";
import NextAuth from "next-auth";
import { options } from "./auth.config";

const handler = NextAuth({
  events: {
    async signIn(message) {
      console.log(`User ${message?.user?.name} logged in with ${message.account?.type}.`);
    },
    async signOut(message) {
      console.log(`User ${message?.token?.name} logged out.`);

      if (message.token.name) await Splitwise.resetInstanceByUsername(message.token.name);
    },
    async createUser(message) {
      console.log("User created: ", message);
    },
    async session(message) {
      if (options.debug) console.log("Session: ", message);
    },
  },
  callbacks: {
    async redirect({ url }) {
      return Promise.resolve(url);
    },
  },
  ...options,
});

export { handler as GET, handler as POST };
