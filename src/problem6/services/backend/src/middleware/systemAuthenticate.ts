import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../configs';

interface SystemAuthenticatedRequest extends Request {
  system?: boolean;
}

export const systemAuthenticate = async (req: SystemAuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'System authorization token required'
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!config.jwtSecret) {
      res.status(500).json({
        error: 'System configuration error'
      });
      return;
    }

    // Verify and decode the JWT token
    const decoded = jwt.verify(token, config.jwtSecret as string) as any;
    
    // Check if token contains system: true
    if (!decoded.system || decoded.system !== true) {
      res.status(401).json({
        error: 'Invalid system token'
      });
      return;
    }

    // Mark request as system authenticated
    req.system = true;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        error: 'Invalid system token'
      });
      return;
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        error: 'System token expired'
      });
      return;
    }

    res.status(500).json({
      error: 'Internal server error'
    });
  }
};
