import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import User from '../../../../lib/models/User';
import { checkEmail, checkPassword, checkUsername } from '../../../../utils/validation';
import { connectToDb } from '../../../../lib/mongodb';

const saltRounds = 10;

interface Errors {
    email?: string;
    username?: string;
    password?: string;
}

const handler = async function register(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const email: string = req.body?.email.toLowerCase();
        const username: string = req.body?.username.toLowerCase();
        const password: string = req.body?.password;

        // Check if the input data is valid
        let errors: Errors = {};
        errors.email = checkEmail(email);
        errors.password = checkPassword(password);
        errors.username = checkUsername(username);

        if (errors.email || errors.password || errors.username) {
            return res.status(400).send({ message: 'Invalid data!', errors: errors });
        }

        try {
            connectToDb();
            // Check for existing email or username
            const existingUserByEmail = await User.findOne({ email: email });
            const existingUserByUsername = await User.findOne({ username: username });

            if (existingUserByEmail) {
                return res.status(400).send({ message: 'Email already in use.' });
            }

            if (existingUserByUsername) {
                return res.status(400).send({ message: 'Username already in use.' });
            }

            // Hash the password
            const hashedPassword: string = await bcrypt.hash(password, saltRounds);

            const newUser = new User({
                email: email, username: username, password: hashedPassword
            });

            // Save the new user
            await newUser.save();
            res.status(201).send({ message: 'User successfully saved!' });

        } catch (err: any) {
            console.error('Error while registering user: ' + err);
            return res.status(500).send({ message: 'Server Error' });
        }
    } else {
        res.status(405).end();
    }
}

export { handler as GET, handler as POST }
