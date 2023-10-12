import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import User from '../../../lib/models/User';
import connectToDb from '../../../lib/mongodb';
import { checkEmail, checkPassword, checkUsername } from '../../../utils/validation';

const saltRounds = 10;
const mailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    const idString: string = req.body?.idString.toLowerCase();
    const password: string = req.body?.password;

    // Check if the input data is valid
    let errors = {idString: '', password: ''};
    errors.idString = checkUsername(idString);
    errors.password = checkPassword(password);

    if (errors.idString || errors.password) {
        return res.status(400).send({message: 'Invalid data!', errors: errors});
    }

    try {
        const searchField = mailFormat.test(idString) ? 'email' : 'username';

        await connectToDb();
        const user = await User.findOne({ [searchField]: idString });

        if (!user) {
            return res.status(400).send({message: 'User not found!'});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send({message: 'Wrong password!'});
        }

        res.send({message: 'Login successful!'});
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send({message: 'Server Error'});
    }
}
