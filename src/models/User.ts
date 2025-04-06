import { Document, Schema, model, models } from "mongoose";

export interface IUser extends Document {
  email: string;
  emailVerified: boolean;
  image: string;
  name: string;
  firstLogin: Date;
  lastLogin: Date;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
  },
  emailVerified: {
    type: Boolean,
  },
  image: {
    type: String,
  },
  name: {
    type: String,
  },
  firstLogin: {
    type: Date,
  },
  lastLogin: {
    type: Date,
  },
});

const User = models.User || model<IUser>("User", userSchema);
export default User;
