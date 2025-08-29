import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { config } from '../configs';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
  };
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'Authorization token required'
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!config.jwtSecret) {
      res.status(500).json({
        error: 'Server configuration error'
      });
      return;
    }
    console.log("decoded", token, config.jwtSecret);
    // Verify the token
    const decoded = jwt.verify(token, config.jwtSecret as string) as { id: string; username: string };
    console.log("decoded", decoded);

    next();
  } catch (error) {
    console.log("error", error);
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        error: 'Invalid token'
      });
      return;
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        error: 'Token expired'
      });
      return;
    }

    res.status(500).json({
      error: 'Internal server error'
    });
  }
};
