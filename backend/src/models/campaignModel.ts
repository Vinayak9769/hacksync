import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICampaign extends Document {
  userId?: string;
  intake: any;
  metrics: any;
  plan: any;
  versions: any[];
  createdAt: Date;
  updatedAt: Date;
}

const CampaignSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    intake: { type: Schema.Types.Mixed, required: true },
    metrics: { type: Schema.Types.Mixed, default: {} },
    plan: { type: Schema.Types.Mixed, required: true },
    versions: { type: [Schema.Types.Mixed], default: [] },
  },
  { timestamps: true }
);

const CampaignModel: Model<ICampaign> = mongoose.models.Campaign || mongoose.model<ICampaign>('Campaign', CampaignSchema);

export default CampaignModel;
