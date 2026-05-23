import axios from "axios";
import { 
  ICompany, 
  IReview, 
  ApiResponse, 
  PaginatedResponse, 
  CreateCompanyInput,
  CreateReviewInput 
} from "@repo/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiService = {
  // Company endpoints
  getCompanies: async (search?: string, city?: string, page = 1, limit = 6): Promise<PaginatedResponse<ICompany>> => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (city && city !== "all") params.append("city", city);
    params.append("page", String(page));
    params.append("limit", String(limit));

    const response = await apiClient.get<PaginatedResponse<ICompany>>(`/companies?${params.toString()}`);
    return response.data;
  },

  getCompanyById: async (id: string): Promise<ApiResponse<ICompany>> => {
    const response = await apiClient.get<ApiResponse<ICompany>>(`/companies/${id}`);
    return response.data;
  },

  createCompany: async (formData: FormData): Promise<ApiResponse<ICompany>> => {
    // Requires multipart/form-data for image file uploads
    const response = await apiClient.post<ApiResponse<ICompany>>("/companies", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Review endpoints
  getReviews: async (companyId: string, sortBy = "latest"): Promise<ApiResponse<IReview[]>> => {
    const response = await apiClient.get<ApiResponse<IReview[]>>(`/reviews/${companyId}?sortBy=${sortBy}`);
    return response.data;
  },

  addReview: async (companyId: string, reviewInput: CreateReviewInput): Promise<ApiResponse<IReview>> => {
    const response = await apiClient.post<ApiResponse<IReview>>(`/reviews/${companyId}`, reviewInput);
    return response.data;
  },

  likeReview: async (reviewId: string): Promise<ApiResponse<IReview>> => {
    const response = await apiClient.patch<ApiResponse<IReview>>(`/reviews/like/${reviewId}`);
    return response.data;
  },
};
