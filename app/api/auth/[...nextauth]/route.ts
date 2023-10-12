import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcrypt';
import User from '../../../../lib/models/User';
import { connectToDb } from '../../../../lib/mongodb';
import { checkEmail } from '@/utils/validation';

interface LoginCredentials {
    username: string,
    password: string,
    redirect: string,
    csrfToken: string,
    callbackUrl: string,
}

const handler = NextAuth({
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

                    return user;
                } catch (err) {
                    return null;
                }
            }
        })
    ],
    //    database: process.env.DATABASE_URL, // Ihre MongoDB-Verbindungszeichenfolge
    session: {
        // jwt: false, // Verwenden Sie Datenbanksessions anstelle von JWT
        maxAge: 30 * 24 * 60 * 60, // 30 Tage
    },
    pages: {
        signIn: '/login',
        newUser: '/register',
    },
    events: {
        async signIn(message) { console.log(message) },
        async signOut(message) { console.log(message) },
        async createUser(message) { console.log(message) }
    }
});

export { handler as GET, handler as POST }
