import { Schema, model, Document } from "mongoose";
import { ICompany } from "@repo/types";

export interface CompanyDocument extends Omit<ICompany, "_id" | "createdAt" | "updatedAt">, Document {}

const CompanySchema = new Schema<CompanyDocument>(
  {
    name: { type: String, required: true, trim: true },
    logo: { type: String, required: true },
    website: { type: String, default: "" },
    foundedOn: { type: String, required: true },
    location: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
CompanySchema.index({ name: "text", city: "text", location: "text" });

export const CompanyModel = model<CompanyDocument>("Company", CompanySchema);
export default CompanyModel;
