import { create } from "zustand";
import { ICompany } from "@repo/types";
import { apiService } from "../lib/api";

interface CompanyState {
  companies: ICompany[];
  search: string;
  city: string;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchCompanies: () => Promise<void>;
  setSearch: (search: string) => void;
  setCity: (city: string) => void;
  setPage: (page: number) => void;
  createCompany: (formData: FormData) => Promise<boolean>;
}

export const useCompanyStore = create<CompanyState>((set, get) => ({
  companies: [],
  search: "",
  city: "all",
  page: 1,
  limit: 6,
  total: 0,
  totalPages: 1,
  loading: false,
  error: null,

  fetchCompanies: async () => {
    set({ loading: true, error: null });
    try {
      const { search, city, page, limit } = get();
      const response = await apiService.getCompanies(search, city, page, limit);
      
      set({
        companies: response.data,
        total: response.pagination.total,
        totalPages: response.pagination.totalPages,
        page: response.pagination.page,
        loading: false,
      });
    } catch (err: any) {
      console.error("fetchCompanies failed:", err);
      set({
        error: err.response?.data?.error || "Failed to load companies.",
        loading: false,
      });
    }
  },

  setSearch: (search: string) => {
    set({ search, page: 1 });
    get().fetchCompanies();
  },

  setCity: (city: string) => {
    set({ city, page: 1 });
    get().fetchCompanies();
  },

  setPage: (page: number) => {
    set({ page });
    get().fetchCompanies();
  },

  createCompany: async (formData: FormData): Promise<boolean> => {
    set({ loading: true, error: null });
    try {
      await apiService.createCompany(formData);
      set({ loading: false });
      // Refresh list
      get().fetchCompanies();
      return true;
    } catch (err: any) {
      console.error("createCompany failed:", err);
      set({
        error: err.response?.data?.error || "Failed to create company profile.",
        loading: false,
      });
      return false;
    }
  },
}));
