import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcrypt';
import User from '@/models/User';
import { connectToDb } from '@/utils/mongodb';
import { checkEmail } from '@/utils/validation';

export const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: LoginCredentials) {
                // Logik zur Überprüfung der Anmeldeinformationen
                try {
                    const searchField = checkEmail(credentials.username) ? 'username' : 'email';

                    await connectToDb();
                    const user = await User.findOne({ [searchField]: credentials.username });

                    if (!user) {
                        // No user found
                        return null;
                    }

                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isPasswordValid) {
                        // Invalid password
                        return null;
                    }

                    // Next Auth.js only shows name not username
                    user.name = user.username;
                    return user;
                } catch (err) {
                    return null;
                }
            }
        })
    ],
    session: {
        // Choose how you want to save the user session.
        // The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
        // If you use an `adapter` however, we default it to `"database"` instead.
        // You can still force a JWT session by explicitly defining `"jwt"`.
        // When using `"database"`, the session cookie will only contain a `sessionToken` value,
        // which is used to look up the session in the database.
        strategy: "jwt",

        // Seconds - How long until an idle session expires and is no longer valid.
        maxAge: 30 * 24 * 60 * 60, // 30 days

        // Seconds - Throttle how frequently to write to database to extend a session.
        // Use it to limit write operations. Set to 0 to always update the database.
        // Note: This option is ignored if using JSON Web Tokens
        updateAge: 24 * 60 * 60, // 24 hours
    },
    pages: {
        signIn: '/login',
        signOut: '/login',
    },
    events: {
        async signIn(message) { console.log(message) },
        async signOut(message) { console.log(message) },
        async createUser(message) { console.log(message) }
    },
};
