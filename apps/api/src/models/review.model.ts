import { Schema, model, Document, Types } from "mongoose";
import { IReview } from "@repo/types";

export interface ReviewDocument extends Omit<IReview, "_id" | "companyId" | "createdAt" | "updatedAt">, Document {
  companyId: Types.ObjectId;
}

const ReviewSchema = new Schema<ReviewDocument>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    fullName: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    review: { type: String, required: true, trim: true }, // matches review in review schema requirements
    rating: { type: Number, required: true, min: 1, max: 5 },
    likes: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Indexes for quick filtering/sorting
ReviewSchema.index({ companyId: 1, createdAt: -1 });
ReviewSchema.index({ companyId: 1, rating: -1 });
ReviewSchema.index({ companyId: 1, rating: 1 });
ReviewSchema.index({ companyId: 1, likes: -1 });

export const ReviewModel = model<ReviewDocument>("Review", ReviewSchema);
export default ReviewModel;
