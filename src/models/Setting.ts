import { Document, Schema, model, models } from "mongoose";

export interface ISetting extends Document {
  id: number;
  oauth: {
    consumerKey: string;
    consumerSecret: string;
  };
}

const settingSchema = new Schema<ISetting>({
  id: {
    type: Number,
    required: true,
  },
  oauth: {
    consumerKey: {
      type: String,
      required: false,
    },
    consumerSecret: {
      type: String,
      required: false,
    },
  },
});

export default models.Setting || model<ISetting>("Setting", settingSchema);
