import mongoose from 'mongoose';
import { checkEmail } from "@/utils/validation"

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
            weeklyRate: {
                type: Number as any,
                required: true
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
    lastLogin: {
        type: Date as any,
        default: null
    }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
