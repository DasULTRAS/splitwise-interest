import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String, required: true, unique: [true, "Username Exist"], minlength: [3, "Minimum 3 characters required!"],
    },

    email: {
        type: String, required: [true, "Please provide an email!"], unique: [true, "Email Exist"], validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(v);
            }, message: props => `${props.value} is not a valid email address!`
        }
    },

    password: {
        type: String,
        required: [true, "Please provide a password!"],
    },
});

export default mongoose.model('User', UserSchema);
