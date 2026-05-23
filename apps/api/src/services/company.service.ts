import CompanyModel, { CompanyDocument } from "../models/company.model";
import { CreateCompanyInput } from "@repo/types";
import { AppError } from "../middleware/errorHandler.middleware";

export class CompanyService {
  /**
   * Create a new company listing
   */
  static async createCompany(input: CreateCompanyInput): Promise<CompanyDocument> {
    const existing = await CompanyModel.findOne({ name: { $regex: `^${input.name}$`, $options: "i" } });
    if (existing) {
      throw new AppError("A company with this name is already registered", 400);
    }
    return await CompanyModel.create(input);
  }

  /**
   * Get paginated, searched, and filtered companies
   */
  static async getCompanies(
    search?: string,
    city?: string,
    page: number = 1,
    limit: number = 10
  ) {
    const filterQuery: any = {};

    // Apply Search
    if (search) {
      filterQuery.$or = [
        { name: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    // Apply City Filter
    if (city && city !== "all") {
      filterQuery.city = { $regex: `^${city}$`, $options: "i" };
    }

    const skip = (page - 1) * limit;

    const [companies, total] = await Promise.all([
      CompanyModel.find(filterQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      CompanyModel.countDocuments(filterQuery),
    ]);

    return {
      companies,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Find a company by its MongoDB ID
   */
  static async getCompanyById(id: string): Promise<CompanyDocument> {
    const company = await CompanyModel.findById(id);
    if (!company) {
      throw new AppError("Company not found", 404);
    }
    return company;
  }
}
