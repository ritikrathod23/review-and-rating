import { Router } from "express";
import ReviewController from "../controllers/review.controller";

const router = Router();

// POST /api/reviews/:companyId - Add a review for a specific company
router.post("/:companyId", ReviewController.addReview);

// GET /api/reviews/:companyId - Get all company reviews sorted dynamically
router.get("/:companyId", ReviewController.getReviewsByCompany);

// PATCH /api/reviews/like/:reviewId - Atomically increment review likes
router.patch("/like/:reviewId", ReviewController.likeReview);

export default router;
