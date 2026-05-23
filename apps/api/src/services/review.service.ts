import { Types } from "mongoose";
import ReviewModel, { ReviewDocument } from "../models/review.model";
import CompanyModel from "../models/company.model";
import { CreateReviewInput } from "@repo/types";
import { AppError } from "../middleware/errorHandler.middleware";

export class ReviewService {
  /**
   * Add a review for a specific company and dynamically update company stats
   */
  static async addReview(companyId: string, reviewData: CreateReviewInput): Promise<ReviewDocument> {
    // 1. Verify company exists
    const company = await CompanyModel.findById(companyId);
    if (!company) {
      throw new AppError("Company not found, unable to submit review", 404);
    }

    // 2. Create the review
    const review = await ReviewModel.create({
      companyId: new Types.ObjectId(companyId),
      ...reviewData,
    });

    // 3. Recalculate company total review and average rating statistics dynamically
    await this.updateCompanyStats(companyId);

    return review;
  }

  /**
   * Recalculates average rating and review counts dynamically via MongoDB aggregation
   */
  static async updateCompanyStats(companyId: string): Promise<void> {
    const stats = await ReviewModel.aggregate([
      { $match: { companyId: new Types.ObjectId(companyId) } },
      {
        $group: {
          _id: "$companyId",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (stats.length > 0) {
      await CompanyModel.findByIdAndUpdate(companyId, {
        averageRating: stats[0].averageRating,
        totalReviews: stats[0].totalReviews,
      });
    } else {
      await CompanyModel.findByIdAndUpdate(companyId, {
        averageRating: 0,
        totalReviews: 0,
      });
    }
  }

  /**
   * Get all reviews for a company, sorted dynamically
   */
  static async getReviewsByCompany(companyId: string, sortBy: string = "latest"): Promise<ReviewDocument[]> {
    let sortOption: any = { createdAt: -1 };

    switch (sortBy) {
      case "highest rating":
        sortOption = { rating: -1, createdAt: -1 };
        break;
      case "lowest rating":
        sortOption = { rating: 1, createdAt: -1 };
        break;
      case "most liked":
        sortOption = { likes: -1, createdAt: -1 };
        break;
      case "latest":
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    return await ReviewModel.find({ companyId: new Types.ObjectId(companyId) }).sort(sortOption);
  }

  /**
   * Increment a review's likes atomically
   */
  static async likeReview(reviewId: string): Promise<ReviewDocument> {
    const review = await ReviewModel.findByIdAndUpdate(
      reviewId,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!review) {
      throw new AppError("Review not found", 404);
    }

    return review;
  }
}
