import { z } from "zod";

// Zod schema for Company Validation
export const companySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  website: z.string().url("Please enter a valid website URL (e.g. https://google.com)").or(z.literal("")),
  foundedOn: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime()) && date <= new Date();
  }, {
    message: "Founded date must be a valid date in the past or today",
  }),
  location: z.string().min(2, "Location must be at least 2 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

// Zod schema for Review Validation
export const reviewSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  review: z.string().min(10, "Review text must be at least 10 characters"),
  rating: z.number().int().min(1, "Rating must be at least 1 star").max(5, "Rating cannot exceed 5 stars"),
});

// Shared Helpers
export const formatAverageRating = (rating: number): string => {
  return (Math.round(rating * 10) / 10).toFixed(1);
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
