import { Request, Response, NextFunction } from "express";
import { ReviewService } from "../services/review.service";
import { reviewSchema } from "@repo/utils";
import { ApiResponse } from "@repo/types";

export class ReviewController {
  /**
   * POST /api/reviews/:companyId
   * Add a company review
   */
  static async addReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId } = req.params;

      // Handle structural mapping from frontend keys (e.g. reviewText -> review)
      const rawReview = req.body.review || req.body.reviewText;

      const reviewData = reviewSchema.parse({
        fullName: req.body.fullName,
        subject: req.body.subject,
        review: rawReview,
        rating: Number(req.body.rating),
      });

      const review = await ReviewService.addReview(companyId, reviewData);

      const response: ApiResponse<typeof review> = {
        success: true,
        message: "Review submitted successfully",
        data: review,
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/reviews/:companyId
   * Get all company reviews sorted dynamically
   */
  static async getReviewsByCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId } = req.params;
      const sortBy = (req.query.sortBy as string) || "latest";

      const reviews = await ReviewService.getReviewsByCompany(companyId, sortBy);

      const response: ApiResponse<typeof reviews> = {
        success: true,
        data: reviews,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/reviews/like/:reviewId
   * Like a review (atomically increment likes)
   */
  static async likeReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { reviewId } = req.params;
      const review = await ReviewService.likeReview(reviewId);

      const response: ApiResponse<typeof review> = {
        success: true,
        message: "Review liked successfully",
        data: review,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
export default ReviewController;
