import NextAuth from 'next-auth';
import {options} from './options';

interface LoginCredentials {
    username: string,
    password: string,
    redirect: string,
    csrfToken: string,
    callbackUrl: string,
}

const handler = NextAuth(options);

export { handler as GET, handler as POST }
