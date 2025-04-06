import { Document, Schema, model, models } from "mongoose";

export interface ISetting extends Document {
  splitwiseId: number;
  oauth: {
    consumerKey: string;
    consumerSecret: string;
  };
}

const settingSchema = new Schema<ISetting>({
  splitwiseId: {
    type: Number,
    required: true,
  },
  oauth: {
    consumerKey: {
      type: String,
    },
    consumerSecret: {
      type: String,
    },
  },
});

const Setting = models.Setting || model<ISetting>("Setting", settingSchema);
export default Setting;

export async function findSettingBySplitwiseId(splitwiseId: number): Promise<ISetting | null> {
  return (await Setting.findOne({ splitwiseId })) ?? null;
}
