import { Document, Model, Schema, model, models } from "mongoose";

export interface IInterests extends Document {
  splitwiseId: number;
  interests: IInterestPair[];
}

export interface IInterestPair {
  friendId: number;
  settings: {
    apy: number;
    cycles: number;
    minAmount: number;
    minDebtAge: number;
    nextDate: Date;
  };
}

const interestPairSchema = new Schema<IInterestPair>({
  friendId: {
    type: Number,
    required: true,
  },
  settings: {
    // Annual interest per Year
    apy: {
      type: Number,
      required: true,
    },
    // Number of days between two interests
    cycles: {
      type: Number,
      required: true,
      default: 14,
      min: 1,
      max: 365,
    },
    // Minimum age of the debt to be considered for interest
    minDebtAge: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 365,
    },
    // Min amount from which interest is charged
    minAmount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    // next date where the interest is calculated
    nextDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
});

const interestsSchema = new Schema<IInterests>({
  splitwiseId: {
    type: Number,
    required: true,
  },
  interests: [interestPairSchema],
});

const Interests = models.Interests || model<IInterests, Model<IInterests>>("Interests", interestsSchema, "interests");
export default Interests;

export async function findInterestsBySplitwiseId(splitwiseId: number): Promise<IInterests | null> {
  return (await Interests.findOne({ splitwiseId })) ?? null;
}
