import { Document, ObjectId, Schema, model, models } from "mongoose";

export interface IAccount extends Document {
  provider: string;
  access_token: string;
  providerAccountId: number;
  token_type: string;
  type: string;
  userId: ObjectId;
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
    type: Schema.Types.ObjectId,
  },
});

const Account = models.Account || model<IAccount>("Account", userSchema);
export default Account;

export async function findAccountByProviderAccountId(providerAccountId: number): Promise<IAccount | null> {
  return (await Account.findOne({ providerAccountId })) ?? null;
}
