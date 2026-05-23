"use client";

import { useEffect, useState, use } from "react";
import { useReviewStore } from "@/store/useReviewStore";
import { apiService } from "@/lib/api";
import { ICompany } from "@repo/types";
import {
  Star,
  MapPin,
  X,
} from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema } from "@repo/utils";
import { z } from "zod";

type ReviewFormData = z.infer<typeof reviewSchema>;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CompanyDetailPage({ params }: PageProps) {
  const { id: companyId } = use(params);

  const [company, setCompany] = useState<ICompany | null>(null);
  const [companyLoading, setCompanyLoading] = useState(true);
  const [companyError, setCompanyError] = useState<string | null>(null);

  const colors = [
    "from-pink-500 to-rose-500",
    "from-purple-500 to-indigo-500",
    "from-blue-500 to-cyan-500",
    "from-green-500 to-emerald-500",
    "from-orange-500 to-yellow-500",
    "from-red-500 to-pink-500",
  ];

  const randomColor = company?.name
    ? colors[company.name.charCodeAt(0) % colors.length]
    : colors[0];

  const {
    reviews,
    loading: reviewsLoading,
    fetchReviews,
    addReview,
  } = useReviewStore();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ratingVal, setRatingVal] = useState(0);
  const [ratingError, setRatingError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      fullName: "",
      subject: "",
      review: "",
      rating: 0,
    },
  });

  const loadData = async () => {
    setCompanyLoading(true);
    setCompanyError(null);
    try {
      const response = await apiService.getCompanyById(companyId);
      if (response.success && response.data) {
        setCompany(response.data);
      } else {
        setCompanyError("Failed to fetch company details.");
      }
    } catch (err: any) {
      console.error(err);
      setCompanyError(err.response?.data?.error || "Failed to load company details.");
    } finally {
      setCompanyLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    fetchReviews(companyId);
  }, [companyId]);

  const handleStarClick = (val: number) => {
    setRatingVal(val);
    setValue("rating", val, { shouldValidate: true });
    setRatingError(null);
  };

  const onSubmitReview = async (data: ReviewFormData) => {
    if (data.rating < 1) {
      setRatingError("Please select a star rating between 1 and 5");
      return;
    }

    const success = await addReview(companyId, data);
    if (success) {
      setIsModalOpen(false);
      reset();
      setRatingVal(0);
      loadData();
    }
  };

  if (companyLoading) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <div className="animate-spin h-8 w-8 border-4 border-[#7B2CBF] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (companyError || !company) {
    return (
      <div className="flex-1 flex justify-center mt-20">
        <div className="bg-white p-10 rounded-xl shadow-sm text-center border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800">Company not found</h3>
          <p className="text-gray-500 mt-2">{companyError}</p>
          <Link href="/" className="inline-block mt-4 text-[#7B2CBF] font-medium hover:underline">
            Go back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center">

      {/* Main Card Container */}
      <div className="w-full max-w-7xl bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 p-8 my-4">

        {/* Top Company Info Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-stretch gap-6 pb-8 border-b border-gray-100 relative">

          {/* Logo Box */}
          <div
            className={`h-28 w-28 rounded-lg flex items-center justify-center shrink-0 overflow-hidden bg-gradient-to-r ${randomColor} shadow-sm`}
          >
            <span className="text-white text-2xl font-bold uppercase">
              {company.name
                ?.split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)}
            </span>
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-xl font-semibold text-gray-900 mb-2">{company.name}</h1>
            <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
              <MapPin className="h-4 w-4" />
              <span>{company.location}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-bold text-gray-900 text-sm">
                {company.averageRating ? company.averageRating.toFixed(1) : "0.0"}
              </span>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4.5 w-4.5 ${star <= Math.round(company.averageRating || 0)
                      ? "text-[#FFC107] fill-[#FFC107]"
                      : "text-gray-300 fill-gray-300"
                      }`}
                  />
                ))}
              </div>
              <span className="text-gray-900 text-sm font-semibold ml-2">
                {company.totalReviews} Reviews
              </span>
            </div>
          </div>

          {/* Right Side: Founded Date & Add Review Button */}
          <div className="flex flex-col justify-between items-end min-w-[200px]">
            <span className="text-xs text-gray-400 font-medium">
              Founded on {new Date(company.foundedOn).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
              }).replace(/\//g, "-")}
            </span>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2.5 bg-gradient-to-r from-[#401ed4] via-[#6b13e6] to-[#af06f0] text-white text-sm font-semibold rounded-md hover:opacity-90 transition-opacity shadow-sm mt-4 sm:mt-0"
            >
              + Add Review
            </button>
          </div>
        </div>

        {/* Results Info */}
        <div className="py-4">
          <span className="text-sm font-medium text-gray-400">Result Found: {reviews.length}</span>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviewsLoading ? (
            <div className="animate-pulse space-y-6">
              <div className="h-24 bg-gray-100 rounded-lg w-full"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No reviews yet. Be the first to add one!
            </div>
          ) : (
            reviews.map((rev, index) => (
              <div key={rev._id} className="relative">
                <div className="flex flex-col sm:flex-row gap-4 items-start pb-6">

                  {/* User Avatar (Initials Placeholder since API doesn't have avatars) */}
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center shrink-0 overflow-hidden text-gray-600 font-bold text-lg uppercase shadow-sm">
                    {rev.fullName.charAt(0)}
                  </div>

                  <div className="flex-1 space-y-2">
                    {/* Header: Name, Date, Stars */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-[1.05rem] font-semibold text-gray-900">{rev.fullName}</h4>
                        <span className="text-xs text-gray-400 mt-0.5 block">
                          {new Date(rev.createdAt).toLocaleString("en-GB", {
                            day: "2-digit", month: "2-digit", year: "numeric",
                            hour: "2-digit", minute: "2-digit"
                          }).replace(/\//g, "-")}
                        </span>
                      </div>

                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= rev.rating
                              ? "text-[#FFC107] fill-[#FFC107]"
                              : "text-gray-300 fill-gray-300"
                              }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Review Text */}
                    <p className="text-sm text-gray-600 leading-relaxed pt-2">
                      {rev.review}
                    </p>
                  </div>
                </div>

                {/* Separator, except for the last item */}
                {index < reviews.length - 1 && (
                  <hr className="border-gray-100 mb-6" />
                )}
              </div>
            ))
          )}
        </div>

      </div>

      {/* Add Review Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-[24px] shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Top Left Decorative Shapes */}
            <div className="absolute top-0 left-0 w-32 h-32 pointer-events-none">
              <div className="absolute top-[-10px] left-[-30px] rounded-full w-24 h-24 bg-gradient-to-r from-[#af06f0] to-[#401ed4]   z-10" />
              <div className="absolute top-[-50px] left-[30px] rounded-full w-24 h-24 bg-gradient-to-br from-[#9D4EDD]/30 to-[#5A189A]/10 " />
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-800 hover:text-black z-50 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="px-8 pt-12 pb-8 relative z-20">
              <h2 className="text-2xl font-bold text-center text-black mb-8">Add Review</h2>

              <form onSubmit={handleSubmit(onSubmitReview)} className="space-y-4">

                {/* Full Name */}
                <div className="space-y-1">
                  <label className="block text-[13px] text-gray-500 font-medium">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter"
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-md text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#7B2CBF]"
                    {...register("fullName")}
                  />
                  {errors.fullName && <p className="text-red-500 text-[10px]">{errors.fullName.message}</p>}
                </div>

                {/* Subject */}
                <div className="space-y-1">
                  <label className="block text-[13px] text-gray-500 font-medium">Subject</label>
                  <input
                    type="text"
                    placeholder="Enter"
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-md text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#7B2CBF]"
                    {...register("subject")}
                  />
                  {errors.subject && <p className="text-red-500 text-[10px]">{errors.subject.message}</p>}
                </div>

                {/* Enter your Review */}
                <div className="space-y-1">
                  <label className="block text-[13px] text-gray-500 font-medium">Enter your Review</label>
                  <textarea
                    rows={4}
                    placeholder="Description"
                    className="w-full px-3 py-3 bg-white border border-gray-200 rounded-md text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#7B2CBF] resize-none"
                    {...register("review")}
                  />
                  {errors.review && <p className="text-red-500 text-[10px]">{errors.review.message}</p>}
                </div>

                {/* Rating */}
                <div className="pt-4">
                  <h3 className="text-lg font-bold text-black mb-2">Rating</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleStarClick(star)}
                        >
                          <Star
                            className={`h-10 w-10 ${star <= ratingVal
                              ? "text-[#FFC107] fill-[#FFC107]"
                              : "text-gray-200 fill-gray-200"
                              }`}
                          />
                        </button>
                      ))}
                    </div>
                    {ratingVal > 0 && (
                      <span className="text-[13px] text-gray-600 font-medium">
                        {ratingVal >= 4 ? "Satisfied" : ratingVal === 3 ? "Neutral" : "Unsatisfied"}
                      </span>
                    )}
                  </div>
                  {ratingError && <p className="text-red-500 text-[10px] mt-1">{ratingError}</p>}
                </div>

                {/* Save Button */}
                <div className="pt-8 flex justify-center">
                  <button
                    type="submit"
                    className="px-10 py-2.5 bg-gradient-to-r from-[#b700ff] to-[#3a0ca3] text-white text-[15px] font-medium rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
