"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companySchema } from "@repo/utils";
import { useCompanyStore } from "@/store/useCompanyStore";
import { Upload, ChevronLeft, Landmark, Globe, MapPin, Calendar, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";

type CompanyFormData = z.infer<typeof companySchema>;

export default function AddCompanyPage() {
  const router = useRouter();
  const { createCompany, error: storeError, loading } = useCompanyStore();
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
      description: "",
    },
  });

  // Handle image file selection
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoError(null);
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setLogoError("Logo file must be under 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setLogoError("Please select a valid image file (PNG, JPG, WEBP)");
        return;
      }
      setLogoFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: CompanyFormData) => {
    setLogoError(null);
    
    if (!logoFile) {
      setLogoError("Company logo image is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("website", data.website || "");
    formData.append("foundedOn", data.foundedOn);
    formData.append("location", data.location);
    formData.append("city", data.city);
    formData.append("description", data.description);
    formData.append("logo", logoFile);

    const success = await createCompany(formData);
    if (success) {
      setSubmitSuccess(true);
      reset();
      setLogoFile(null);
      setLogoPreview(null);
      
      // Auto redirect to listing page after 2 seconds
      setTimeout(() => {
        router.push("/");
      }, 2500);
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto space-y-6 flex-1 flex flex-col justify-center">
      {/* Back button */}
      <div>
        <Link 
          href="/" 
          className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-sm font-semibold transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Listings
        </Link>
      </div>

      {submitSuccess ? (
        // Success Overlay View
        <div className="glass-panel p-10 rounded-2xl border border-purple-500/20 text-center space-y-6 shadow-2xl">
          <div className="h-16 w-16 rounded-full bg-purple-950/50 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400 animate-bounce">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-white">Company Registered!</h2>
            <p className="text-slate-400 text-sm max-w-sm mx-auto font-medium">
              The company profile was registered successfully. Redirecting you to the home hub dashboard...
            </p>
          </div>
          <div className="flex justify-center">
            <div className="h-1.5 w-24 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full animate-[loading_2.5s_ease-in-out]" style={{ width: "100%" }} />
            </div>
          </div>
        </div>
      ) : (
        // Main Form Block
        <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/5 shadow-2xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-black text-white">Register Company</h2>
            <p className="text-slate-400 text-sm font-medium">
              Submit a company profile to open it for public rating and review submissions.
            </p>
          </div>

          {storeError && (
            <div className="p-4 bg-red-950/40 border border-red-800/30 text-red-300 rounded-xl text-sm font-medium">
              ⚠️ {storeError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Logo upload Dropzone */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Company Logo *</label>
              <div className="flex items-center gap-6">
                {/* Logo Preview Container */}
                <div className="h-20 w-20 rounded-2xl bg-slate-950 border border-white/5 p-2 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                  {logoPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={logoPreview} 
                      alt="Logo preview" 
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <Landmark className="h-8 w-8 text-slate-700" />
                  )}
                </div>

                {/* Upload Trigger Area */}
                <div className="flex-1">
                  <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-white/10 hover:border-purple-500/50 rounded-xl p-4 cursor-pointer hover:bg-white/[0.02] transition-all group">
                    <Upload className="h-5 w-5 text-slate-400 group-hover:text-purple-400 transition-colors" />
                    <span className="text-xs font-semibold text-slate-300 mt-2">
                      {logoFile ? "Change Logo" : "Upload PNG, JPG or WEBP"}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5">Max size 5MB</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleLogoChange}
                    />
                  </label>
                </div>
              </div>
              {logoError && (
                <p className="text-red-400 text-xs mt-1 font-semibold">{logoError}</p>
              )}
            </div>

            {/* Input grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-semibold text-slate-300">Company Name *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Landmark className="h-4 w-4" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    placeholder="e.g. Acme Corporation"
                    className="block w-full pl-9 pr-3 py-2.5 bg-slate-900/60 border border-white/5 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                    {...register("name")}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-400 text-xs font-semibold">{errors.name.message}</p>
                )}
              </div>

              {/* Website */}
              <div className="space-y-2">
                <label htmlFor="website" className="text-sm font-semibold text-slate-300">Website URL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Globe className="h-4 w-4" />
                  </div>
                  <input
                    id="website"
                    type="text"
                    placeholder="https://example.com"
                    className="block w-full pl-9 pr-3 py-2.5 bg-slate-900/60 border border-white/5 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                    {...register("website")}
                  />
                </div>
                {errors.website && (
                  <p className="text-red-400 text-xs font-semibold">{errors.website.message}</p>
                )}
              </div>

              {/* Founded On */}
              <div className="space-y-2">
                <label htmlFor="foundedOn" className="text-sm font-semibold text-slate-300">Founded Date *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <input
                    id="foundedOn"
                    type="date"
                    className="block w-full pl-9 pr-3 py-2.5 bg-slate-900/60 border border-white/5 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                    {...register("foundedOn")}
                  />
                </div>
                {errors.foundedOn && (
                  <p className="text-red-400 text-xs font-semibold">{errors.foundedOn.message}</p>
                )}
              </div>

              {/* City */}
              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-semibold text-slate-300">City *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <input
                    id="city"
                    type="text"
                    placeholder="e.g. San Francisco"
                    className="block w-full pl-9 pr-3 py-2.5 bg-slate-900/60 border border-white/5 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                    {...register("city")}
                  />
                </div>
                {errors.city && (
                  <p className="text-red-400 text-xs font-semibold">{errors.city.message}</p>
                )}
              </div>

              {/* Full Location */}
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="location" className="text-sm font-semibold text-slate-300">Full Address / Location *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <input
                    id="location"
                    type="text"
                    placeholder="e.g. 555 Mission St, San Francisco, CA"
                    className="block w-full pl-9 pr-3 py-2.5 bg-slate-900/60 border border-white/5 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                    {...register("location")}
                  />
                </div>
                {errors.location && (
                  <p className="text-red-400 text-xs font-semibold">{errors.location.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="description" className="text-sm font-semibold text-slate-300">Description *</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 flex items-start pointer-events-none text-slate-500">
                    <FileText className="h-4 w-4" />
                  </div>
                  <textarea
                    id="description"
                    rows={4}
                    placeholder="Provide a detailed description of what the company does, its core products, and market space..."
                    className="block w-full pl-9 pr-3 py-2.5 bg-slate-900/60 border border-white/5 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all resize-none"
                    {...register("description")}
                  />
                </div>
                {errors.description && (
                  <p className="text-red-400 text-xs font-semibold">{errors.description.message}</p>
                )}
              </div>
            </div>

            {/* Form Submit buttons */}
            <div className="border-t border-white/5 pt-6 flex items-center justify-end gap-4">
              <Link
                href="/"
                className="px-5 py-2.5 bg-slate-900 border border-white/5 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl text-sm transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none text-white font-bold rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-purple-950/20"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Registering...
                  </>
                ) : (
                  "Create Company Profile"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
