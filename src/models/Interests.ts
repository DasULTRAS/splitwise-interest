import { Document, Schema, model, models } from "mongoose";

export interface IInterests extends Document {
  id: number;
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

const IInterestPair = new Schema<IInterestPair>({
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

const InterestsSchema = new Schema<IInterests>({
  id: {
    type: Number,
    required: true,
  },
  interests: [IInterestPair],
});

export default models.Interests || model<IInterests>("Interests", InterestsSchema, "interests");
