import { Document, Schema, model, models } from "mongoose";

export interface IAccount extends Document {
  provider: string;
  access_token: string;
  providerAccountId: number;
  token_type: string;
  type: string;
  userId: number;
}

const userSchema = new Schema<IAccount>({
  provider: {
    type: String,
  },
  access_token: {
    type: String,
  },
  providerAccountId: {
    type: Number,
  },
  token_type: {
    type: String,
  },
  type: {
    type: String,
  },
  userId: {
    type: Number,
  },
});

export default models.User || model<IAccount>("User", userSchema);
