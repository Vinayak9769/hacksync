import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContentCalendar extends Document {
  userId?: string;
  sessionId: string;
  campaignTheme?: string;
  campaignName?: string;
  brandName?: string;
  startDate?: Date;
  durationWeeks?: number;
  channels: string[];
  calendar: any;
  createdAt: Date;
  updatedAt: Date;
}

const ContentCalendarSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    sessionId: { type: String, required: true, index: true },
    campaignTheme: { type: String },
    campaignName: { type: String },
    brandName: { type: String },
    startDate: { type: Date },
    durationWeeks: { type: Number },
    channels: { type: [String], default: [] },
    calendar: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

const ContentCalendarModel: Model<IContentCalendar> =
  mongoose.models.ContentCalendar ||
  mongoose.model<IContentCalendar>('ContentCalendar', ContentCalendarSchema);

export default ContentCalendarModel;
