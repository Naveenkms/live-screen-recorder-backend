import mongoose, { Document, Schema } from "mongoose";

export interface IVideo extends Document {
  userId: string;
  title: string;
  url: string;
  key: string;
  createdAt: Date;
  updatedAt: Date;
}

const videoSchema = new Schema<IVideo>(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    key: { type: String, required: true },
  },
  { timestamps: true },
);

export const Video = mongoose.model<IVideo>("Video", videoSchema);
