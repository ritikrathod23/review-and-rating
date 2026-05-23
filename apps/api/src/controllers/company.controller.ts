import { Request, Response, NextFunction } from "express";
import { CompanyService } from "../services/company.service";
import { companySchema } from "@repo/utils";
import { uploadToCloudinary } from "../middleware/upload.middleware";
import { ApiResponse } from "@repo/types";
import { AppError } from "../middleware/errorHandler.middleware";

export class CompanyController {
  /**
   * POST /api/companies
   * Create a new company
   */
  static async createCompany(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new AppError("Company logo image is required", 400);
      }

      // 1. Validate fields using shared Zod schema
      const companyData = companySchema.parse({
        name: req.body.name,
        website: req.body.website || "",
        foundedOn: req.body.foundedOn,
        location: req.body.location,
        city: req.body.city,
        description: req.body.description,
      });

      // 2. Upload Logo (Cloudinary fallback to local files)
      const logoUrl = await uploadToCloudinary(req.file);

      // 3. Save company inside MongoDB
      const company = await CompanyService.createCompany({
        ...companyData,
        logo: logoUrl,
      });

      const response: ApiResponse<typeof company> = {
        success: true,
        message: "Company profile created successfully",
        data: company,
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/companies
   * Listing companies with filters and pagination
   */
  static async getCompanies(req: Request, res: Response, next: NextFunction) {
    try {
      const search = req.query.search as string | undefined;
      const city = req.query.city as string | undefined;
      const page = parseInt(req.query.page as string || "1", 10);
      const limit = parseInt(req.query.limit as string || "10", 10);

      const result = await CompanyService.getCompanies(search, city, page, limit);

      res.status(200).json({
        success: true,
        data: result.companies,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/companies/:id
   * Get single company profile details
   */
  static async getCompanyById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const company = await CompanyService.getCompanyById(id);

      const response: ApiResponse<typeof company> = {
        success: true,
        data: company,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
export default CompanyController;
