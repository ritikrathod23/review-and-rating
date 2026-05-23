"use client";

import { useEffect, useState } from "react";
import { useCompanyStore } from "@/store/useCompanyStore";
import { MapPin, Star, X, Calendar } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companySchema } from "@repo/utils";
import { z } from "zod";
import { Select } from "@repo/ui";

type CompanyFormData = z.infer<typeof companySchema>;

const sortOptions = [
  { value: "name", label: "Name" },
  { value: "average", label: "Average" },
  { value: "rating", label: "Rating" },
  { value: "location", label: "Location" },
]

export default function CompanyListingPage() {
  const {
    companies,
    search,
    city,
    loading,
    fetchCompanies,
    setCity,
    total,
    createCompany,
    error: storeError,
  } = useCompanyStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [sort, setSort] = useState("name");
  const [localCity, setLocalCity] = useState(city !== "all" ? city : "");

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const sortedCompanies = [...companies].sort((a, b) => {
    if (sort === "name") return (a.name || "").localeCompare(b.name || "");
    if (sort === "average") return (b.averageRating || 0) - (a.averageRating || 0);
    if (sort === "rating") return (b.totalReviews || 0) - (a.totalReviews || 0);
    if (sort === "location") return (a.location || "").localeCompare(b.location || "");
    return 0;
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      website: "",
      foundedOn: "",
      location: "",
      city: "",
      description: "Default description since the UI mockup doesn't include it.",
    },
  });


  const colors = [
    "from-pink-500 to-rose-500",
    "from-purple-500 to-indigo-500",
    "from-blue-500 to-cyan-500",
    "from-green-500 to-emerald-500",
    "from-orange-500 to-yellow-500",
    "from-red-500 to-pink-500",
  ];

  const onSubmitAddCompany = async (data: CompanyFormData) => {
    setIsSubmitting(true);

    // We need a dummy logo to pass the backend requirement since the UI doesn't have a file upload.
    // Create a 1x1 transparent PNG blob.
    const transparentPng = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    const blob = await (await fetch(`data:image/png;base64,${transparentPng}`)).blob();
    const logoFile = new File([blob], "dummy.png", { type: "image/png" });

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("website", data.website || "");
    formData.append("foundedOn", data.foundedOn);
    formData.append("location", data.location);
    formData.append("city", data.city);
    formData.append("description", "A fantastic company built on modern principles. (Auto-generated description)");
    formData.append("logo", logoFile);

    const success = await createCompany(formData);
    if (success) {
      setIsAddModalOpen(false);
      reset();
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex-1 flex flex-col justify-start">
      {/* Controls Section */}
      <div className="flex flex-col md:flex-row md:items-end gap-6 pb-8 border-b border-gray-100">

        {/* City Filter */}
        <div className="flex-1 max-w-sm">
          <label className="block text-sm font-medium text-gray-600 mb-1.5">Select City</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Indore, Madhya Pradesh, India"
              className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-md text-sm text-gray-800 focus:outline-none focus:border-[#7B2CBF]"
              value={localCity}
              onChange={(e) => setLocalCity(e.target.value)}
            />
            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#7B2CBF]" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCity(localCity || "all")}
            className="px-6 py-2.5 bg-gradient-to-r from-[#401ed4] via-[#6b13e6] to-[#af06f0] text-white text-sm font-medium rounded-md hover:bg-[#6a25a3] transition-colors shadow-sm"
          >
            Find Company
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-2.5 bg-gradient-to-r from-[#401ed4] via-[#6b13e6] to-[#af06f0] text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity shadow-sm"
          >
            + Add Company
          </button>
        </div>

        <div className="flex-1"></div>

        {/* Sort */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-600 mb-1.5">
            Sort:
          </label>
          <Select
            options={sortOptions}
            value={sort}
            onChange={setSort}
          />
        </div>
      </div>

      {/* Results Label */}
      <div className="py-4">
        <span className="text-sm font-medium text-gray-400">Result Found: {total || companies.length}</span>
      </div>

      {/* Grid listing */}
      <div className="flex-1 flex flex-col space-y-4 pb-12">
        {loading ? (
          <div className="flex-1 flex items-center justify-center py-20 min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7B2CBF]"></div>
          </div>
        ) : companies.length === 0 ? (
          // Empty State
          <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 text-center">
            <h3 className="text-lg font-bold text-gray-800">No companies found</h3>
          </div>
        ) : (
          // Data List
          <div className="space-y-4">
            {sortedCompanies.map((item) => (
              <div
                key={item._id}
                className="bg-white p-5 rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col sm:flex-row items-start sm:items-stretch gap-6"
              >
                {/* Logo Box */}
                <div
                  className={`h-28 w-28 rounded-lg flex items-center justify-center shrink-0 overflow-hidden bg-gradient-to-r ${item.name ? colors[item.name.charCodeAt(0) % colors.length] : colors[0]} shadow-sm`}
                >
                  <span className="text-white text-2xl font-bold uppercase">
                    {item.name
                      ?.split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="text-[1.1rem] font-semibold text-gray-900 mb-1.5">{item.name}</h3>
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-3">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{item.location}</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900 text-sm">
                      {item.averageRating ? item.averageRating.toFixed(1) : "0.0"}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${star <= Math.round(item.averageRating || 0)
                            ? "text-[#FFC107] fill-[#FFC107]"
                            : "text-gray-300 fill-gray-300"
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-900 text-sm font-semibold ml-2">
                      {item.totalReviews} Reviews
                    </span>
                  </div>
                </div>

                {/* Right Side (Date & Action) */}
                <div className="flex flex-col justify-between items-end sm:min-w-[160px] py-1">
                  <div className="text-xs text-gray-400 font-medium">
                    Founded on {new Date(item.foundedOn).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric"
                    }).replace(/\//g, "-")}
                  </div>

                  <Link
                    href={`/company/${item._id}`}
                    className="px-5 py-2 bg-[#333333] hover:bg-gray-800 text-white text-sm font-medium rounded-md transition-colors mt-auto"
                  >
                    Detail Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Company Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center p-4"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="bg-white w-full max-w-sm rounded-[24px] shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Top Left Decorative Shapes */}
            <div className="absolute top-0 left-0 w-32 h-32  pointer-events-none">
              <div className="absolute top-[-10px] left-[-30px] w-24 h-24 rounded-full bg-gradient-to-r from-[#af06f0] to-[#401ed4]  z-10" />
              <div className="absolute top-[-50px] left-[30px] w-24 h-24 rounded-full bg-gradient-to-br from-[#9D4EDD]/30 to-[#5A189A]/10 " />
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-gray-800 hover:text-black z-50 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="px-8 pt-12 pb-8 relative z-20">
              <h2 className="text-2xl font-bold text-center text-black mb-8">Add Company</h2>

              {storeError && (
                <div className="mb-4 text-red-500 text-xs text-center">{storeError}</div>
              )}

              <form onSubmit={handleSubmit(onSubmitAddCompany)} className="space-y-4">

                {/* Company Name */}
                <div className="space-y-1">
                  <label className="block text-[13px] text-gray-500 font-medium">Company name</label>
                  <input
                    type="text"
                    placeholder="Enter..."
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-md text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#7B2CBF]"
                    {...register("name")}
                  />
                  {errors.name && <p className="text-red-500 text-[10px]">{errors.name.message}</p>}
                </div>

                {/* Location */}
                <div className="space-y-1">
                  <label className="block text-[13px] text-gray-500 font-medium">Location</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Select Location"
                      className="w-full pl-3 pr-9 py-2.5 bg-white border border-gray-200 rounded-md text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#7B2CBF]"
                      {...register("location")}
                    />
                    <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 stroke-[1.5]" />
                  </div>
                  {errors.location && <p className="text-red-500 text-[10px]">{errors.location.message}</p>}
                </div>

                {/* Founded on */}
                <div className="space-y-1">
                  <label className="block text-[13px] text-gray-500 font-medium">Founded on</label>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full pl-3 pr-9 py-2.5 bg-white border border-gray-200 rounded-md text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#7B2CBF] appearance-none"
                      {...register("foundedOn")}
                      style={{ color: "#9CA3AF" }} // to fake the placeholder look on dates if empty, usually requires more trickery but sticking to standard
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 stroke-[1.5] pointer-events-none" />
                  </div>
                  {errors.foundedOn && <p className="text-red-500 text-[10px]">{errors.foundedOn.message}</p>}
                </div>

                {/* City */}
                <div className="space-y-1">
                  <label className="block text-[13px] text-gray-500 font-medium">City</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-md text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#7B2CBF]"
                    {...register("city")}
                  />
                  {errors.city && <p className="text-red-500 text-[10px]">{errors.city.message}</p>}
                </div>

                {/* Save Button */}
                <div className="pt-6 flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-10 py-2.5 bg-gradient-to-r from-[#b700ff] to-[#3a0ca3] text-white text-[15px] font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isSubmitting ? "Saving..." : "Save"}
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
