import mongoose from 'mongoose';
import {checkEmail, checkPassword} from "@/utils/validation"

const UserSchema = new mongoose.Schema({
    username: {
        type: String as any,
        required: true,
        unique: [true, "Username Exist"],
        minlength: [3, "Minimum 3 characters required!"],
    },
    email: {
        type: String as any,
        required: [true, "Please provide an email!"],
        unique: [true, "Email Exist"],
        validate: {
            validator: function (email: string) {
                return !checkEmail(email);
            },
            message: (props: { value: string }) => `${props.value} is not a valid email address!`
        }
    },
    password: {
        type: String as any,
        required: [true, "Please provide a password!"],
        validate: {
            validator: function (password: string) {
                return !checkPassword(password);
            },
            message: (props: { value: string }) => `${props.value} is an unacceptable password!`
        }
    },
    avatar: {
        type: String as any,
        required: false
    },
    splitwise: {
        id: {
            type: Number as any,
            required: false
        },
        consumerKey: {
            type: String as any,
            required: false
        },
        consumerSecret: {
            type: String as any,
            required: false
        },
        interests: [{
            friend_id: {
                type: Number as any,
                required: true
            },
            settings: {
                // Annual interest per Year
                apy : {
                    type: Number as any,
                    required: true,
                },
                // Number of days between two interests
                cycles: {
                    type: Number as any,
                    required: true,
                    default: 14,
                    min: 1,
                    max: 365
                },
                // Minimum age of the debt to be considered for interest
                minDebtAge: {
                    type: Number as any,
                    required: true,
                    default: 1,
                    min: 1,
                    max: 365
                },
                // next date where the interest is calculated
                nextDate: {
                    type: Date as any,
                    required: true,
                    default: Date.now
                },
            },
        }],
    },
    createdAt: {
        type: Date as any,
        default: Date.now
    },
    updatedAt: {
        type: Date as any,
        default: Date.now
    },
    lastPasswordUpdatedAt: {
        type: Date as any,
        default: Date.now
    },
    lastLogin: {
        type: Date as any,
        default: null
    }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);

export interface MongoUser {
    username: string,
    email: string,
    password: string,
    avatar: string,
    splitwise: {
        id: number,
        consumerKey: string,
        consumerSecret: string,
        interests: {
            friend_id: number,
            weeklyRate: number,
        }[],
    },
    createdAt: Date,
    updatedAt: Date,
    lastPasswordUpdatedAt: Date,
    lastLogin: Date,
}
