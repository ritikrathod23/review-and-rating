import { create } from "zustand";
import { IReview, CreateReviewInput } from "@repo/types";
import { apiService } from "../lib/api";

interface ReviewState {
  reviews: IReview[];
  sortBy: string;
  loading: boolean;
  error: string | null;

  // Actions
  fetchReviews: (companyId: string) => Promise<void>;
  addReview: (companyId: string, reviewInput: CreateReviewInput) => Promise<boolean>;
  likeReview: (reviewId: string) => Promise<void>;
  setSortBy: (sortBy: string, companyId: string) => void;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: [],
  sortBy: "latest",
  loading: false,
  error: null,

  fetchReviews: async (companyId: string) => {
    set({ loading: true, error: null });
    try {
      const { sortBy } = get();
      const response = await apiService.getReviews(companyId, sortBy);
      set({
        reviews: response.data || [],
        loading: false,
      });
    } catch (err: any) {
      console.error("fetchReviews failed:", err);
      set({
        error: err.response?.data?.error || "Failed to load reviews.",
        loading: false,
      });
    }
  },

  addReview: async (companyId: string, reviewInput: CreateReviewInput): Promise<boolean> => {
    set({ loading: true, error: null });
    try {
      await apiService.addReview(companyId, reviewInput);
      set({ loading: false });
      // Refresh reviews list
      get().fetchReviews(companyId);
      return true;
    } catch (err: any) {
      console.error("addReview failed:", err);
      set({
        error: err.response?.data?.error || "Failed to submit review.",
        loading: false,
      });
      return false;
    }
  },

  likeReview: async (reviewId: string) => {
    try {
      const response = await apiService.likeReview(reviewId);
      const updatedReview = response.data;
      if (updatedReview) {
        set((state) => ({
          reviews: state.reviews.map((rev) => 
            rev._id === reviewId ? { ...rev, likes: updatedReview.likes } : rev
          ),
        }));
      }
    } catch (err) {
      console.error("likeReview failed:", err);
    }
  },

  setSortBy: (sortBy: string, companyId: string) => {
    set({ sortBy });
    get().fetchReviews(companyId);
  },
}));
