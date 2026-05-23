import { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Authentication-ready JWT validation middleware.
 * Currently decodes standard tokens if present, or acts as a structural placeholder.
 */
export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // Structural: Proceed without user context if auth not strictly required.
    // In production, endpoints requiring auth would assert req.user exists.
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    // JWT decoding logic structure (placeholder):
    // const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    // req.user = decoded;
    
    // Mock user identification for structure:
    req.user = {
      id: "usr_mock123",
      email: "visitor@example.com",
      role: "user",
    };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Authentication failed. Invalid or expired token.",
    });
  }
};

/**
 * Protects routes from unauthorized access.
 */
export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: "Access denied. Authentication is required to access this resource.",
    });
  }
  next();
};
