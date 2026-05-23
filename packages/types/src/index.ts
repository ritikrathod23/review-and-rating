export interface ICompany {
  _id: string;
  name: string;
  logo: string;
  website: string;
  foundedOn: string;
  location: string;
  city: string;
  description: string;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface IReview {
  _id: string;
  companyId: string;
  fullName: string;
  subject: string;
  review: string; // matches review schema requirements
  rating: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

// API standard response types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateCompanyInput {
  name: string;
  website: string;
  foundedOn: string;
  location: string;
  city: string;
  description: string;
  logo?: string;
}

export interface CreateReviewInput {
  fullName: string;
  subject: string;
  review: string;
  rating: number;
}
