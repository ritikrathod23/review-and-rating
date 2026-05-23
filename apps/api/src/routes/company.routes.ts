import { Router } from "express";
import CompanyController from "../controllers/company.controller";
import { upload } from "../middleware/upload.middleware";

const router = Router();

// POST /api/companies - Create company profile with logo image upload
router.post("/", upload.single("logo"), CompanyController.createCompany);

// GET /api/companies - Retrieve paginated and filtered companies grid
router.get("/", CompanyController.getCompanies);

// GET /api/companies/:id - Retrieve singular company details
router.get("/:id", CompanyController.getCompanyById);

export default router;
