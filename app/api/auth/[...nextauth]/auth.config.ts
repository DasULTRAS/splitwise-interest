import User from "@/models/User";
import { connectToDb } from "@/utils/mongodb";
import { checkEmail } from "@/utils/validation";
import bcrypt from "bcrypt";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Logik zur Überprüfung der Anmeldeinformationen
        try {
          if (!credentials || !credentials.username || !credentials.password) {
            // If no credentials are provided, return null
            return null;
          }
          // Make sure username is in lowercase
          credentials.username = credentials.username.toLowerCase();

          const searchField = checkEmail(credentials.username)
            ? "username"
            : "email";

          await connectToDb();
          const user = await User.findOne({
            [searchField]: credentials.username,
          });

          if (!user) {
            // No user found
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordValid) {
            // Invalid password
            return null;
          }

          // Updated latest login
          user.lastLogin = Date.now();
          user.updatedAt = Date.now();
          await user.save();

          // Next Auth.js only shows name not username
          user.name = user.username;
          return user;
        } catch (err) {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV === "development",
};
