import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICanvas extends Document {
  userId?: string;
  canvasId: string;
  name: string;
  width: number;
  height: number;
  aspectRatio: string;
  backgroundColor: string;
  primaryImagePrompt?: string;
  layers: any[];
  version: number;
  metadata?: {
    brandName?: string;
    brandColors?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const CanvasSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    canvasId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    aspectRatio: { type: String, required: true },
    backgroundColor: { type: String, default: '#ffffff' },
    primaryImagePrompt: { type: String },
    layers: { type: [Schema.Types.Mixed], default: [] },
    version: { type: Number, default: 1 },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

const CanvasModel: Model<ICanvas> =
  mongoose.models.Canvas || mongoose.model<ICanvas>('Canvas', CanvasSchema);

export default CanvasModel;
