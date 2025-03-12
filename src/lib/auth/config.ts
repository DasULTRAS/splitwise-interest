import UserModel from "@/models/User";
import { getClient } from "@/utils/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { MongoClient } from "mongodb";
import { NextAuthConfig, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import Splitwise from "./provider/splitwise";

export interface CustomUser extends User {
  id?: string;
}

export interface CustomSession extends Session {
  accessToken?: string;
  user: CustomUser;
}

export interface CustomToken extends JWT {
  accessToken?: string;
  id?: string;
}

if (!process.env.AUTH_SPLITWISE_ID || !process.env.AUTH_SPLITWISE_SECRET) {
  throw new Error("Please define AUTH_SPLITWISE_ID and AUTH_SPLITWISE_SECRET in your environment variables");
}

const client = getClient() as unknown as MongoClient;

const authOptions: NextAuthConfig = {
  debug: process.env.NODE_ENV === "development",
  adapter: MongoDBAdapter(client),
  providers: [
    // Default Callback: [origin]/api/auth/callback/[provider]
    Splitwise({
      clientId: process.env.AUTH_SPLITWISE_ID, // from the provider's dashboard
      clientSecret: process.env.AUTH_SPLITWISE_SECRET, // from the provider's dashboard
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, trigger, session, account, profile }) {
      // https://next-auth.js.org/configuration/callbacks#jwt-callback

      if (trigger === "update") token.name = session.user.name;
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.id = profile?.id;
      }
      return token as CustomToken;
    },
    async session({ session, token }: { session: CustomSession; token: CustomToken }) {
      // https://next-auth.js.org/configuration/callbacks#session-callback

      // Send properties to the client, like an access_token and user id from a provider.
      session.accessToken = token.accessToken;
      session.user.id = token?.id;

      return session;
    },
  },
  events: {
    async signIn(message) {
      console.log(`${message.isNewUser ? "New" : "Existing"} User ${message.user.name} logged in.`);

      // Check if user already exists
      const user = await UserModel.findOne({ _id: message.user.id });

      if (user) {
        user.lastLogin = new Date();
        if (message.isNewUser) user.firstLogin = new Date();

        await user.save();
      }
    },
    async signOut(message) {
      console.log(`User ${message} logged out.`);
    },
    async session(message) {
      if (process.env.NODE_ENV === "development") console.log("Session: ", message);
    },
  },
};

export default authOptions;
