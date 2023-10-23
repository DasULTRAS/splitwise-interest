import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import User from '@/models/User';
import { checkEmail, checkPassword, checkUsername } from '@/utils/validation';
import { connectToDb } from '@/utils/mongodb';

export const saltRounds = 10;

interface Errors {
    email?: string;
    username?: string;
    password?: string;
}

interface Data {
    username: string,
    email: string,
    password: string,
}

export async function POST(req: NextRequest) {
    const data = await req.json() as Data;
    const email: string = data?.email?.toLowerCase();
    const username: string = data?.username?.toLowerCase();
    const password: string = data?.password;

    // Check if the input data is valid
    let errors: Errors = {};
    errors.email = checkEmail(email);
    errors.password = checkPassword(password);
    errors.username = checkUsername(username);

    if (errors.email || errors.password || errors.username) {
        return NextResponse.json(
            { message: 'Invalid data!', errors: errors },
            { status: 400 }
        );
    }

    try {
        await connectToDb();
        // Check for existing email or username
        const existingUserByEmail = await User.findOne({ email: email });
        const existingUserByUsername = await User.findOne({ username: username });

        if (existingUserByEmail) {
            return NextResponse.json(
                { message: 'Email already in use.' },
                { status: 400 }
            );
        }

        if (existingUserByUsername) {
            return NextResponse.json(
                { message: 'Username already in use.' },
                { status: 400 }
            );
        }

        // Hash the password
        const hashedPassword: string = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            email: email, username: username, password: hashedPassword
        });

        // Save the new user
        newUser.updatedAt = Date.now();
        await newUser.save();

        return NextResponse.json(
            { message: 'User successfully saved!' },
            { status: 201 }
        );

    } catch (err: any) {
        console.error('Error while registering user: ' + err);
        return NextResponse.json(
            { message: 'Server Error', error: err },
            { status: 500 }
        );
    }
}
